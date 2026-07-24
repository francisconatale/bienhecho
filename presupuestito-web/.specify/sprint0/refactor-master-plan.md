# Plan Maestro de Refactorización — Feature-Based Architecture

## Estado Actual del Repo

| Feature | Archivos | Líneas | Problema Principal |
|---|---|---|---|
| Clientes | 10 | ~1.013 | client-list monolítico (223L), import muerto, circularidad padre-hijo |
| Trabajos | 30 | ~3.500+ | trabajo-detail monolito (419L), 7 responsabilidades, hooks fuera de feature |
| Agenda | 1 | 589 | page.tsx contiene AgendaPage + VisitForm + calendario todo junto |
| Tareas | 3 | ~200 | Sin components/, sin patrón feature-based |
| Ajustes | 4 | ~150 | Aurora background duplicado inline |
| Store | 1 | 573 | Monolito con 9 entidades, cascada cross-slice inline |
| Types | 1 | 97 | Todos los tipos juntos |
| Aurora | 5 archivos | ~100 | Copy-paste en layout, trabajo-detail, ajustes, perfil |

---

## Orden Global de Ejecución

| Fase | Plan | Dependencias | Esfuerzo |
|---|---|---|---|
| 1 | **Types** — Dividir por feature | Ninguna | Bajo |
| 2 | **Limpieza** — Eliminar mocks/ muerto | Ninguna | Bajo |
| 3 | **Aurora** — Componente compartido | Ninguna | Medio |
| 4 | **Store** — Dividir en slices | Fase 1 (types ya divididos) | Alto |
| 5 | **Clientes** — Migrar a features/ | Fase 1, 4 | Medio |
| 6 | **Trabajos** — Migrar a features/ | Fase 1, 4 | Alto |
| 7 | **Agenda** — Migrar a features/ | Fase 1, 4 | Medio |
| 8 | **Tareas** — Migrar a features/ | Fase 1, 4 | Bajo |
| 9 | **Verificación final** — tsc + tests | Todas las anteriores | Bajo |

---

## Fase 1: Types — Dividir por Feature

**Objetivo:** Separar `src/types/index.ts` (97 líneas) en archivos por dominio.

### Archivos a crear
```
src/types/
  index.ts              ← Barrel: re-exporta todo
  client.ts             ← Client
  job.ts                ← Job, JobStatus
  task.ts               ← Task, TaskPhoto
  visit.ts              ← Visit, VisitStatus, VisitaTarea
  material.ts           ← Material
  cobro.ts              ← Cobro
  cuenta-corriente.ts   ← TransaccionCuentaCorriente
```

### Pasos
1. Crear cada archivo tipo moviendo la interface correspondiente
2. Actualizar `src/types/index.ts` como barrel de re-exports
3. Verificar: `npx tsc --noEmit`

**Riesgo:** Ninguno. Los 17 archivos que importan `from "@/types"` siguen funcionando.

---

## Fase 2: Limpieza — Eliminar Código Muerto

### Pasos
1. Verificar que `src/mocks/index.ts` no tiene imports: `grep -r "from.*mocks" src/`
2. Eliminar `src/mocks/index.ts`
3. Eliminar directorio `src/mocks/` si queda vacío

**Riesgo:** Ninguno.

---

## Fase 3: Aurora — Componente Compartido

**Objetivo:** Eliminar la duplicación de aurora backgrounds en 5 archivos.

### Archivo a crear
```
src/components/ui/aurora-background.tsx
```

### Interface
```tsx
type AuroraPreset = "layout" | "ajustes" | "perfil" | "trabajo" | "dashboard";

interface AuroraBackgroundProps {
  preset?: AuroraPreset;
  className?: string;
}
```

### Archivos a modificar
| Archivo | Cambio |
|---|---|
| `src/app/layout.tsx` | Reemplazar aurora inline por `<AuroraBackground preset="layout" />` |
| `src/app/ajustes/page.tsx` | Reemplazar 23 líneas de aurora por `<AuroraBackground preset="ajustes" />` |
| `src/app/ajustes/perfil/page.tsx` | Reemplazar aurora por `<AuroraBackground preset="perfil" />` |
| `src/app/trabajos/components/trabajo-detail.tsx` | Reemplazar aurora por `<AuroraBackground preset="trabajo" />` |
| `src/app/(dashboard)/components/dashboard-hero.tsx` | Reemplazar aurora por `<AuroraBackground preset="dashboard" />` |

**Riesgo:** Medio. Verificar visualmente cada página después del cambio.

---

## Fase 4: Store — Dividir en Slices

**Objetivo:** Convertir `src/lib/store.ts` (573 líneas) en slices independientes.

### Estructura destino
```
src/lib/store/
  index.ts                    ← Re-exporta useDataStore (compatibilidad)
  slices/
    clients-slice.ts          ← Client CRUD
    jobs-slice.ts             ← Job CRUD
    tasks-slice.ts            ← Task CRUD + reorder
    task-photos-slice.ts      ← TaskPhoto CRUD
    visits-slice.ts           ← Visit + VisitaTarea CRUD
    materials-slice.ts        ← Material CRUD
    cobros-slice.ts           ← Cobro CRUD
    transacciones-slice.ts    ← Transaccion CRUD + runCCMigration
  middleware/
    cross-slice-sync.ts       ← Cascada: presupuesto recalc, transacciones
```

### Pasos
1. Crear `src/lib/store/` con subdirectorios
2. Extraer cada slice (clients, jobs, tasks, etc.)
3. Crear `cross-slice-sync.ts` con la lógica de cascada:
   - `addTask/updateTask/removeTask` → recalcular `jobs[].presupuesto` + crear transacción
   - `addCobro/removeCobro` → crear transacción de reversión/abono
   - `removeJob` → borrar tasks + crear transacción de anulación
4. Componer slices en `index.ts` con `create<DataState>()(persist(...))`
5. Crear barrel `src/lib/store.ts` que re-exporte desde `./store/index`
6. Migrar `src/lib/user-store.ts` a `zustand/persist`
7. Verificar: `npx tsc --noEmit`

### Nota de compatibilidad
El barrel `src/lib/store.ts` mantiene la API pública. Los 26+ archivos que importan `from "@/lib/store"` no necesitan cambios.

**Riesgo:** Alto. La cascada cross-slice es delicada. Verificar que la migración de persist (`version: 1`) sigue funcionando.

---

## Fase 5: Clientes — Migrar a features/

### Estructura destino
```
src/features/clientes/
  index.ts
  types.ts                    ← Re-exports desde @/types
  lib/
    utils.ts                  ← getStatusColor (extraído de client-detail-pane)
  hooks/
    use-client-form.ts        ← Movido de components/
    use-cuenta-corriente.ts   ← Movido de src/hooks/
  components/
    client-list.tsx           ← Refactorizado (~170L)
    client-list-item.tsx      ← NUEVO (extraído de client-list)
    client-detail-pane.tsx    ← Sin getStatusColor
    client-header-card.tsx
    client-cuenta-corriente-card.tsx
    client-jobs-card.tsx
    ajuste-manual-form.tsx
    client-form.tsx
```

### Pasos
1. Crear directorios vacíos
2. Crear `types.ts` con re-exports
3. Crear `lib/utils.ts` con `getStatusColor` → **rompe circularidad padre-hijo**
4. Mover `use-client-form.ts` a `hooks/`
5. Mover `use-cuenta-corriente.ts` a `hooks/` (elimina de `src/hooks/`)
6. Mover componentes hoja (ajuste-manual-form, client-form, client-jobs-card, etc.)
7. Extraer `client-list-item.tsx` de `client-list.tsx`
8. Refactorizar `client-list.tsx` (elimina import muerto de useClientForm)
9. Mover `client-detail-pane.tsx`
10. Crear barrel `index.ts`
11. Actualizar `src/app/clientes/page.tsx` para importar desde `@/features/clientes`
12. Eliminar `src/app/clientes/components/` y `src/hooks/use-cuenta-corriente.ts`

### Hallazgos especiales
- **Import muerto:** `useClientForm` en `client-list.tsx` línea 18 — eliminar
- **Circularidad:** `client-jobs-card` importa `getStatusColor` de `client-detail-pane` (su hermano) → extraer a `lib/utils.ts`

**Riesgo:** Bajo-Medio.

---

## Fase 6: Trabajos — Migrar a features/

*Plan detallado en: `specs/refactor-trabajos-plan.md`*

### Estructura destino
```
src/features/trabajos/
  types.ts
  store.ts                    ← Selectores memoizados
  hooks/
    use-materials.ts
    use-payments.ts
    use-budget-pdf.ts
    use-job-detail.ts         ← NUEVO (~55L)
    use-job-pdf-dialog.ts     ← NUEVO (~50L)
  components/
    trabajo-detail.tsx        ← ORQUESTADOR LIVIANO (~120L)
    job-list.tsx
    detail/
      job-breadcrumb.tsx      ← NUEVO
      pdf-dialog.tsx          ← NUEVO
      sidebar-budget.tsx      ← NUEVO
      materials-card.tsx      ← NUEVO
      payments-card.tsx       ← NUEVO
      task-overlay.tsx        ← NUEVO
    job-header.tsx
    job-status.tsx
    progress-bar.tsx
    tasks/
      task-list.tsx, task-item.tsx, task-form.tsx
      task-detail-panel.tsx   ← Compartido con /tareas
      task-photos.tsx, photo-upload.tsx
    materials/
      material-form.tsx, material-item.tsx, material-list.tsx
    payments/
      payments-dashboard.tsx, cobro-form.tsx
```

### Descomposición de trabajo-detail.tsx (419L → ~120L)

| Responsabilidad | Líneas originales | Componente/Hook nuevo |
|---|---|---|
| Aurora background | 141-155 | `AuroraBackground` (componente compartido Fase 3) |
| Navegación + breadcrumb | 134-135, 157-167, 211-228 | `job-breadcrumb.tsx` (~30L) |
| Estado edición header | 39-52 | Absorbido por `use-job-detail.ts` |
| Overlay mobile task | 171-179, 201-208 | `task-overlay.tsx` (~15L) |
| Cards materiales/pagos | 232-277 | `materials-card.tsx` + `payments-card.tsx` (~25L c/u) |
| Sidebar presupuesto | 284-380 | `sidebar-budget.tsx` (~95L) |
| Modal PDF | 385-416 | `pdf-dialog.tsx` (~35L) |
| Lógica PDF | 89-133 | `use-job-pdf-dialog.ts` (~50L) |
| Orquestación general | 35-37, 54-69, 71-88 | `use-job-detail.ts` (~55L) |

### Dependencia externa
`src/app/tareas/[id]/page.tsx` importa `TaskDetailPanel` → actualizar import a `@/features/trabajos/components/tasks/task-detail-panel`

### Fases de ejecución (7 fases)
1. Crear estructura + tipos + store
2. Migrar hooks (copia + ajuste imports)
3. Migrar componentes hoja (sin dependencias internas)
4. Descomponer trabajo-detail.tsx en sub-componentes + hooks
5. Migrar job-list.tsx
6. Actualizar wrappers de páginas Next.js + consumidor externo (/tareas)
7. Limpiar archivos originales, verificar con `tsc --noEmit`

**Riesgo:** Alto. Feature más grande del proyecto.

---

## Fase 7: Agenda — Migrar a features/

### Estructura destino
```
src/features/agenda/
  types.ts                    ← Re-exports + MONTHS, STATUS_OPTIONS, STATUS_TRANSITIONS
  hooks/
    use-agenda-calendar.ts    ← NUEVO (~45L) — year/month/day, prev/next/today
    use-agenda-filters.ts     ← NUEVO (~55L) — filtrado, CRUD visitas, helpers
  components/
    visit-form.tsx            ← EXTRAÍDO de page.tsx (~175L)
    visit-card.tsx            ← EXTRAÍDO de page.tsx (~70L)
    agenda-filters.tsx        ← EXTRAÍDO de page.tsx (~40L)
    agenda-calendar-panel.tsx ← EXTRAÍDO de page.tsx (~80L)
    agenda-day-panel.tsx      ← EXTRAÍDO de page.tsx (~100L)
```

### Descomposición de page.tsx (589L)

| Responsabilidad | Líneas | Componente/Hook |
|---|---|---|
| Navegación calendario | 47-98 | `use-agenda-calendar.ts` |
| Filtrado + CRUD visitas | 52-129 | `use-agenda-filters.ts` |
| Formulario visita | 411-587 | `visit-form.tsx` |
| Card de visita | 257-329 | `visit-card.tsx` |
| Filtros UI | 196-236 | `agenda-filters.tsx` |
| Panel calendario | 149-193 | `agenda-calendar-panel.tsx` |
| Panel día | 240-366 | `agenda-day-panel.tsx` |

### Pasos
1. Crear types.ts con constantes (MONTHS, STATUS_OPTIONS, STATUS_TRANSITIONS)
2. Crear hooks (use-agenda-calendar, use-agenda-filters)
3. Extraer visit-form.tsx
4. Extraer visit-card.tsx
5. Extraer agenda-filters.tsx
6. Extraer agenda-calendar-panel.tsx
7. Extraer agenda-day-panel.tsx
8. Reescribir page.tsx como orquestador (~60L)
9. Actualizar imports de upcoming-visits.tsx en dashboard si es necesario

**Riesgo:** Medio.

---

## Fase 8: Tareas — Migrar a features/

### Estructura destino
```
src/features/tareas/
  types.ts
  hooks/
    use-task-list.ts          ← NUEVO (~40L)
  components/
    task-list.tsx             ← EXTRAÍDO de page.tsx
    task-filter-tabs.tsx      ← EXTRAÍDO de page.tsx
    task-list-item.tsx        ← EXTRAÍDO de page.tsx
    task-empty-state.tsx      ← EXTRAÍDO de page.tsx
```

### page.tsx resultado (~18L)
```tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { TaskList } from "@/features/tareas/components/task-list";
import { MasterDetailSkeleton } from "@/components/ui/master-detail-skeleton";

export const metadata: Metadata = {
  title: "Bien Hecho - Tareas",
  description: "Seguimiento de tareas de todos tus trabajos.",
};

export default function TareasPage() {
  return (
    <main className="flex-1 min-h-0 flex flex-col">
      <Suspense fallback={<MasterDetailSkeleton />}>
        <TaskList />
      </Suspense>
    </main>
  );
}
```

### Dependencia compartida
`src/app/tareas/[id]/page.tsx` importa `TaskDetailPanel` desde trabajos → tras Fase 6 apunta a `@/features/trabajos/components/tasks/task-detail-panel`

**Riesgo:** Bajo.

---

## Fase 9: Verificación Final

1. `npx tsc --noEmit` — Sin errores de tipos
2. `npm run lint` — Sin warnings nuevos
3. Verificar que `src/hooks/` solo contiene hooks genuinamente compartidos:
   - `use-pagination.ts` ✓
   - `use-navigation-history.ts` ✓
   - `use-click-outside.ts` ✓
4. Verificar que `src/lib/store.ts` es barrel o re-exportador
5. Verificar que `src/types/index.ts` es barrel de re-exports
6. Tests existentes pasan

---

## Métricas de Éxito

| Métrica | Antes | Después |
|---|---|---|
| `store.ts` líneas | 573 | ~60 (index) + ~50/slice |
| `types/index.ts` líneas | 97 | ~10 (barrel) |
| `trabajo-detail.tsx` líneas | 419 | ~120 |
| `agenda/page.tsx` líneas | 589 | ~60 |
| `tareas/page.tsx` líneas | 155 | ~18 |
| Archivos aurora duplicados | 5 | 1 componente compartido |
| Hooks feature-specific en src/hooks/ | 2 | 0 |
| Circularidad padre-hijo | 1 | 0 |
| Imports muertos | 1 | 0 |
| Archivos muertos (mocks/) | 1 | 0 |
| Store monolítico | 1 archivo | 8 slices |
