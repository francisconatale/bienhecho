# Feature Specification: Persistir totales de cuentas a cobrar

**Feature Branch**: `011-persistir-totales-cobros`

**Created**: 2026-08-10

**Status**: Draft

**Input**: User description: "Al entrar a /trabajos/[id] los valores de cuentas a cobrar se recalculan en runtime. Propuesta: persistir total_estimado, total_cobrado y saldo_pendiente en la tabla `trabajos` y mantenerlos con triggers cuando se modifica algo (tareas, materiales, cobros). Además, sincronizar la cuenta corriente al editar/borrar cobros usando un cargo de anulación (auditoría)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - El saldo pendiente no cambia solo al entrar (Priority: P1)

El usuario abre `/trabajos/[id]` (y la vista `?view=pagos`) y ve el mismo saldo pendiente, total estimado y total cobrado que dejó la última vez, sin que el frontend vuelva a sumar tareas/materiales/cobros en runtime. Los montos solo cambian cuando realmente se modifica un dato de negocio (precio de tarea, material, o cobro).

**Why this priority**: Es el problema que motivó el feature. La persistencia elimina la recalclación observada y la divergencia entre la sidebar y el panel de Cuentas a Cobrar.

**Independent Test**: Abrir el mismo trabajo dos veces sin tocar datos y verificar que los valores cargan desde una única query de `trabajos` (no desde sumas client-side de tareas/materiales/cobros).

**Acceptance Scenarios**:

1. **Given** un trabajo con tareas, materiales y cobros existentes, **When** el usuario entra a `/trabajos/[id]`, **Then** la sidebar y el panel Cuentas a Cobrar muestran exactamente el mismo `total_estimado`, `total_cobrado` y `saldo_pendiente`.
2. **Given** los valores persistidos en `trabajos`, **When** no hay ningún cambio de datos, **Then** al recargar la página los montos permanecen idénticos (sin recálculo client-side).

---

### User Story 2 - Los totales se mantienen al modificar tareas, materiales o cobros (Priority: P1)

Cuando el usuario agrega/edita/borra una tarea con precio, un material, o un cobro, los totales persistidos (`total_estimado`, `total_cobrado`, `saldo_pendiente`) y `presupuesto` se actualizan automáticamente vía triggers. El auto-paso a `pagado` sigue funcionando cuando el saldo llega a 0.

**Why this priority**: Es la fuente de consistencia. Sin esto, la persistencia quedaría obsoleta al primer cambio.

**Independent Test**: Editar el precio de una tarea y verificar que `total_estimado` y `saldo_pendiente` en `trabajos` se recalculan; registrar un cobro por el total y verificar que el estado pasa solo a `pagado`.

**Acceptance Scenarios**:

1. **Given** un trabajo `presupuestado`, **When** se inserta/actualiza/elimina una tarea con precio, **Then** `trabajos.presupuesto` y `trabajos.total_estimado` reflejan la nueva suma de precios.
2. **Given** un trabajo `presupuestado`, **When** se inserta/actualiza/elimina un material, **Then** `trabajos.total_estimado` y `saldo_pendiente` se actualizan (materiales están incluidos en el total).
3. **Given** un trabajo `presupuestado`, **When** se registran cobros hasta cubrir `total_estimado`, **Then** `saldo_pendiente = 0` y `estado` pasa a `pagado` automáticamente.

---

### User Story 3 - La cuenta corriente queda consistente al editar o borrar un cobro (Priority: P2)

El usuario edita el monto de un cobro o elimina un cobro. La cuenta corriente del cliente (tabla `transacciones`) refleja ese cambio: al editar se ajusta el `abono`, y al borrar se registra un `cargo` de anulación (auditoría) que deja el saldo neto en cero, en lugar de quedar desincronizada como hoy.

**Why this priority**: La cuenta corriente muestra hoy montos obsoletos al modificar cobros. Con auditoría se mantiene el rastro completo.

**Independent Test**: Registrar un cobro de $100, borrarlo, y verificar que la cuenta corriente queda con un abono de $100 y un cargo de $100 (saldo neto sin cambio) y que `trabajos.total_cobrado` vuelve a 0.

**Acceptance Scenarios**:

1. **Given** un cobro con abono asociado, **When** se edita su `monto_cobrado`, **Then** la transacción `abono` de cuenta corriente se actualiza al nuevo monto.
2. **Given** un cobro con abono asociado, **When** se elimina el cobro, **Then** se inserta un `cargo` automático con concepto "Anulación de cobro: {título}" y `trabajos.total_cobrado` baja el monto eliminado.

---

### User Story 4 - El frontend usa una sola fuente de verdad (Priority: P2)

El frontend deja de calcular saldos en runtime: `use-payments`, la sidebar de `trabajo-detail` y el detalle de cliente leen los campos persistidos del trabajo. Se elimina la divergencia de las "dos fórmulas" (suma viva vs `job.presupuesto`).

**Why this priority**: Reduce código duplicado y bugs de consistencia. Depende de US1/US2.

**Independent Test**: Con la misma base de datos, comparar el total mostrado en `/trabajos/[id]`, `?view=pagos` y el detalle de cliente y verificar que coinciden.

**Acceptance Scenarios**:

1. **Given** un trabajo con datos, **When** se renderiza `trabajo-detail`, **Then** la sidebar usa `job.total_estimado` (manteniendo el desglose tareas/materiales solo para display).
2. **Given** un cliente con trabajos, **When** se renderiza `client-detail-pane`, **Then** el "Debe X" usa `job.saldo_pendiente` y no re-suma tareas/materiales/cobros.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La migración DEBE agregar a `trabajos` las columnas `total_estimado numeric(10,2) NOT NULL DEFAULT 0`, `total_cobrado numeric(10,2) NOT NULL DEFAULT 0` y `saldo_pendiente numeric(10,2) NOT NULL DEFAULT 0`.
- **FR-002**: Se DEBE crear un único trigger function idempotente (`recalcular_trabajo_totales`) que recalcule `presupuesto`, `total_estimado`, `total_cobrado`, `saldo_pendiente` para el trabajo afectado.
- **FR-003**: El auto-paso a `pagado` (saldo <= 0 y estado `presupuestado`) DEBE quedar absorbido dentro de `recalcular_trabajo_totales`, reemplazando a `check_trabajo_pagado`.
- **FR-004**: Se DEBEN instalar triggers de recálculo en `tareas` (INSERT/DELETE/UPDATE de `precio`, `cantidad`, `precio_unitario`), `materiales` (INSERT/DELETE/UPDATE de `cantidad`, `precio_unitario`, `subtotal`) y `cobros` (INSERT/DELETE/UPDATE de `monto_cobrado`).
- **FR-005**: Un trigger `BEFORE` en `materiales` DEBE forzar `subtotal = cantidad × precio_unitario` (la BD pasa a ser autoridad).
- **FR-006**: Al actualizar un cobro (`monto_cobrado`/`fecha_cobro`) se DEBE sincronizar el `abono` automático en `transacciones`.
- **FR-007**: Al eliminar un cobro se DEBE insertar un `cargo` automático de anulación (concepto "Anulación de cobro: {título}") en `transacciones`.
- **FR-008**: La migración DEBE incluir backfill de las columnas nuevas para los trabajos existentes.
- **FR-009**: `use-payments` DEBE leer `job.total_estimado`, `job.total_cobrado` y `job.saldo_pendiente` y dejar de sumar tareas/materiales/cobros para los totales.
- **FR-010**: La sidebar de `trabajo-detail` DEBE usar `job.total_estimado` como total; el desglose tareas/materiales queda solo para display.
- **FR-011**: `client-detail-pane` DEBE usar `job.saldo_pendiente`/`job.total_estimado` y eliminar el recálculo de `jobMetrics` (manteniendo el progreso de tareas).
- **FR-012**: Se DEBE actualizar `docs/database_relations.md` antes de aplicar la migración, y sincronizar los dumps `schema.sql` (raíz del web y del repo) tras el cambio.

### Key Entities

- **Trabajo**: tabla `trabajos`. Recibe `total_estimado`, `total_cobrado`, `saldo_pendiente` como agregados persistidos mantenidos por triggers.
- **Tarea / Material / Cobro**: tablas que disparan el recálculo al cambiar.
- **TransaccionCuentaCorriente**: tabla `transacciones`. Se sincroniza (abono) y audita (cargo de anulación) ante cambios de cobro.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El saldo pendiente en `/trabajos/[id]` se lee de una única query a `trabajos`; el frontend no suma tareas/materiales/cobros para mostrar totales.
- **SC-002**: Sidebar, panel Cuentas a Cobrar y detalle de cliente muestran montos idénticos para el mismo trabajo (divergencia 0).
- **SC-003**: Tras borrar un cobro, la cuenta corriente queda con saldo neto consistente (abono + cargo de anulación), verificable con una query.
- **SC-004**: El estado `pagado` se alcanza automáticamente cuando `saldo_pendiente <= 0` sin intervención manual.

## Assumptions

- La migración se aplica con Supabase CLI (`supabase db push`) contra la base remota.
- Los `trigger functions` existentes (`update_trabajo_presupuesto`, `check_trabajo_pagado`) y sus triggers se reemplazan/dropean por la función unificada.
- El saldo persistido admite valores negativos (caso "A favor"); el frontend sigue mostrando `Math.max(0, saldo)` como hoy.
- No se cambia la semántica de `trabajos.presupuesto` (suma de precios de tareas); solo se agregan los nuevos agregados.
- Cambiar `trabajo_id` de un cobro/tarea/material en un UPDATE (reasignación) es un caso no soportado explícitamente; el trigger recalcula al menos el trabajo destino.
