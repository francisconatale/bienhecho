# Implementation Plan: Persistir totales de cuentas a cobrar

**Branch**: `011-persistir-totales-cobros` | **Date**: 2026-08-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `presupuestito-web/specs/011-persistir-totales-cobros/spec.md`

## Summary

Persistir en `trabajos` los agregados de cuentas a cobrar (`total_estimado`, `total_cobrado`, `saldo_pendiente`) y mantenerlos con un único trigger function idempotente que se dispara ante cambios en `tareas`, `materiales` y `cobros`, absorbiendo además el auto-paso a `pagado`. Sincronizar la cuenta corriente (`transacciones`) al editar/borrar cobros (abono ajustado + cargo de anulación con auditoría). El frontend deja de calcular en runtime y lee los campos persistidos, eliminando la divergencia entre la sidebar, el panel Cuentas a Cobrar y el detalle de cliente.

## Technical Context

**Language/Version**: TypeScript / Next.js (App Router) / PostgreSQL (Supabase)

**Primary Dependencies**: @tanstack/react-query, supabase-js, Tailwind CSS

**Storage**: PostgreSQL via Supabase. Migraciones en `presupuestito-web/supabase/migrations/`. Dumps de referencia: `presupuestito-web/schema.sql` y `presupuestito/schema.sql`.

**Testing**: Verificación manual vía Supabase Studio/SQL + navegación de la app. No hay suite automatizada para triggers (verificar `package.json` antes de asumir).

**Target Platform**: Web App (responsive, mobile-first).

**Project Type**: Next.js web application, frontend + Supabase backend.

**Performance Goals**: Lectura del saldo en una única query a `trabajos`; los triggers recalculan solo el trabajo afectado (volumen: usuario individual, sin necesidad de índices adicionales).

**Constraints**: Respetar `docs/database_relations.md` (actualizarlo ANTES de migrar, regla de AGENTS.md). Respetar el state machine `borrador → presupuestado → pagado` (constitution II). Valores monetarios `numeric`, nunca float.

**Scale/Scope**: Tabla `trabajos` + 3 triggers + 3 funciones; 4 archivos de frontend; 1 migración.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Simplicity First**: La solución agrega columnas y triggers que reemplazan lógica client-side duplicada (net: menos código). No introduce abstracciones ni infraestructura nueva. ✅
- **II. Data Integrity for Financial Records**: Los montos siguen en `numeric`. El auto-paso a `pagado` se mantiene dentro del state machine y `pagado` sigue siendo terminal. El abono se ajusta y el borrado se audita (cargo de anulación), evitando pérdida de rastro financiero. ✅
- **III. Separation of Concerns (Tareas vs Visitas)**: No se toca el modelo de visitas; solo tareas (billables), materiales y cobros. ✅
- **IV. Type Safety at Boundaries**: El tipo `Job` se actualiza; los nuevos campos se exponen tipados. ✅
- **V. Progressive Enhancement**: Sin impacto en responsividad; el panel sigue siendo el mismo. ✅

No hay violaciones; la tabla de Complexity Tracking queda vacía.

## Project Structure

### Documentation (this feature)

```text
presupuestito-web/specs/011-persistir-totales-cobros/
├── spec.md              # (/speckit-specify)
├── research.md          # (/speckit-plan - Phase 0)
├── data-model.md        # (/speckit-plan - Phase 1)
├── plan.md              # (/speckit-plan - este archivo)
├── quickstart.md        # (/speckit-plan - Phase 1)
└── tasks.md             # (/speckit-tasks - pendiente)
```

### Source Code

```text
presupuestito-web/
├── supabase/
│   └── migrations/
│       └── 20260810100000_persistir_totales_cobros.sql   # NUEVO: columnas + funciones + triggers + backfill
├── docs/
│   └── database_relations.md                             # MOD: columna `trabajos` + documentación de triggers
├── schema.sql                                            # MOD: dump sincronizado (raíz web)
├── ../schema.sql                                         # MOD: dump sincronizado (raíz repo, si aplica)
└── src/
    ├── types/
    │   └── index.ts                                      # MOD: campos nuevos en `Job`
    ├── app/(dashboard)/trabajos/
    │   ├── components/trabajo-detail.tsx                 # MOD: sidebar usa job.total_estimado
    │   ├── [id]/hooks/use-payments.ts                    # MOD: leer totales persistidos (dropear query de materiales)
    │   └── [id]/components/job-summary-cards.tsx         # MOD (si ajusta): consumir saldoPendiente sin cambios
    └── app/(dashboard)/clientes/
        └── components/client-detail-pane.tsx             # MOD: usar job.saldo_pendiente; eliminar jobMetrics saldo
```

**Structure Decision**: Cambios in-place sobre los archivos existentes. No se crean módulos nuevos; el patrón trigger-unificado evita infraestructura extra.

## Fases de Implementación

### Fase 1 — Migración de base de datos

1. Crear `supabase/migrations/20260810100000_persistir_totales_cobros.sql`:
   - `ALTER TABLE trabajos ADD COLUMN` ×3 (`total_estimado`, `total_cobrado`, `saldo_pendiente`).
   - Crear `recalcular_trabajo_totales()`, `sync_material_subtotal()`, `sync_abono_cobro_update()`, `revertir_abono_cobro_delete()`.
   - Dropear triggers/funciones obsoletos: `on_tarea_change_update_presupuesto`, `update_trabajo_presupuesto()`, `on_cobro_insert_check_pagado`, `check_trabajo_pagado()`.
   - Crear triggers nuevos (según `data-model.md`): `on_tarea_change_recalcular`, `on_material_subtotal_sync`, `on_material_change_recalcular`, `on_cobro_change_recalcular`, `on_cobro_update_sync_abono`, `on_cobro_delete_revert`.
   - Backfill (SQL de `data-model.md`).
2. Aplicar migración (`supabase db push` o equivalente del proyecto) y validar con queries del `quickstart.md`.
3. Actualizar `docs/database_relations.md`: columnas nuevas, funciones/triggers (mantener sección "Enumerados" si corresponde).
4. Sincronizar dumps `schema.sql` (raíz web y repo) con el nuevo estado.

### Fase 2 — Frontend

5. Actualizar el tipo `Job` en `src/types/index.ts` con `total_estimado`, `total_cobrado`, `saldo_pendiente`.
6. Refactor `use-payments.ts`:
   - Leer `job.total_estimado` / `job.total_cobrado` / `job.saldo_pendiente`.
   - Eliminar la query de `materiales` y el cálculo de `totalMateriales` (el desglose de materiales lo provee `useMaterials` en `job-summary-cards`).
   - Mantener la query de `cobros` (lista) y las mutaciones.
7. `trabajo-detail.tsx`: la sidebar usa `job.total_estimado` como total; mantener el desglose tareas/materiales en vivo solo para display.
8. `client-detail-pane.tsx`:
   - Eliminar las queries de `materiales`/`cobros` para métricas; usar `job.total_estimado`/`job.saldo_pendiente`.
   - Mantener la query de `tareas` solo para el progreso (`completedTasks/totalTasks`).
9. Verificación manual con `quickstart.md` + pruebas en la app (`npm run dev`).

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

Sin violaciones. No aplica.

## Done When

- [ ] Migración aplicada y validada (columnas + triggers + backfill + auto-pagado).
- [ ] Cuenta corriente sincronizada al editar/borrar cobros (abono ajustado + cargo de anulación).
- [ ] `use-payments`, sidebar y `client-detail-pane` leen los campos persistidos (sin recálculo client-side).
- [ ] `docs/database_relations.md` y dumps `schema.sql` actualizados.
- [ ] `quickstart.md` verificado end-to-end.
