# Tasks: Redefinir types y refactorizar store

**Input**: Design documents from `/specs/002-modelos-db/`

**Prerequisites**: spec.md, plan.md

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Types

- [ ] T001 [P] [US1] Reemplazar `Client` en `src/types/index.ts`: id, nombre, telefono, email?, direccion, notas?, created_at. Eliminar category, status, phone.
- [ ] T001 [P] [US1] Reemplazar `Job` en `src/types/index.ts`: id, cliente_id, titulo, direccion, descripcion?, presupuesto, estado (JobStatus), fecha_inicio?, fecha_fin_estimada?, created_at.
- [ ] T001 [P] [US1] Crear tipo `JobStatus` = 'presupuestado' | 'en_curso' | 'listo_para_facturar' | 'facturado' | 'cobrado'.
- [ ] T001 [P] [US1] Crear tipo `Task` en `src/types/index.ts`: id, trabajo_id, descripcion, precio (number|null), completada, orden.
- [ ] T001 [P] [US1] Eliminar tipos `Concept`, `Budget` de `src/types/index.ts`.

---

## Phase 2: Store

- [ ] T002 [US2] Refactorizar `src/lib/store.ts`: interfaz DataState con clients (Client[]), jobs (Job[]), tasks (Task[]).
- [ ] T002 [US2] Implementar acciones CRUD para Client: addClient, updateClient, removeClient.
- [ ] T002 [US2] Implementar acciones CRUD para Job: addJob, updateJob, removeJob.
- [ ] T002 [US2] Implementar acciones para Task: addTask, updateTask, removeTask, reorderTasks.
- [ ] T002 [US2] Eliminar del store: projects, works, budgets, addBudget, updateBudget, removeBudget.
- [ ] T002 [US2] Actualizar mock data inicial con nuevos tipos (nombre en vez de name, etc.).

---

## Phase 3: Limpieza

- [ ] T003 [P] [US1] Revisar `src/lib/trades.ts` — eliminar o actualizar si referencia tipos viejos.
- [ ] T003 [P] [US1] Revisar `src/mocks/index.ts` — actualizar mock data con nuevos tipos.
- [ ] T003 [P] [US1] Revisar `src/mocks/suggestions.ts` — eliminar si usa Concept.

---

## Dependencies

- Phase 1 → Phase 2 (store needs types)
- Phase 2 → Phase 3 (cleanup needs new store)
- T001 tasks are parallel (all in same file)
- T003 tasks are parallel (independent files)

---

## Notes

- After this feature, components will break (they reference old types). That's expected — fixed in 003.
- The `use-budget.ts` hook in `presupuestos/nuevo/` is NOT touched here — it's removed in 004.
