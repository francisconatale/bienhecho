# Quickstart: Validación Manual

## Prerrequisitos

```bash
npm run dev
# Abrir http://localhost:3000
```

## Escenario 1: Verificar Saldo en Lista de Clientes

1. Navegar a `/clientes`
2. **Esperado:** Cada cliente muestra:
   - Badge "PRESUPUESTADO" con monto total
   - Badge "ADEUDA" con saldo pendiente (si aplica)
3. **Verificar:** Constructora del Sur (c1) tiene j1 en `borrador` → sin badge de presupuestado, sin deuda
4. **Verificar:** Estudio de Arquitectura M&P (c2) tiene j2 `presupuestado` $800K, sin cobros → ADEUDA $800K
5. **Verificar:** Administración San Jose (c3) tiene j3 `pagado` $350K → sin badge (no está presupuestado)

## Escenario 2: Verificar Detalle del Cliente

1. Seleccionar "Estudio de Arquitectura M&P" en la lista
2. **Esperado:**
   - La tarjeta de cabecera muestra "Deuda: $800K"
   - Sección "Cuenta Corriente" lista las transacciones:
     - Cargo $800K — "Emisión de presupuesto: Reforma Consultorio Dental"
     - Saldo después: $800K
3. Seleccionar "Administración San Jose"
4. **Esperado:** Deuda $0 (pagado), ver:
   - Cargo $350K — "Emisión de presupuesto: Mantenimiento General"

## Escenario 3: Emitir Presupuesto → Cargo Automático

1. Ir a `/trabajos/j1` (Edificio Las Heras, borrador)
2. Hacer clic en "Generar PDF"
3. En el diálogo, hacer clic en "Emitir"
4. **Esperado:** El trabajo pasa a `presupuestado`
5. Ir a `/clientes`, seleccionar "Constructora del Sur"
6. **Esperado:** Nueva transacción de cargo $1,500,000 — "Emisión de presupuesto: Edificio Las Heras"
7. Saldo: $1,500,000

## Escenario 4: Registrar Cobro → Abono Automático

1. Ir a `/trabajos/j2` (Reforma Consultorio Dental, presupuestado, $800K deuda)
2. En la sección "Pagos Recibidos", hacer clic en "Registrar Cobro"
3. Ingresar monto $300,000, fecha hoy
4. Guardar
5. Ir a `/clientes`, seleccionar "Estudio de Arquitectura M&P"
6. **Esperado:** Nueva transacción de abono $300,000 — "Cobro registrado"
7. Saldo: $500,000

## Escenario 5: Marcar como Pagado → Cobro + Abono

1. Ir a `/trabajos/j1` (ahora presupuestado, $1.5M)
2. Hacer clic en "Marcar como Pagado"
3. **Esperado:** Se registra cobro automático por $1,500,000 + abono automático
4. Ir a `/clientes`, seleccionar "Constructora del Sur"
5. **Esperado:** Abono $1,500,000 — "Cobro registrado"
6. Saldo: $0

## Escenario 6: Eliminar Trabajo Presupuestado → Reversión

1. Desde `/clientes`, seleccionar "Estudio de Arquitectura M&P"
2. Ir a `/trabajos/j2`
3. Eliminar el trabajo j2
4. Ir a `/clientes`, seleccionar "Estudio de Arquitectura M&P"
5. **Esperado:** Nueva transacción de abono $800,000 — "Anulación de presupuesto: Reforma Consultorio Dental"
6. Saldo: $0 (o $300K si había cobro, ahora deuda $0 con saldo a favor)

## Escenario 7: Eliminar Cobro → Reversión

1. Ir a `/trabajos/j2`, registrar cobro de $100,000
2. Eliminar el cobro recién creado
3. **Esperado:** Nueva transacción de cargo $100,000 — "Reversión de cobro"
4. Saldo vuelve al valor anterior

## Escenario 8: Ajuste Manual

1. En detalle de cualquier cliente, sección "Cuenta Corriente"
2. Hacer clic en "Ajuste Manual"
3. Seleccionar "Cargo", monto $50,000, concepto "Corrección administrativa"
4. Confirmar
5. **Esperado:** Nueva transacción con ícono/estilo distinto (manual)
6. Saldo incrementado en $50,000

## Escenario 9: Saldo a Favor

1. En un cliente, registrar ajuste manual de abono $100,000 (sin deuda previa)
2. **Esperado:** Saldo negativo se muestra como "A favor" en verde

## Criterios de Aceptación

| # | Escenario | Resultado Esperado |
|---|-----------|-------------------|
| 1 | Lista clientes sin JOIN a trabajos/cobros | Saldo calculado desde transacciones |
| 2 | Emitir presupuesto → cargo | Transacción creada en <1s |
| 3 | Registrar cobro → abono | Transacción creada en <1s |
| 4 | Historial en detalle | Transacciones con fecha, concepto, tipo, monto, saldo después |
| 5 | Ajuste manual | Distinguible visualmente de automáticas |
| 6 | Reversión al eliminar | Nueva transacción, no modificación |
