# Research: Triggers Cuenta Corriente

## Decision 1: Estrategia de Compatibilidad Hacia Atrás (Legacy)
- **Decision:** Mantener los trabajos existentes con su única transacción consolidada de presupuesto original intacta. Cualquier nueva adición, eliminación o edición de tarea/material generará transacciones individuales de ajuste.
- **Rationale:** Proteger la integridad de la base de datos y la contabilidad de los clientes evitando recalcular masivamente los históricos.
- **Alternatives considered:** Borrar el histórico de transacciones antiguas y regenerarlo basándose en las tareas/materiales vigentes. Descartado por el alto riesgo de descuadre si los montos cobrados o conceptos variaron en el tiempo sin quedar registrados a nivel ítem.

## Decision 2: Trazabilidad por Ítems Individuales
- **Decision:** Alterar la tabla `transacciones` para añadir claves foráneas opcionales a `referencia_tarea_id` y `referencia_material_id`.
- **Rationale:** Permite saber exactamente qué ítem provocó el cargo o descuento, facilitando la auditoría y previniendo la duplicación o el cálculo incorrecto del total del presupuesto.
- **Alternatives considered:** Solo añadir un texto descriptivo (ej: `concepto = 'Se agregó material: Tornillos'`). Descartado porque no permite rastrear de forma segura las ediciones de precios o eliminaciones de los mismos ítems.
