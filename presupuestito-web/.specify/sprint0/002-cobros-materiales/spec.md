# Feature Specification: Gestión de Cobros y Materiales

**Feature Branch**: `002-cobros-materiales`

**Created**: 2026-06-26

**Status**: Draft

**Input**: User description: "analiza @database_relations.md en la gestion de cobros y materiales, adaptalo a la estructura igual"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gestión de Materiales (Priority: P1)

Como usuario, quiero poder agregar, editar y eliminar los materiales utilizados o presupuestados para un trabajo.

**Why this priority**: Es fundamental para poder llevar un control de los insumos y sus costos (subtotal).

**Independent Test**: Puedo ir a la vista de un trabajo, ver la lista de materiales vacía, agregar uno con precio y cantidad, y ver el subtotal calculado y sumado al costo total de materiales del trabajo.

**Acceptance Scenarios**:

1. **Given** un trabajo existente, **When** agrego un material con nombre, cantidad y precio unitario, **Then** el sistema calcula el subtotal y lo guarda.
2. **Given** un trabajo con materiales, **When** abro la vista del trabajo, **Then** veo el listado de materiales y el total de la suma de sus subtotales.
3. **Given** un material guardado, **When** lo elimino, **Then** se actualiza el total de materiales del trabajo.
4. **Given** un trabajo con tareas y materiales, **When** genero el Presupuesto en PDF, **Then** los materiales aparecen desglosados en una sección separada con su propio subtotal, sumándose al total general del presupuesto.

---

### User Story 2 - Registro de Entregas Parciales (Priority: P2)

Como usuario, quiero definir entregas parciales (cuotas o hitos de pago) para un trabajo, indicando el monto comprometido y una fecha estimada.

**Why this priority**: Permite estructurar el plan de pagos con el cliente (ej. Anticipo, Avance 50%, Saldo).

**Independent Test**: Puedo crear una entrega parcial en un trabajo y verla reflejada en las cuentas a cobrar con saldo pendiente.

**Acceptance Scenarios**:

1. **Given** un trabajo, **When** agrego una entrega parcial con monto y concepto, **Then** aparece en la lista de entregas pendientes.
2. **Given** una entrega parcial, **When** consulto el saldo pendiente del trabajo, **Then** el monto de la entrega se suma al saldo a cobrar (si no hay pagos aún).

---

### User Story 3 - Registro de Cobros (Priority: P1)

Como usuario, quiero registrar los pagos recibidos (cobros) asociándolos opcionalmente a una entrega parcial, indicando el monto, fecha y forma de pago.

**Why this priority**: Es el core de la gestión financiera del trabajo, permite saber cuánto pagó el cliente y cuánto debe.

**Independent Test**: Puedo registrar un cobro, asociarlo o no a una entrega parcial, y ver cómo disminuye el saldo pendiente del trabajo.

**Acceptance Scenarios**:

1. **Given** un trabajo con saldo pendiente, **When** registro un cobro, **Then** el saldo pendiente del trabajo se reduce en ese monto.
2. **Given** una entrega parcial pendiente, **When** registro un cobro asociado a ella, **Then** se marca como pagada o parcialmente pagada según el monto.
3. **Given** múltiples cobros registrados, **When** abro la vista del trabajo, **Then** veo el historial de cobros y el saldo pendiente calculado correctamente.

---

### Edge Cases

- ¿Qué pasa si el monto de un cobro supera el monto de la entrega parcial asociada o el presupuesto total del trabajo?
- ¿Qué pasa si intento registrar un cobro con monto 0 o negativo?
- ¿Qué pasa si elimino un cobro ya registrado? ¿Se revierte el estado de la entrega parcial?
- ¿Qué pasa si elimino una entrega parcial que ya tiene cobros asociados?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema MUST permitir crear, listar, actualizar y eliminar `materiales` de un `trabajo`.
- **FR-002**: Sistema MUST calcular automáticamente `subtotal` = `cantidad` * `precio_unitario` para cada material.
- **FR-003**: Sistema MUST mostrar la suma de los subtotales de materiales en la vista del trabajo.
- **FR-004**: Sistema MUST incluir los materiales en el Presupuesto PDF (y opcionalmente en la Factura), presentados en una sección separada con sus respectivos precios, e incluirlos en el monto total a facturar.
- **FR-005**: Sistema MUST permitir crear, listar, actualizar y eliminar `entregas_parciales`.
- **FR-006**: Sistema MUST permitir registrar `cobros` con `monto_cobrado`, `fecha_cobro` y `forma_pago`.
- **FR-007**: Sistema MUST permitir asociar un cobro a una `entrega_parcial_id` o dejarlo directo al `trabajo`.
- **FR-008**: Sistema MUST calcular el saldo pendiente del trabajo tomando en cuenta tanto los honorarios/tareas como los materiales.
- **FR-009**: Sistema MUST actualizar el estado visual de una entrega parcial (pendiente, pagada) basándose en los cobros asociados.

### Key Entities

- **Materiales**: Insumos del trabajo (id, trabajo_id, nombre_material, cantidad, precio_unitario, subtotal, created_at).
- **Entregas Parciales**: Hitos o cuotas de pago (id, trabajo_id, numero_entrega, concepto, monto_entrega, fecha_estimada, created_at).
- **Cobros**: Pagos recibidos (id, trabajo_id, entrega_parcial_id, monto_cobrado, fecha_cobro, forma_pago, notas, created_at).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuario puede ver el total de materiales y el saldo pendiente en la vista principal del trabajo en menos de 1 segundo.
- **SC-002**: Al agregar un cobro, el saldo pendiente se recalcula e impacta en la UI inmediatamente.
- **SC-003**: La lógica de cálculo de saldos y subtotales no presenta errores de redondeo en operaciones normales.

## Assumptions

- Los datos se gestionan con Zustand en memoria (mocks) de acuerdo a la arquitectura actual, preparándose para la estructura final de base de datos detallada en `database_relations.md`.
- No hay validaciones fiscales (AFIP, facturas reales vinculadas), solo registro interno.
- Las formas de pago son un conjunto predefinido o un campo de texto libre simple (Efectivo, Transferencia, Cheque).
