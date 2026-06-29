# Feature Specification: Cuenta Corriente por Cliente

**Feature Branch**: `008-cuenta-corriente-cliente`

**Created**: 2026-06-28

**Status**: Draft

**Input**: User description: "Definir cuenta corriente para cada cliente — ahora mismo agarra los trabajos y calcula cuánto debe, pero las transacciones ¿a dónde van? Para no necesitar hacer todos los cálculos ni traerse todos los datos de los trabajos para calcular deudor y demás."

## User Scenarios & Testing

### User Story 1 - Ver saldo de cuenta corriente de un cliente (Priority: P1)

Como usuario, quiero ver en la lista de clientes y en el detalle del cliente el saldo de su cuenta corriente (lo que me debe o si está en cero), sin que el sistema tenga que recorrer todos los trabajos y cobros para calcularlo cada vez.

**Why this priority**: Es el core del feature — eliminar la complejidad actual de calcular deuda agregando datos de múltiples tablas.

**Independent Test**: Al abrir la lista de clientes, cada cliente muestra su saldo actual. El saldo se calcula desde una tabla de transacciones de cuenta corriente, no desde los trabajos.

**Acceptance Scenarios**:

1. **Given** un cliente con transacciones registradas en su cuenta corriente (emisión de presupuesto + cobros), **When** se visualiza la lista de clientes, **Then** se muestra el saldo actual (deuda o cero).
2. **Given** un cliente sin transacciones, **When** se visualiza su detalle, **Then** el saldo muestra $0.
3. **Given** un cliente con una emisión de presupuesto de $100,000 y un cobro de $40,000, **When** se visualiza su saldo, **Then** muestra $60,000 de deuda.

---

### User Story 2 - Registrar transacción en cuenta corriente al emitir presupuesto (Priority: P1)

Como usuario, cuando emito un presupuesto para un trabajo, quiero que automáticamente se registre una transacción en la cuenta corriente del cliente incrementando su deuda, sin tener que hacer nada adicional.

**Why this priority**: Es la fuente principal de deuda — cada presupuesto emitido es un cargo a la cuenta del cliente.

**Independent Test**: Al emitir un presupuesto desde borrador a presupuestado, aparece una transacción en la cuenta corriente del cliente y el saldo se actualiza.

**Acceptance Scenarios**:

1. **Given** un trabajo en estado `borrador` con presupuesto de $200,000, **When** el usuario emite el presupuesto (pasa a `presupuestado`), **Then** se crea una transacción en la cuenta corriente del cliente por $200,000 con tipo "cargo" y el saldo aumenta.
2. **Given** un trabajo ya `presupuestado` donde se modifica el presupuesto, **When** se guarda el cambio, **Then** se registra una transacción por la diferencia (ajuste).

---

### User Story 3 - Registrar transacción al recibir un cobro (Priority: P1)

Como usuario, cuando registro un cobro (manual o automático al marcar como pagado), quiero que se refleje automáticamente como un abono en la cuenta corriente del cliente, reduciendo su deuda.

**Why this priority**: Los cobros reducen la deuda — sin este registro la cuenta corriente no reflejaría la realidad.

**Independent Test**: Al registrar un cobro en un trabajo, la cuenta corriente del cliente se actualiza con un abono y el saldo disminuye.

**Acceptance Scenarios**:

1. **Given** un cliente con deuda de $200,000, **When** se registra un cobro de $50,000, **Then** se crea una transacción de tipo "abono" en su cuenta corriente y el saldo pasa a $150,000.
2. **Given** un cliente con deuda de $100,000, **When** se marca el trabajo como "Pagado" y se genera el cobro automático por el saldo restante, **Then** se registra un abono en la cuenta corriente por el monto del cobro.

---

### User Story 4 - Ver historial de transacciones de la cuenta corriente (Priority: P2)

Como usuario, quiero ver el historial de movimientos de la cuenta corriente de un cliente (cargos y abonos con fecha, concepto, monto) para entender cómo se compone su saldo actual.

**Why this priority**: Transparencia — el usuario necesita auditar por qué un cliente debe X monto.

**Independent Test**: En el detalle del cliente, hay una sección "Cuenta Corriente" que lista todas las transacciones ordenadas por fecha.

**Acceptance Scenarios**:

1. **Given** un cliente con múltiples transacciones, **When** se abre su detalle, **Then** se muestra una lista cronológica de movimientos con fecha, concepto, tipo (cargo/abono), monto y saldo después de cada operación.
2. **Given** un cliente sin transacciones, **When** se abre su detalle, **Then** se muestra un mensaje "Sin movimientos".

---

### User Story 5 - Ajuste manual de cuenta corriente (Priority: P3)

Como usuario, quiero poder registrar un ajuste manual en la cuenta corriente (cargo o abono) para corregir errores o registrar conceptos que no están vinculados a un trabajo específico.

**Why this priority**: Es un caso borde pero necesario para mantener la contabilidad correcta.

**Independent Test**: Desde el detalle del cliente, se puede agregar una transacción manual con concepto, tipo y monto.

**Acceptance Scenarios**:

1. **Given** un cliente, **When** el usuario agrega un ajuste manual de $10,000 como cargo, **Then** aparece en el historial con un concepto personalizado y el saldo se actualiza.
2. **Given** un ajuste manual registrado, **When** se visualiza el historial, **Then** se distingue visualmente de las transacciones automáticas (ej. con un ícono diferente).

---

### Edge Cases

- ¿Qué pasa cuando se elimina un trabajo que estaba `presupuestado`? La transacción de cargo asociada debe reversarse (nueva transacción de abono por el mismo monto con concepto "Anulación de presupuesto").
- ¿Qué pasa cuando se elimina un cobro? Debe registrarse un cargo de ajuste por el mismo monto.
- ¿Qué pasa si el saldo es negativo (cliente pagó de más)? Debe mostrarse como "saldo a favor" visualmente distinto.
- ¿Transacciones duplicadas? El sistema debe asegurar idempotencia: emitir el mismo presupuesto dos veces no debe duplicar el cargo.

## Requirements

### Functional Requirements

- **FR-001**: El sistema DEBE mantener una tabla de transacciones de cuenta corriente por cliente, donde cada transacción tiene: cliente_id, tipo (cargo/abono), monto, concepto, fecha, referencia al trabajo (opcional), referencia al cobro (opcional), y origen (automático/manual).
- **FR-002**: Al emitir un presupuesto (cambiar estado de `borrador` a `presupuestado`), el sistema DEBE registrar automáticamente una transacción de tipo "cargo" por el monto del presupuesto en la cuenta corriente del cliente.
- **FR-003**: Al registrar un cobro (manual o automático), el sistema DEBE registrar automáticamente una transacción de tipo "abono" en la cuenta corriente del cliente.
- **FR-004**: La lista de clientes DEBE mostrar el saldo actual de la cuenta corriente, obtenido desde la tabla de transacciones (no calculado desde trabajos).
- **FR-005**: El detalle del cliente DEBE mostrar el saldo actual y el historial de transacciones ordenado por fecha descendente.
- **FR-006**: Cada transacción en el historial DEBE mostrar: fecha, concepto descriptivo, tipo (cargo/abono), monto, y saldo resultante después de la transacción.
- **FR-007**: Al eliminar un trabajo en estado `presupuestado`, el sistema DEBE registrar automáticamente una transacción de reversión (abono) por el mismo monto del presupuesto.
- **FR-008**: Al eliminar un cobro, el sistema DEBE registrar automáticamente una transacción de reversión (cargo) por el mismo monto.
- **FR-009**: El usuario DEBE poder registrar transacciones manuales de ajuste (cargo o abono) con concepto libre.
- **FR-010**: Las transacciones automáticas (FR-002, FR-003, FR-007, FR-008) DEBEN distinguirse visualmente de las manuales en el historial.

### Key Entities

- **TransaccionCuentaCorriente**: Registro individual de movimiento en la cuenta de un cliente. Atributos: id, cliente_id, tipo (cargo/abono), monto, concepto, fecha, referencia a trabajo (nullable), referencia a cobro (nullable), origen (automático/manual), created_at. El saldo se calcula como suma de cargos menos suma de abonos.

## Success Criteria

### Measurable Outcomes

- **SC-001**: La lista de clientes muestra el saldo actual sin JOIN con trabajos ni cobros — una sola consulta a la tabla de transacciones.
- **SC-002**: Al emitir un presupuesto, la transacción de cargo se refleja en la cuenta corriente en menos de 1 segundo.
- **SC-003**: Al registrar un cobro, la transacción de abono se refleja en la cuenta corriente en menos de 1 segundo.
- **SC-004**: El historial de transacciones por cliente permite entender el 100% del saldo actual sin revisar trabajos individuales.
- **SC-005**: Un usuario puede identificar visualmente movimientos automáticos vs. manuales en el historial.

## Assumptions

- Las transacciones de cuenta corriente se almacenan en el mismo medio que los demás datos (actualmente Zustand store, luego DB real con Prisma).
- El saldo de la cuenta corriente se calcula como: SUM(cargos) - SUM(abonos) por cliente.
- Al migrar datos existentes, se generarán transacciones iniciales para todos los trabajos en estado `presupuestado` (cargo) y todos los cobros existentes (abono), preservando saldos actuales.
- Los ajustes manuales requieren confirmación del usuario ("¿Estás seguro de registrar este ajuste manual?").
- Las transacciones no se editan ni eliminan una vez creadas (inmutabilidad del registro financiero). Las correcciones se hacen mediante nuevas transacciones de ajuste.
