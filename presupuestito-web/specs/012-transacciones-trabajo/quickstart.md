# Quickstart: Validación del Desglose de Transacciones

## Propósito
Validar que en la vista de detalle de un trabajo se muestran de forma precisa todas las transacciones (cargos, abonos y ajustes automáticos).

## Prerrequisitos
- Aplicación corriendo localmente (`npm run dev`).
- Base de datos local Supabase ejecutándose (`npx supabase start` y migraciones aplicadas).

## Pasos de Validación

1. **Preparación de Datos**:
   - Crear un cliente (si no hay uno).
   - Crear un trabajo para ese cliente y pasarlo a estado `presupuestado`.
   - Agregar 2 tareas con precio (ej: $1000 y $500). (Esto debería generar cargos).

2. **Validación de Cargos**:
   - Navegar al detalle del trabajo.
   - Ir a la sección "Pagos" o "Cuenta Corriente" en el detalle.
   - **Esperado**: Ver listados los cargos correspondientes a las tareas, sumando $1500 en total.

3. **Validación de Abonos (Cobros)**:
   - Registrar un pago de $500.
   - **Esperado**: El listado de transacciones debe sumar un nuevo ítem (abono) por $500 en color verde. El saldo pendiente mostrado debe actualizarse a $1000.

4. **Validación de Ajustes**:
   - Modificar el precio de una de las tareas (ej: de $1000 a $1200).
   - Volver a la sección de pagos del trabajo.
   - **Esperado**: Ver una nueva transacción de ajuste (cargo) por los $200 de diferencia, incrementando el saldo pendiente a $1200.
