# Tasks: Alineación de modelos con DB + Flujo core

**Input**: Design documents from `/specs/001-modelos-db/`

**Prerequisites**: spec.md, plan.md

**Tests**: Tests are OPTIONAL for MVP. Not included.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)

## Path Conventions

- **Web app**: `src/` at repository root

---

## Phase 1: Types — Fundación

**Purpose**: Redefinir los tipos de datos según el esquema de DB.

- [ ] T001 [US1] Redefinir `Client` en `src/types/index.ts` con campos: id, nombre, telefono, email, direccion, notas, created_at. Quitar category, status, phone (usar telefono).
- [ ] T001 [US1] Redefinir `Job` en `src/types/index.ts` con campos: id, cliente_id, titulo, direccion, descripcion, presupuesto, estado, fecha_inicio, fecha_fin_estimada, created_at. Usar estados: 'presupuestado' | 'en_curso' | 'listo_para_facturar' | 'facturado' | 'cobrado'.
- [ ] T001 [US1] Crear tipo `Task` en `src/types/index.ts` con campos: id, trabajo_id, descripcion, precio (nullable), completada, orden.
- [ ] T001 [US1] Crear tipo `Visit` en `src/types/index.ts` con campos: id, trabajo_id, fecha, hora_inicio, hora_fin, notas, estado, created_at. Estados: 'planificada' | 'realizada' | 'cancelada'. (Para futuro, no se implementa aún).
- [ ] T001 [US1] Crear tipo `VisitaTarea` en `src/types/index.ts` con campos: visita_id, tarea_id, nota_progreso. (Para futuro).
- [ ] T001 [P] [US1] Eliminar tipos `Concept`, `Budget` de `src/types/index.ts` (reemplazados por Task y Job).

---

## Phase 2: Store — Base de datos en memoria

**Purpose**: Refactorizar el store de Zustand con los nuevos tipos.

- [ ] T002 [US1] Refactorizar `src/lib/store.ts`: reemplazar tipo `Client` con el nuevo esquema. Actualizar mock data (quitar category, status, usar telefono en vez de phone).
- [ ] T002 [US1] Refactorizar `src/lib/store.ts`: reemplazar tipo `Job` con el nuevo esquema. Estados: presupuestado, en_curso, listo_para_facturar, facturado, cobrado. Quitar `projects` del store.
- [ ] T002 [US1] Agregar `tasks: Task[]` al store con acciones: addTask, updateTask, removeTask, reorderTasks.
- [ ] T002 [P] [US1] Eliminar `budgets` del store (ya no existe como entidad separada). Eliminar addBudget, updateBudget, removeBudget.
- [ ] T002 [US1] Eliminar `projects` y `works` del store si existen (work-form.tsx los referencia).

---

## Phase 3: Trabajo — CRUD de tareas

**Purpose**: Implementar la vista de detalle de trabajo con tareas.

### US1: Crear trabajo con tareas

- [ ] T003 [US1] Crear `src/app/trabajos/nuevo/page.tsx` — formulario para crear trabajo: seleccionar cliente, título, dirección, descripción, presupuesto, fechas. Estado inicial: `presupuestado`.
- [ ] T003 [US1] Crear componente `src/app/trabajos/[id]/components/job-header.tsx` — header con: título, cliente, dirección, presupuesto, estado, fechas.
- [ ] T003 [US1] Crear componente `src/app/trabajos/[id]/components/job-status.tsx` — selector de estado con los 5 estados posibles.
- [ ] T003 [US1] Crear componente `src/app/trabajos/[id]/components/progress-bar.tsx` — barra de progreso basada en tareas completadas.

### US1: CRUD de tareas

- [ ] T003 [US1] Crear componente `src/app/trabajos/[id]/components/task-item.tsx` — fila de tarea con: checkbox completada, descripción, precio, botones editar/eliminar.
- [ ] T003 [US1] Crear componente `src/app/trabajos/[id]/components/task-form.tsx` — formulario para agregar/editar tarea: descripción, precio (opcional).
- [ ] T003 [US1] Crear componente `src/app/trabajos/[id]/components/task-list.tsx` — lista de tareas con total estimado y botón "Agregar tarea".

### US1: Página de detalle

- [ ] T003 [US1] Actualizar `src/app/trabajos/[id]/page.tsx` — integrar job-header, job-status, progress-bar, task-list.

---

## Phase 4: Trabajos — Lista y navegación

**Purpose**: Actualizar la lista de trabajos y la navegación.

- [ ] T004 [P] [US1] Actualizar `src/app/trabajos/page.tsx` — mostrar trabajos con los nuevos campos (titulo, cliente, estado, presupuesto). Filtros por estado y cliente.
- [ ] T004 [P] [US4] Actualizar `src/components/layout/sidebar.tsx` — mantener links: Dashboard, Clientes, Trabajos, Ajustes.
- [ ] T004 [P] [US5] Actualizar `src/app/clientes/components/client-form.tsx` — campos: nombre, telefono, email, direccion, notas.
- [ ] T004 [P] [US5] Actualizar `src/app/clientes/page.tsx` — mostrar clientes con los nuevos campos.

---

## Phase 5: Presupuesto PDF — Flujo core

**Purpose**: Adaptar la generación de presupuesto PDF para que use tareas del trabajo.

### US2: Generar presupuesto PDF

- [ ] T005 [US2] Adaptar `src/hooks/use-budget-pdf.tsx` — generar PDF desde tareas de un trabajo (no desde Concept).
- [ ] T005 [US2] Adaptar `src/lib/pdf/templates/afip-style.tsx` — template PDF con: datos del cliente, título del trabajo, lista de tareas con precio, total, fecha.
- [ ] T005 [US2] Agregar botón "Generar Presupuesto" en la página de detalle del trabajo (`/trabajos/[id]`). Solo visible si el trabajo tiene tareas con precio.
- [ ] T005 [US2] Adaptar `src/app/(dashboard)/presupuestos/nuevo/page.tsx` — simplificar flujo: en vez de crear Concept, crear tareas dentro de un trabajo existente. O eliminar esta página y redirigir a `/trabajos/nuevo`.

---

## Phase 6: Dashboard y pulido

**Purpose**: Dashboard funcional y fixes generales.

- [ ] T006 [P] [US4] Actualizar `src/app/page.tsx` — mostrar: trabajos pendientes de respuesta (presupuestado), trabajos activos (en_curso), listos para facturar (listo_para_facturar).
- [ ] T006 [P] [US4] Actualizar `src/app/(dashboard)/components/dashboard-hero.tsx` — mostrar métricas relevantes (trabajos activos, total pendiente).
- [ ] T006 [P] [US4] Actualizar `src/app/(dashboard)/components/quick-actions.tsx` — acciones: Nuevo Trabajo, Ver Trabajos.
- [ ] T006 [US4] Actualizar `src/app/(dashboard)/components/recent-activity.tsx` — actividad reciente basada en trabajos y tareas.
- [ ] T006 [P] [US3] Agregar confirmación antes de eliminar trabajo o tarea.
- [ ] T006 [P] [US5] Agregar manejo de errores y estados vacíos en todas las vistas.
- [ ] T006 [US1] Eliminar `src/app/proyectos/` (carpetas huérfanas que referencian la estructura vieja).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Types)**: No dependencies — can start immediately
- **Phase 2 (Store)**: Depends on Phase 1 completion — BLOCKS Phase 3
- **Phase 3 (Trabajo CRUD)**: Depends on Phase 2 — BLOCKS Phase 5
- **Phase 4 (Lista y navegación)**: Depends on Phase 1 — can run in parallel with Phase 2-3
- **Phase 5 (Presupuesto PDF)**: Depends on Phase 3 — needs tasks in store
- **Phase 6 (Dashboard)**: Depends on Phase 2 — can start after store is ready

### Within Each Phase

- Types before store
- Store before components
- Components before pages
- Core CRUD before PDF generation

### Parallel Opportunities

- T001 (types) can be done in one pass
- T004 (lista, sidebar, clientes) can run in parallel with T003 (trabajo detail)
- T006 (dashboard) can run in parallel with T005 (presupuesto PDF)

---

## Implementation Strategy

### Incremental Delivery

1. **Phase 1**: Types aligned → no visible change yet
2. **Phase 2**: Store refactored → app may break (old code uses old types)
3. **Phase 3**: Trabajo detail with tasks → core flow works
4. **Phase 4**: Lista y navegación → app is usable
5. **Phase 5**: Presupuesto PDF → core business value delivered
6. **Phase 6**: Dashboard + pulido → MVP complete

---

## Notes

- Eliminar `src/app/proyectos/` completo — son páginas huérfanas de la estructura vieja.
- Eliminar `src/app/(dashboard)/presupuestos/nuevo/` si se decide que presupuesto = trabajo + tareas (recomendado).
- El hook `use-budget.ts` y `use-concept-logic.ts` se eliminan o reemplazan por lógica en el store.
- Mock data iniciales deben usar los nuevos tipos (con `nombre` en vez de `name`, etc.).
