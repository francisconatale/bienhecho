# Tasks: Trabajo detail + CRUD tareas

**Input**: Design documents from `/specs/003-trabajo-crud/`

**Prerequisites**: spec.md, plan.md, 002-modelos-db complete

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Nuevo trabajo

- [ ] T001 [P] [US1] Crear `src/app/trabajos/nuevo/page.tsx` — formulario: selector de cliente (useDataStore), título, dirección, descripción, presupuesto, fecha_inicio, fecha_fin_estimada. Botón guardar crea job con estado `presupuestado`.
- [ ] T001 [P] [US1] Agregar link "Nuevo Trabajo" en `src/app/trabajos/page.tsx` (reemplazar "Nuevo Presupuesto").

---

## Phase 2: Detalle de trabajo

- [ ] T002 [US2] Crear `src/app/trabajos/[id]/components/job-header.tsx` — muestra: título, cliente (nombre), dirección, presupuesto formateado, fechas.
- [ ] T002 [US2] Crear `src/app/trabajos/[id]/components/job-status.tsx` — selector de estado con los 5 valores. Badge de color por estado. Confirmación para ir hacia atrás en el flujo.
- [ ] T002 [US2] Crear `src/app/trabajos/[id]/components/progress-bar.tsx` — barra con porcentaje = tareas completadas / total tareas. Texto "X de Y tareas completadas".
- [ ] T002 [US2] Actualizar `src/app/trabajos/[id]/page.tsx` — integrar job-header, job-status, progress-bar. Mostrar total estimado. Botón "Editar" para cambiar datos del trabajo.

---

## Phase 3: CRUD de tareas

- [ ] T003 [US3] Crear `src/app/trabajos/[id]/components/task-item.tsx` — fila: checkbox (completada), descripción, precio (o "Sin precio"), botones editar/eliminar.
- [ ] T003 [US3] Crear `src/app/trabajos/[id]/components/task-form.tsx` — formulario inline: descripción (required), precio (optional, number). Botones guardar/cancelar.
- [ ] T003 [US3] Crear `src/app/trabajos/[id]/components/task-list.tsx` — lista de tareas, total estimado, botón "Agregar tarea". Abre task-form inline.
- [ ] T003 [US4] Integrar task-form en task-item para modo edición (mismo componente, datos iniciales).
- [ ] T003 [US5] Agregar eliminación con confirmación en task-item.
- [ ] T003 [US6] Actualizar task-item para que el checkbox marque completada en el store y recalcule progreso.
- [ ] T003 [US8] Integrar task-form para modo edición (reutilizar con initialData).

---

## Phase 4: Lista de trabajos

- [ ] T004 [P] [US1] Actualizar `src/app/trabajos/page.tsx` — usar nuevos campos (titulo, cliente.nombre, estado, presupuesto). Colores de badge por estado. Link a /trabajos/nuevo en vez de /presupuestos/nuevo.

---

## Phase 5: Limpieza

- [ ] T005 [P] [US1] Eliminar `src/app/proyectos/` completo (carpetas huérfanas).
- [ ] T005 [P] [US1] Eliminar `src/app/(dashboard)/presupuestos/nuevo/` completo (reemplazado por /trabajos/nuevo).
- [ ] T005 [P] [US1] Eliminar `src/app/trabajos/[id]/components/budget-list.tsx` y `budget-row.tsx` (ya no existen budgets separados).

---

## Dependencies

- Phase 1 → Phase 2 (need job page to add detail components)
- Phase 2 → Phase 3 (need detail page to add task components)
- Phase 4 parallel with Phase 2-3
- Phase 5 after all phases complete

---

## Notes

- The existing `work-form.tsx` in `trabajos/components/` references `projects` — DELETE it, replace with new nuevo page.
- The existing `budget-list.tsx` and `budget-row.tsx` in `[id]/components/` — DELETE them.
- The presupuestos/nuevo flow is completely replaced by /trabajos/nuevo.
