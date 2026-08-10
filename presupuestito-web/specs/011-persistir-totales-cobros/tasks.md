# Tasks: Persistir totales de cuentas a cobrar

**Input**: Design documents from `presupuestito-web/specs/011-persistir-totales-cobros/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: No se requieren tests automatizados en la spec. La validación se hace con los escenarios de `quickstart.md` (SQL + manual).

**Organization**: Tasks grouped by user story. `presupuestito-web/` es la raíz del proyecto; todos los paths son relativos a ella salvo indicación.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1/US2/US3/US4 (user stories de spec.md)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Contexto del feature listo para implementar

- [X] T001 Crear la rama de trabajo `011-persistir-totales-cobros` desde la rama actual (git checkout -b) y verificar que `presupuestito-web/.specify/feature.json` apunta a `specs/011-persistir-totales-cobros`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Migración de BD + documentación + tipos. BLOQUEA todas las user stories (el frontend lee las columnas nuevas).

**⚠️ CRITICAL**: No comenzar user stories hasta completar esta fase.

- [X] T002 Actualizar `presupuestito-web/docs/database_relations.md` (ANTES de migrar, regla de AGENTS.md): agregar a `trabajos` las columnas `total_estimado`, `total_cobrado`, `saldo_pendiente` (numeric(10,2) NOT NULL DEFAULT 0) y documentar funciones/triggers según `data-model.md`

- [X] T003 Crear `presupuestito-web/supabase/migrations/20260810100000_persistir_totales_cobros.sql` con el `ALTER TABLE public.trabajos ADD COLUMN` de las 3 columnas (usar `IF NOT EXISTS`, formato de las migraciones existentes)

- [X] T004 [US2] Agregar al archivo de migración las funciones `recalcular_trabajo_totales()`, `sync_material_subtotal()`, `sync_abono_cobro_update()` y `revertir_abono_cobro_delete()` (SQL exacto en `specs/011-persistir-totales-cobros/data-model.md`, secciones 1-4)

- [X] T005 [US2] Agregar al archivo de migración los DROPs de obsoletos: trigger `on_tarea_change_update_presupuesto` + función `update_trabajo_presupuesto()`, y trigger `on_cobro_insert_check_pagado` + función `check_trabajo_pagado()` (la lógica de auto-pagado queda absorbida en `recalcular_trabajo_totales`)

- [X] T006 [US2] Agregar al archivo de migración los triggers nuevos según la tabla de `data-model.md`: `on_tarea_change_recalcular`, `on_material_subtotal_sync`, `on_material_change_recalcular`, `on_cobro_change_recalcular`, `on_cobro_update_sync_abono`, `on_cobro_delete_revert`

- [X] T007 [US2] Agregar al archivo de migración el backfill `UPDATE public.trabajos` (SQL en `data-model.md` sección Backfill)

- [ ] T008 Aplicar la migración con `supabase db push` y ejecutar la query de consistencia del paso 2 de `quickstart.md` (debe devolver 0 filas) **[PENDIENTE: lo aplica el usuario manualmente]**

- [ ] T009 [P] Sincronizar los dumps `presupuestito-web/schema.sql` y `presupuestito/schema.sql` con el nuevo estado (columnas + funciones + triggers) **[PENDIENTE: requiere migración aplicada para regenerar dumps]**

- [X] T010 Actualizar el tipo `Job` en `presupuestito-web/src/types/index.ts` agregando `total_estimado: number`, `total_cobrado: number`, `saldo_pendiente: number` (sin tocar campos existentes)

**Checkpoint**: Base de datos con totales persistidos y tipados; comienzan las user stories.

---

## Phase 3: User Story 1 - El saldo no cambia solo al entrar (Priority: P1) 🎯 MVP

**Goal**: `/trabajos/[id]` y `?view=pagos` leen los totales persistidos; el frontend deja de sumar tareas/materiales/cobros en runtime.

**Independent Test**: Recargar el mismo trabajo sin tocar datos y verificar que total estimado / total cobrado / saldo pendiente quedan idénticos y coinciden entre sidebar y panel Cuentas a Cobrar.

### Implementation for User Story 1

- [X] T011 [US1] Refactor `presupuestito-web/src/app/(dashboard)/trabajos/[id]/hooks/use-payments.ts`: leer `job.total_estimado`, `job.total_cobrado`, `job.saldo_pendiente` de la query `job`; ELIMINAR la query de `materiales` y el cálculo `totalMateriales`/`presupuestoTotal` local; mantener la query de `cobros` y las mutaciones; mantener el mismo shape de retorno (`presupuestoTotal`, `totalCobrado`, `saldoPendiente`, `cobros`, `isLoading` sin `isLoadingMaterials`)
- [X] T012 [US1] Verificar `presupuestito-web/src/app/(dashboard)/trabajos/[id]/components/job-summary-cards.tsx` (consume `saldoPendiente` de `usePayments` y `totalMateriales` de `useMaterials`) sin cambios funcionales; ajustar `isLoading` si queda una referencia rota a `totalMateriales`

**Checkpoint**: US1 funcional — el saldo se lee persistido, sin recálculo al entrar.

---

## Phase 4: User Story 2 - Los totales se mantienen al modificar tareas, materiales o cobros (Priority: P1)

**Goal**: Los triggers mantienen `presupuesto`, `total_estimado`, `total_cobrado`, `saldo_pendiente` y el auto-paso a `pagado`.

**Independent Test**: Editar precio de tarea / agregar material / registrar cobro y verificar en SQL que los agregados se recalculan; saldo 0 → `pagado` automático.

### Implementation for User Story 2

- [ ] T013 [US2] Validar el comportamiento de triggers según quickstart pasos 4-5 (precio de tarea, `subtotal` de material forzado = cantidad × precio_unitario, total_estimado/saldo actualizados, auto-paso a `pagado`); si algún escenario falla, corregir las funciones/triggers en el archivo de migración y re-aplicar (`supabase db push --force-reapply` solo para el archivo modificado, o corregir como nueva migración según convención del proyecto) **[PENDIENTE: requiere migración aplicada]**

**Checkpoint**: US2 funcional — los totales persistidos se mantienen consistentes ante cambios.

---

## Phase 5: User Story 3 - La cuenta corriente queda consistente al editar o borrar un cobro (Priority: P2)

**Goal**: Al editar un cobro se ajusta el `abono`; al borrar se inserta un `cargo` de anulación (auditoría), saldo neto en cero.

**Independent Test**: Registrar un cobro de $100, borrarlo y verificar que `transacciones` queda con un abono de $100 + un cargo de anulación de $100 y que `trabajos.total_cobrado` vuelve a 0.

### Implementation for User Story 3

- [ ] T014 [US3] Validar quickstart pasos 6-7: al editar `monto_cobrado`/`fecha_cobro` el `abono` (referencia_cobro_id) se sincroniza; al eliminar el cobro se inserta el cargo "Anulación de cobro: {título}". Si falla, corregir `sync_abono_cobro_update`/`revertir_abono_cobro_delete` en la migración (o nueva migración de fix según convención) y re-validar **[PENDIENTE: requiere migración aplicada]**

**Checkpoint**: US3 funcional — la cuenta corriente queda consistente con auditoría.

---

## Phase 6: User Story 4 - El frontend usa una sola fuente de verdad (Priority: P2)

**Goal**: La sidebar de `trabajo-detail` y el detalle de cliente usan los campos persistidos; se elimina la divergencia de fórmulas.

**Independent Test**: Abrir el mismo trabajo desde `/trabajos/[id]` y desde el detalle de cliente y verificar que total estimado y "Debe X" coinciden.

### Implementation for User Story 4

- [X] T015 [US4] En `presupuestito-web/src/app/(dashboard)/trabajos/components/trabajo-detail.tsx` (líneas ~245-248): la sidebar usa `job.total_estimado` como total; mantener el desglose tareas (`totalEstimado` en vivo) y materiales (`totalMateriales`) SOLO para display de la sección "Total estimado"
- [X] T016 [P] [US4] En `presupuestito-web/src/app/(dashboard)/clientes/components/client-detail-pane.tsx`: reemplazar el recálculo de `jobMetrics` (líneas ~101-138) para usar `job.total_estimado` / `job.saldo_pendiente` de la query de trabajos; eliminar las queries de `materiales` y `cobros` del `queryFn` (mantener la de `tareas` solo para el progreso `completedTasks/totalTasks`); quitar `materialsCost`, `totalCobrado` y `totalEstimado`/`saldoPendiente` calculados donde ya no se usen

**Checkpoint**: US4 funcional — una sola fuente de verdad para los totales.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validación integral y contexto del agente

- [ ] T017 [P] Ejecutar `presupuestito-web/specs/011-persistir-totales-cobros/quickstart.md` end-to-end (pasos 1-8) y verificar que todos los escenarios pasan (backfill 0 filas, auto-pagado, edición/borrado de cobro, consistencia frontend) **[PENDIENTE: requiere migración aplicada]**
- [X] T018 [P] Actualizar el bloque SPECKIT de `presupuestito-web/AGENTS.md` para apuntar al plan vigente `specs/011-persistir-totales-cobros/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (T001)**: No dependencies
- **Foundational (T002-T010)**: Depends on T001. BLOQUEA todas las user stories
- **US1 (T011-T012)**: Depends on Foundational (T010 en particular)
- **US2 (T013)**: Depends on Foundational (migración aplicada)
- **US3 (T014)**: Depends on Foundational (migración aplicada)
- **US4 (T015-T016)**: Depends on Foundational (T010) y se beneficia de US1
- **Polish (T017-T018)**: Depends on todas las user stories

### User Story Dependencies

- **US1 (P1)**: Solo Foundational
- **US2 (P1)**: Solo Foundational (los triggers se implementan en Foundational, T004-T007)
- **US3 (P2)**: Solo Foundational
- **US4 (P2)**: Foundational + US1 (lectura de persistidos)

### Within Each User Story

- Migración antes de frontend
- Validación SQL antes de marcar completa

### Parallel Opportunities

- T009 y T010 (fase Foundational) corren en paralelo: archivos distintos (`schema.sql` ×2 vs `types/index.ts`)
- US1, US2, US3 pueden validarse en paralelo tras la migración (contextos independientes: frontend vs SQL)
- T016 [US4] es independiente de T015 (archivos distintos)

---

## Parallel Example: Fase Foundational

```bash
# Tras aplicar la migración (T008):
Task: "T009 Sincronizar dumps schema.sql"
Task: "T010 Actualizar tipo Job en types/index.ts"
```

---

## Implementation Strategy

### MVP First (US1 + base de US2)

1. Phase 1 (T001)
2. Phase 2 (T002-T010) — la migración incluye los triggers de US2
3. Phase 3 (T011-T012) — US1 (leer persistidos)
4. **STOP and VALIDATE**: quickstart pasos 2-5 (backfill + sin recálculo + triggers)
5. Deploy/demo si está listo

### Incremental Delivery

1. Foundation → saldos persistidos en BD (US2 ya queda implementado en la migración)
2. US1 → frontend sin recálculo (MVP)
3. US3 → cuenta corriente con auditoría
4. US4 → una sola fuente de verdad
5. Polish → quickstart end-to-end + AGENTS.md

---

## Notes

- La migración se numera `20260810100000_...` (no colisiona con `20260810000000_get_smart_suggestions.sql`)
- [P] tasks = different files, no dependencies
- Commit después de cada fase o grupo lógico (preguntar al usuario antes de commitear; los auto-commits del flujo speckit solo los ejecutan los hooks del CLI)
