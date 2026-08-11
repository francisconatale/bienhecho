# Implementation Plan: Triggers Cuenta Corriente

## Technical Context
- **Technologies**: Supabase (PostgreSQL), Next.js (Frontend)
- **Architecture**: Database-centric business logic using PL/pgSQL triggers to maintain atomic financial consistency without trusting the client.
- **Dependencies**: Existencia actual de un modelo de "1 transacción por trabajo".

## Phase 0: Outline & Research
- [x] Create `research.md` resolving all edge cases (legacy compatibility, individual items tracking).
- [x] Define strategy for backward compatibility.

## Phase 1: Design & Contracts
- [x] Create `data-model.md` defining `transacciones` updates and Trigger events.
- [x] Create `quickstart.md` defining how to test DB triggers.

## Phase 2: Implementation (Database)
- **Task 1: Migración de Esquema**
  - Agregar `referencia_tarea_id` y `referencia_material_id` a la tabla `transacciones`.
- **Task 2: Triggers Tareas**
  - Crear función PL/pgSQL y trigger `AFTER INSERT, UPDATE, DELETE` en la tabla `tareas`.
  - Debe validar si `trabajo.estado == 'presupuestado'` antes de generar/alterar una transacción.
- **Task 3: Triggers Materiales**
  - Crear función PL/pgSQL y trigger `AFTER INSERT, UPDATE, DELETE` en la tabla `materiales`.
- **Task 4: Modificar Trigger de Presupuesto (Transición a presupuestado)**
  - Actualizar `emitir_transaccion_presupuesto` para que al pasar a `presupuestado` genere las transacciones individuales (una por tarea y una por material) en lugar del bulto total, manteniendo la compatibilidad hacia atrás si hay trabajos que requieran el viejo comportamiento (o simplemente aplicarlo siempre a los nuevos).

## Phase 3: Frontend Validation (Optional/Minimal)
- **Task 5: Revisión de UI**
  - Asegurar que Next.js revalida la ruta de la cuenta corriente al crear tareas si el usuario navega a ella. (Usualmente gestionado por mutations/invalidations de React Query o Server Actions `revalidatePath`).
