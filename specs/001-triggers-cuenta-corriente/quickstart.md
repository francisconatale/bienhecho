# Quickstart: Validación de Triggers Cuenta Corriente

Esta guía muestra cómo validar que las transacciones en la cuenta corriente se actualizan correctamente según los cambios en los trabajos.

## Requisitos Previos
1. Aplicar las nuevas migraciones de Supabase (las cuales crearán las columnas `referencia_tarea_id`, `referencia_material_id` y los triggers asociados).

## Validaciones

### 1. Trabajos No Presupuestados (Borrador)
1. **Acción**: Crea un trabajo en estado `borrador`.
2. **Acción**: Agrégale una Tarea de $500 y un Material de $200.
3. **Resultado Esperado**: Si consultas la tabla `transacciones` para ese cliente, **no** debe haber nuevas transacciones creadas por esos montos.

### 2. Pasar a Presupuestado (Trabajo Nuevo)
1. **Acción**: Cambia el estado del trabajo anterior de `borrador` a `presupuestado`.
2. **Resultado Esperado**: La tabla `transacciones` ahora debe mostrar cargos detallados. Dependiendo de la implementación elegida, debería haber una transacción por la Tarea ($500) y otra por el Material ($200).

### 3. Modificar Ítems de un Trabajo Presupuestado
1. **Acción**: Modifica el precio de la Tarea de $500 a $600.
2. **Resultado Esperado**: Se debe generar una transacción de ajuste de **+$100** (cargo extra).
3. **Acción**: Elimina el Material de $200.
4. **Resultado Esperado**: Se debe generar una transacción de **-$200** (abono / descuento) o eliminarse el cargo original del material.

### 4. Trabajos Legacy (Compatibilidad Hacia Atrás)
1. **Acción**: Toma un trabajo "viejo" que ya estaba presupuestado en producción (con una única transacción genérica).
2. **Acción**: Agrégale una Tarea nueva de $1000.
3. **Resultado Esperado**: Se crea una nueva transacción individual por $1000 vinculada al ID de la nueva Tarea, mientras que la transacción genérica original permanece inalterada.
