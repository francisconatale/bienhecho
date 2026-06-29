# Implementation Tasks: Dashboard Operativo de Tareas

## Phase 1: Setup
- [x] T001 Actualizar tipos `Task` y `Material` en `src/types/index.ts`
- [x] T002 Actualizar esquema en `database_relations.md`
- [x] T003 Actualizar `useDataStore` con mocks en `src/lib/store.ts`

## Phase 2: Foundational (Layout Base)
- [x] T004 Crear componente base de layout para el dashboard en `src/app/tareas/components/dashboard-layout.tsx` (con tabs/botones para Tareas vs Materiales)

## Phase 3: User Story 1 (Resumen Financiero)
- **Goal**: Mostrar el monto total que puede facturar al terminar las tareas actuales.
- **Independent Test**: El valor cambia al marcar una tarea con precio como completada.
- [x] T005 [P] [US1] Crear hook `use-financial-summary.ts` en `src/app/tareas/hooks/`
- [x] T006 [US1] Crear componente `FinancialSummary` en `src/app/tareas/components/financial-summary.tsx`
- [x] T007 [US1] Integrar `FinancialSummary` en `src/app/tareas/page.tsx`

## Phase 4: User Story 2 (Alertas de Clientes Esperando)
- **Goal**: Avisar qué clientes están esperando (estado borrador o demorado).
- **Independent Test**: Aparecen tarjetas de advertencia según el estado de los trabajos activos.
- [x] T008 [P] [US2] Crear hook `use-client-alerts.ts` en `src/app/tareas/hooks/`
- [x] T009 [US2] Crear componente `ClientAlerts` en `src/app/tareas/components/client-alerts.tsx`
- [x] T010 [US2] Integrar `ClientAlerts` debajo del `FinancialSummary` en `src/app/tareas/page.tsx`

## Phase 5: User Story 3 (Agrupación de Tareas por Prioridad)
- **Goal**: Ver tareas agrupadas en "Hoy", "Próximo", "Sin apuro".
- **Independent Test**: Las tareas con `prioridad: 'alta'` se listan en el grupo "Hoy".
- [x] T011 [P] [US3] Actualizar hook `use-tareas.ts` en `src/app/tareas/hooks/use-tareas.ts` para exponer tareas agrupadas por prioridad.
- [x] T012 [US3] Crear componente `PriorityTaskGroup` en `src/app/tareas/components/priority-task-group.tsx`
- [x] T013 [US3] Actualizar `TareasList` en `src/app/tareas/components/tareas-list.tsx` para usar la agrupación.

## Phase 6: User Story 4 (Lista de Compras de Materiales)
- **Goal**: Pestaña separada mostrando todos los materiales donde `comprado: false`.
- **Independent Test**: Marcar un material desaparece de la lista.
- [x] T014 [P] [US4] Crear hook `use-shopping-list.ts` en `src/app/tareas/hooks/`
- [x] T015 [US4] Crear componente `ShoppingList` en `src/app/tareas/components/shopping-list.tsx`
- [x] T016 [US4] Integrar condicionalmente `ShoppingList` o `TareasList` en `src/app/tareas/page.tsx` según el tab seleccionado.

## Phase 7: Polish & Cross-Cutting
- [x] T017 Aplicar estilos Premium (Aurora/Glassmorphism) a la vista en `src/app/tareas/page.tsx`
- [x] T018 Testear el flujo completo (Dashboard > Marcar Tarea > Comprar Material > Ver cambio en Resumen Financiero).
