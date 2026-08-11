# Implementation Tasks: Triggers Cuenta Corriente

**Feature**: Triggers Cuenta Corriente
**Implementation Strategy**: Database-first MVP. Todo el esfuerzo reside en la creación de las migraciones SQL para Supabase.

## Phase 1: Setup
- [X] T001 Generar archivo de migración en blanco para la base de datos (ej. `supabase/migrations/YYYYMMDDHHMMSS_triggers_cuenta_corriente.sql`).

## Phase 2: Foundational
- [X] T002 Alterar tabla `transacciones` para añadir columnas `referencia_tarea_id` y `referencia_material_id` en el archivo de migración.

## Phase 3: User Story 1 (Gestión de Tareas en Trabajo Presupuestado)
*Goal*: Sincronizar automáticamente la inserción, modificación y eliminación de Tareas con la cuenta corriente, respetando la trazabilidad.
*Independent Test*: Ejecutar las validaciones del quickstart (Agregar, modificar precio, eliminar Tarea) y ver la tabla `transacciones`.
- [X] T003 [US1] Crear la función PL/pgSQL `on_tarea_change_update_transaccion` en el archivo de migración.
- [X] T004 [P] [US1] Declarar el TRIGGER `AFTER INSERT, UPDATE, DELETE ON tareas` vinculado a la función.

## Phase 4: User Story 2 (Gestión de Materiales en Trabajo Presupuestado)
*Goal*: Sincronizar automáticamente la inserción, modificación y eliminación de Materiales con la cuenta corriente, respetando la trazabilidad.
*Independent Test*: Ejecutar validaciones agregando/eliminando materiales.
- [X] T005 [P] [US2] Crear la función PL/pgSQL `on_material_change_update_transaccion` en el archivo de migración.
- [X] T006 [P] [US2] Declarar el TRIGGER `AFTER INSERT, UPDATE, DELETE ON materiales` vinculado a la función.

## Phase 5: User Story 3 (Migración de Comportamiento Legacy y Cambio de Estado)
*Goal*: Ajustar el comportamiento de "Borrador a Presupuestado" para que los trabajos nuevos inserten transacciones granulares.
*Independent Test*: Pasar un trabajo borrador a presupuestado y verificar que no genera una sola transacción global, sino una por cada tarea/material.
- [X] T007 [US3] Modificar (reemplazar) la función actual `emitir_transaccion_presupuesto` en el archivo de migración para soportar el nuevo flujo granular sin romper los trabajos antiguos.
- [X] T008 [US3] Modificar (reemplazar) el trigger/comportamiento de borrado de `trabajos` para que anule o elimine en cascada las transacciones asociadas (incluyendo tareas/materiales) en el archivo de migración.

## Phase 6: Polish & Cross-Cutting Concerns
- [X] T009 Revisar las Server Actions o API routes en el código frontend (carpeta raíz `presupuestito-web`) para confirmar si se llama a `revalidatePath` sobre las vistas de "Cuenta Corriente" al modificar ítems.

## Dependencies & Execution Order
1. Completar Setup y Foundational (T001-T002).
2. T003/T004 (US1) y T005/T006 (US2) se pueden implementar y probar de forma paralela.
3. T007/T008 (US3) pueden ejecutarse luego de probar las tareas individuales.
4. T009 se puede revisar al final del ciclo.
