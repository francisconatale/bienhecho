# Research: Persistir totales de cuentas a cobrar

**Feature**: `011-persistir-totales-cobros` | **Date**: 2026-08-10

## Objetivo

Eliminar el recálculo client-side de saldos al entrar a `/trabajos/[id]` y unificar la fuente de verdad de los totales de cuentas a cobrar, manteniendo la cuenta corriente consistente ante cambios de cobros.

## Decisiones

### D1. Persistir los agregados en `trabajos` (no en tabla nueva ni en una vista)

**Decision**: Agregar `total_estimado`, `total_cobrado` y `saldo_pendiente` como columnas de `trabajos`, mantenidas por triggers.

**Rationale**: Cada trabajo tiene exactamente un "cuentas a cobrar" (1:1). Persistir en la misma fila permite que `jobsService_getById` (ya usado por `use-payments` y `use-trabajo-detail`) devuelva todo en una sola query, sin joins extra. Sigue el patrón existente: `trabajos.presupuesto` ya es un agregado persistido por trigger.

**Alternatives considered**:
- *Tabla separada `cuentas_cobrar`*: agrega un join/query más y mantenimiento de sincronización sin beneficio (es 1:1 con `trabajos`).
- *Vista materializada*: complejidad de refresco y no resuelve la lectura single-query simple.
- *Solo persistir en el frontend (localStorage)**: no corrige la divergencia ni funciona multi-device.

### D2. Un único trigger function idempotente `recalcular_trabajo_totales()`

**Decision**: Una sola función PL/pgSQL que recalcula `presupuesto = SUM(tareas.precio)`, `total_estimado = presupuesto + SUM(materiales.subtotal)`, `total_cobrado = SUM(cobros.monto_cobrado)` y `saldo_pendiente = total_estimado - total_cobrado` para el `trabajo_id` afectado. Reemplaza a `update_trabajo_presupuesto` y `check_trabajo_pagado`.

**Rationale**: Hoy existen dos fórmulas en competencia (sidebar suma viva vs `job.presupuesto`). Unificar en una sola función evita duplicación y garantiza que `presupuesto` y los nuevos totales nunca divergan. Al recomputar desde las filas base (no `presupuesto + subtotal`), no hay dependencias circulares entre triggers.

**Alternatives considered**:
- *Mantener `update_trabajo_presupuesto` y agregar triggers parciales por tabla*: repite la fórmula en 3+ lugares y reintroduce riesgo de divergencia.
- *Trigger con SELECTs separados por tabla*: igual que D2 pero fragmentado; sin ventaja.

### D3. Absorber el auto-paso a `pagado` dentro del recálculo

**Decision**: Si `estado = 'presupuestado'` y `saldo_pendiente <= 0`, `recalcular_trabajo_totales()` actualiza `estado = 'pagado'`. Se dropea el trigger `on_cobro_insert_check_pagado` y la función `check_trabajo_pagado`.

**Rationale**: Elimina dependencia de orden entre triggers AFTER sobre `cobros` (el viejo `check_trabajo_pagado` podía leer valores no actualizados). Un solo UPDATE condicional resuelve el caso. El `emitir_transaccion_presupuesto` (trigger sobre `trabajos.estado`) queda intacto y no se dispara al pasar a `pagado` (su guard es `borrador → presupuestado`).

### D4. La BD es autoridad del subtotal de materiales

**Decision**: Trigger `BEFORE INSERT OR UPDATE` en `materiales` que fuerza `NEW.subtotal := NEW.cantidad * NEW.precio_unitario`.

**Rationale**: Hoy `subtotal` se calcula en el frontend y se guarda tal cual; si un cliente viejo/custom escribe un subtotal inconsistente, los totales persistidos quedarían mal. Forzarlo en BD garantiza consistencia del agregado.

**Alternatives considered**:
- *Solo confiar en el valor guardado*: reproduce el bug de datos inconsistente.

### D5. Auditoría de cuenta corriente ante edición/borrado de cobros

**Decision**:
- Al **editar** un cobro (`monto_cobrado`/`fecha_cobro`): sincronizar el `abono` automático en `transacciones` (mismo `referencia_cobro_id`).
- Al **borrar** un cobro: insertar un `cargo` automático "Anulación de cobro: {título}" (mismo monto), dejando el saldo neto en cero y conservando el abono original como rastro.

**Rationale**: El usuario eligió auditoría (cargo de anulación) sobre eliminar el abono. Mantiene historia completa y hace idempotente la neteadora. `referencia_cobro_id` se conserva en el cargo para trazabilidad.

**Alternatives considered**:
- *Eliminar el abono al borrar el cobro*: más simple pero pierde el rastro (rechazado por el usuario).
- *No tocar transacciones*: estado actual, deja la cuenta corriente desincronizada.

### D6. El frontend lee los agregados persistidos

**Decision**: `use-payments`, la sidebar de `trabajo-detail` y `client-detail-pane` leen `job.total_estimado` / `job.total_cobrado` / `job.saldo_pendiente`. El desglose tareas/materiales en vivo se mantiene solo para display.

**Rationale**: Elimina el recálculo en runtime (motivo del feature) y las 3 queries extra de `client-detail-pane` (tareas/materiales/cobros para métricas). La suma viva de tareas se mantiene solo donde se muestra el desglose.

**Alternatives considered**:
- *Mantener suma viva y solo cachear*: no elimina el recálculo observado.

## Estado previo del sistema (verificado en código)

- `use-payments.ts:37-49`: `presupuestoTotal = job.presupuesto + totalMateriales`; `saldoPendiente = presupuestoTotal - totalCobrado`.
- `trabajo-detail.tsx:245-248`: `totalEstimado = Σ tareas.precio`; `presupuestoTotal = totalEstimado + totalMateriales` (fórmula distinta).
- `client-detail-pane.tsx:101-138`: `jobMetrics` re-suma tareas/materiales/cobros vía queries directas.
- `cobros.service.ts`: sin efecto en `transacciones` (los triggers de BD lo hacen).
- Triggers actuales en BD (schema.sql): `on_cobro_insert` (abono), `on_cobro_insert_check_pagado`, `on_tarea_change_update_presupuesto`, `on_trabajo_estado_presupuestado` (cargo).
- `transaccionesService_create` solo se usa en `ajuste-manual-form.tsx` (ajustes manuales).

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| Orden de triggers AFTER en `cobros` (transaccion vs recálculo) | Los triggers no dependen entre sí; el abono se inserta tras el recálculo (orden alfabético: `on_cobro_change_recalcular` < `on_cobro_insert`). Si se quiere robustez total, se puede consolidar en una función. |
| `UPDATE trabajos SET estado='pagado'` dentro del recálculo dispara triggers de `trabajos` | `emitir_transaccion_presupuesto` tiene guard `borrador→presupuestado`; no se dispara. |
| Backfill masivo dispara triggers | El backfill es un `UPDATE` único sobre `trabajos` (no dispara los triggers de recálculo, que están en otras tablas). |
| Datos viejos con `subtotal` manual incorrecto | El backfill usa los `subtotal` almacenados; el trigger `BEFORE` corrige hacia adelante. Opcional: recalculcar subtotal en el backfill. |
| Reasignación de `trabajo_id` en UPDATE de tarea/material/cobro | Caso no soportado explícitamente; el trigger recalcula el trabajo destino. Documentado en assumptions. |
