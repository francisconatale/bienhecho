# Feature Specification: Desglose de Transacciones por Trabajo

## Overview
Los usuarios necesitan ver en el detalle de un trabajo no solo los cobros recibidos, sino el desglose completo de la cuenta corriente específica para ese trabajo. Esto incluye los "cargos" (lo que se le va a cobrar al cliente por tareas y materiales), "abonos" (pagos) y "correcciones" (ajustes por cambios en el presupuesto). El objetivo es que el profesional pueda revisar el historial exacto de movimientos financieros que componen el saldo de un trabajo directamente desde su panel.

## User Scenarios & Testing

### Scenario 1: Ver el historial de transacciones de un trabajo presupuestado
**Given** que tengo un trabajo en estado "presupuestado" con tareas, materiales y cobros registrados,
**When** navego a la sección de "Cuentas a Cobrar / Pagos" dentro del detalle del trabajo,
**Then** veo un listado cronológico de los movimientos financieros (cargos por tareas/materiales, abonos por cobros).
**And** cada movimiento muestra su fecha, concepto, tipo (cargo o abono) y monto.
**And** el saldo pendiente reflejado arriba coincide con el balance neto de estos movimientos.

### Scenario 2: Reflejo de correcciones (ajustes)
**Given** que he modificado el precio de una tarea o borrado un cobro después de haber emitido el presupuesto,
**When** reviso el desglose de transacciones del trabajo,
**Then** veo las transacciones de ajuste (cargos compensatorios o abonos de corrección) con su concepto automático.

## Functional Requirements

- **F1**: En la vista de detalle de un trabajo (vista `pagos`), se debe mostrar un listado o línea de tiempo de transacciones en lugar de solo listar "Cobros".
- **F2**: El listado debe incluir todas las transacciones asociadas a ese trabajo (obtenidas desde la tabla `transacciones` donde `referencia_trabajo_id = trabajo.id`).
- **F3**: Cada ítem del listado debe diferenciar visualmente los "cargos" (suma a la deuda) de los "abonos" (resta a la deuda).
- **F4**: Se debe mostrar la fecha, el concepto descriptivo y el monto exacto de la transacción.
- **F5**: Se debe mantener la funcionalidad existente de agregar, editar y eliminar cobros dentro de esta misma vista (para los abonos correspondientes).

## Success Criteria

- Los profesionales pueden auditar línea por línea cómo se calculó la deuda final del trabajo.
- El 100% de las transacciones asociadas a un trabajo (cargos, abonos, ajustes automáticos) son visibles.
- La interfaz se mantiene simple, entendible e integrada con la tarjeta actual de "Saldo Pendiente".

## Key Entities
- **Trabajo**: Entidad contexto.
- **Transacciones**: Registros financieros (cargos y abonos) a listar.
- **Cobros**: Sus ABM siguen vigentes en esta pantalla.

## Assumptions & Out of Scope
- **Assumptions**: Las transacciones (incluidos ajustes granulares) se generan correctamente en la base de datos gracias a las últimas migraciones instaladas.
- **Out of Scope**: Generar un comprobante PDF del estado de cuenta del trabajo (solo visualización en pantalla).
