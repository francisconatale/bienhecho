# Specification: Actualización de Cuenta Corriente por Triggers de Trabajos

## 1. Contexto y Problema
El sistema permite gestionar trabajos (presupuestados y no presupuestados) y sus materiales/tareas asociados.
Se requiere asegurar que la cuenta corriente del cliente refleje de manera correcta y automática los cambios realizados en trabajos **presupuestados**. Si el trabajo no está presupuestado, no se debe afectar la cuenta corriente.

## 2. User Scenarios

**Scenario 1: Agregar material/tarea a un trabajo presupuestado**
- **Given** un trabajo que tiene estado "presupuestado"
- **When** el usuario agrega un material o una tarea a este trabajo
- **Then** el valor de ese material o tarea se debe sumar automáticamente al saldo de la cuenta corriente correspondiente.

**Scenario 2: Remover material/tarea de un trabajo presupuestado**
- **Given** un trabajo con estado "presupuestado"
- **When** el usuario elimina un material o una tarea
- **Then** el valor de ese ítem eliminado se debe descontar automáticamente del saldo de la cuenta corriente.

**Scenario 3: Agregar/Remover ítems en un trabajo NO presupuestado**
- **Given** un trabajo que **no** tiene estado "presupuestado"
- **When** el usuario agrega o remueve materiales/tareas
- **Then** el saldo de la cuenta corriente debe permanecer intacto.

## 3. Functional Requirements

1. **Condición de Presupuestado**: El sistema debe verificar el estado del trabajo antes de aplicar actualizaciones de saldo.
2. **Incremento de Saldo**: Al insertar un nuevo material o tarea a un trabajo presupuestado, se debe incrementar el saldo de la cuenta corriente del cliente por el monto del ítem añadido.
3. **Decremento de Saldo**: Al eliminar un material o tarea de un trabajo presupuestado, se debe decrementar el saldo de la cuenta corriente del cliente por el monto del ítem eliminado.
4. **Actualización de Ítems (Modificación)**: Sí, si se modifica el monto de un material o tarea existente, se debe ajustar el saldo de la cuenta corriente generando una transacción (o ajustando la existente) por la diferencia de precio.
5. **Eliminación de un Trabajo Completo**: Sí, al eliminar un trabajo presupuestado, se deben descontar todos sus montos asociados de la cuenta corriente, utilizando las transacciones previamente vinculadas a ese trabajo.
6. **Compatibilidad Hacia Atrás (Migración)**: 
   - **Trabajos Nuevos:** Generan trazabilidad completa (transacciones individuales registradas detalladamente).
   - **Trabajos Viejos (Legacy):** Mantienen su transacción "base" total original sin alterar. Sin embargo, si sufren alteraciones (se agrega, quita o edita algo hoy), estas *nuevas* modificaciones generarán sus transacciones de ajuste correspondientes.

## 4. Success Criteria
- 100% de las modificaciones en trabajos no presupuestados son ignoradas por la cuenta corriente.
- El saldo de la cuenta corriente es exactamente consistente con la suma de los valores actuales de los ítems en trabajos presupuestados.
- Las cuentas corrientes se actualizan sin intervención manual tras guardar los cambios en un trabajo presupuestado.

## 5. Assumptions
- Un trabajo está explícitamente vinculado a una cuenta corriente.
- El sistema cuenta con la robustez necesaria para manejar las actualizaciones sin dejar saldos inconsistentes.
