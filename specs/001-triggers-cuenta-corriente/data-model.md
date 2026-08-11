# Data Model: Triggers Cuenta Corriente

## Entidad: `transacciones` (Modificada)
Para soportar la trazabilidad individual, se deben agregar dos nuevas columnas opcionales a la tabla `transacciones`.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `referencia_tarea_id` | `uuid` | `NULL`, `FOREIGN KEY (tareas.id) ON DELETE SET NULL` | ID de la tarea que originó esta transacción. |
| `referencia_material_id` | `uuid` | `NULL`, `FOREIGN KEY (materiales.id) ON DELETE SET NULL` | ID del material que originó esta transacción. |

## Modificación de Comportamiento: Triggers

1. **`on_tarea_change_update_transaccion` (NUEVO)**
   - **Evento:** `AFTER INSERT, UPDATE, DELETE ON tareas`
   - **Lógica:**
     - Verifica si el trabajo padre tiene estado `presupuestado`.
     - Si es `INSERT`, crea una transacción (`cargo`) con `referencia_tarea_id`.
     - Si es `UPDATE` de precio, calcula la diferencia. Si es mayor a 0 crea `cargo`, si es menor crea `abono`.
     - Si es `DELETE`, crea una transacción (`abono`) anulando el valor original, o elimina la transacción si existía individualmente.

2. **`on_material_change_update_transaccion` (NUEVO)**
   - **Evento:** `AFTER INSERT, UPDATE, DELETE ON materiales`
   - **Lógica:** Análoga a la de tareas, pero con `referencia_material_id`.

3. **`on_trabajo_estado_presupuestado` (MODIFICADO)**
   - **Lógica Actual:** Crea una transacción única por el total del presupuesto.
   - **Lógica Nueva:** 
     - Sigue creando la transacción por el total (para soportar legacy / facilidad).
     - (Alternativamente) Si pasamos a un modelo 100% individual para los nuevos, este trigger recorrerá las tareas y materiales e insertará transacciones 1-a-1. Se prefiere esto último para los nuevos, pero se decidirá en el PR. La especificación técnica dictamina que "trabajos nuevos generan trazabilidad completa".
