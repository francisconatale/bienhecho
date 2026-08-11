# Documentación de Triggers y Lógica de Base de Datos

En el esquema actual, la base de datos centraliza toda la lógica financiera y de negocio, quitando cualquier tipo de responsabilidad de cálculo al frontend. Todo funciona a través de un sistema de *Event-Driven Architecture* apoyado en triggers de PostgreSQL.

A continuación se detallan los triggers agrupados por la tabla que los dispara:

## 1. Tabla `trabajos`

### `on_trabajo_estado_presupuestado`
- **Evento:** `AFTER UPDATE OF estado ON trabajos`
- **Función:** `emitir_transaccion_presupuesto()`
- **Comportamiento:** Cuando un trabajo pasa de estado `borrador` a `presupuestado`, este trigger lee todas las tareas y materiales asociados y genera una transacción individual de tipo `"cargo"` en la cuenta corriente por cada ítem. Es el punto de partida oficial de la deuda del cliente.

---

## 2. Tabla `tareas`

### `on_tarea_change_recalcular`
- **Evento:** `AFTER INSERT OR DELETE OR UPDATE OF precio, cantidad, precio_unitario ON tareas`
- **Función:** `recalcular_trabajo_totales()`
- **Comportamiento:** Al modificarse una tarea, recalcula todos los totales cacheados en la tabla `trabajos` (`presupuesto`, `total_estimado`, `saldo_pendiente`). Además, evalúa si el saldo pendiente llegó a $0, y en ese caso, auto-promueve el trabajo a estado `pagado`.

### `on_tarea_change_update_transaccion_trigger`
- **Evento:** `AFTER INSERT OR DELETE OR UPDATE OF precio ON tareas`
- **Función:** `on_tarea_change_update_transaccion()`
- **Comportamiento:** Maneja modificaciones post-presupuesto. Si el trabajo ya está en `presupuestado` y se altera una tarea, genera automáticamente una transacción compensatoria en la cuenta corriente (por ejemplo: un cargo adicional si la tarea aumentó de precio, o un abono de compensación si la tarea se rebajó o eliminó).

---

## 3. Tabla `materiales`

### `on_material_subtotal_sync`
- **Evento:** `BEFORE INSERT OR UPDATE OF cantidad, precio_unitario ON materiales`
- **Función:** `sync_material_subtotal()`
- **Comportamiento:** Trigger de integridad de datos. Multiplica automáticamente `cantidad * precio_unitario` y lo guarda en el campo `subtotal` antes de que el registro se guarde en la BD.

### `on_material_change_recalcular`
- **Evento:** `AFTER INSERT OR DELETE OR UPDATE OF cantidad, precio_unitario, subtotal ON materiales`
- **Función:** `recalcular_trabajo_totales()`
- **Comportamiento:** (Idéntico a las tareas) Mantiene los totales en tiempo real en la tabla `trabajos` y procesa el cambio de estado si el saldo queda en 0.

### `on_material_change_update_transaccion_trigger`
- **Evento:** `AFTER INSERT OR DELETE OR UPDATE OF subtotal ON materiales`
- **Función:** `on_material_change_update_transaccion()`
- **Comportamiento:** Genera las transacciones compensatorias en la cuenta corriente si se agregan, modifican o quitan materiales de un trabajo que ya fue `presupuestado`.

---

## 4. Tabla `cobros`

### `on_cobro_insert`
- **Evento:** `AFTER INSERT ON cobros`
- **Función:** `emitir_transaccion_cobro()`
- **Comportamiento:** Acredita el dinero generando una transacción de tipo `"abono"` a favor del cliente en la cuenta corriente.

### `on_cobro_change_recalcular`
- **Evento:** `AFTER INSERT OR DELETE OR UPDATE OF monto_cobrado ON cobros`
- **Función:** `recalcular_trabajo_totales()`
- **Comportamiento:** Actualiza el campo `total_cobrado` y `saldo_pendiente` del trabajo. Si el nuevo cobro salda la deuda, cambia el estado del trabajo a `pagado`.

### `on_cobro_update_sync_abono`
- **Evento:** `AFTER UPDATE OF monto_cobrado, fecha_cobro ON cobros`
- **Función:** `sync_abono_cobro_update()`
- **Comportamiento:** Si un usuario edita un cobro (cambia la fecha o corrige el monto), este trigger viaja a la tabla de `transacciones` y propaga los cambios a la transacción original del abono para que no haya inconsistencias en el historial.

### `on_cobro_delete_revert`
- **Evento:** `AFTER DELETE ON cobros`
- **Función:** `revertir_abono_cobro_delete()`
- **Comportamiento:** Por motivos de auditoría financiera, no elimina físicamente la transacción original. En su lugar, emite una nueva transacción compensatoria de tipo `"cargo"` con el concepto "Anulación de cobro", revirtiendo el saldo a favor que se le había dado al cliente.

---

## Resumen de Flujo de Datos
Gracias a esta red de triggers, el frontend **sólo necesita realizar operaciones CRUD simples** (insertar una tarea, editar un cobro, cambiar un estado). La base de datos, en cascada, se encarga de:
1. Calcular los subtotales (`sync_material_subtotal`).
2. Sincronizar el Dashboard y la vista general del trabajo (`recalcular_trabajo_totales`).
3. Mantener el libro mayor / línea de tiempo financiera de la Cuenta Corriente intacta y auditable con cargos, abonos y anulaciones (`emitir_transaccion_*`, `sync_abono_*`, `revertir_abono_*`).
