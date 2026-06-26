# Data Model: Gestión de Cobros y Materiales

Este modelo de datos refleja fielmente la estructura definida en `database_relations.md` para las entidades relacionadas con los materiales, hitos de pago (entregas parciales) y el registro de pagos (cobros).

## Entidades Principales

### `materiales`
Materiales utilizados o presupuestados para un trabajo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `uuid PK` | Identificador único |
| `trabajo_id` | `uuid FK` | Trabajo al que pertenece (`→ trabajos.id`) |
| `nombre_material` | `string` | Nombre del material |
| `cantidad` | `decimal` | Cantidad utilizada/presupuestada |
| `precio_unitario` | `decimal` | Precio por unidad |
| `subtotal` | `decimal` | Calculado: `cantidad` × `precio_unitario` |
| `created_at` | `timestamp` | Fecha de registro |

### `entregas_parciales`
Hitos o cuotas contra el presupuesto de un trabajo. Cada trabajo puede tener múltiples entregas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `uuid PK` | Identificador único |
| `trabajo_id` | `uuid FK` | Trabajo al que pertenece (`→ trabajos.id`) |
| `numero_entrega` | `integer` | Número correlativo por trabajo (1, 2, 3...) |
| `concepto` | `string` | Ej: "Anticipo", "Avance 50%" |
| `monto_entrega` | `decimal` | Monto comprometido de esta entrega |
| `fecha_estimada` | `date` | Fecha tentativa de cobro (Nullable) |
| `created_at` | `timestamp` | Fecha de registro |

### `cobros`
Registro de pagos recibidos. Opcionalmente vinculados a una entrega parcial.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `uuid PK` | Identificador único |
| `trabajo_id` | `uuid FK` | Trabajo al que pertenece (`→ trabajos.id`) |
| `entrega_parcial_id` | `uuid FK` | Entrega asociada (`→ entregas_parciales.id`). Null si no corresponde a una entrega específica |
| `monto_cobrado` | `decimal` | Monto recibido |
| `fecha_cobro` | `date` | Fecha en que se cobró |
| `forma_pago` | `string` | Efectivo, Transferencia, Cheque, etc. (Nullable) |
| `notas` | `text` | Comentarios adicionales (Nullable) |
| `created_at` | `timestamp` | Fecha de registro |

## Relaciones

- `TRABAJO (1) ──── (N) MATERIAL`
- `TRABAJO (1) ──── (N) ENTREGA_PARCIAL`
- `TRABAJO (1) ──── (N) COBRO`
- `ENTREGA_PARCIAL (1) ──── (N) COBRO` (Relación opcional, un cobro puede no estar ligado a una entrega)

## Lógica Derivada (Calculada en Runtime)

Para mostrar en la interfaz, se deben calcular los siguientes valores:

1. **Total de Materiales (por Trabajo)**
   `SUM(materiales.subtotal) WHERE trabajo_id = X`

2. **Saldo Pendiente del Trabajo**
   - Si tiene entregas parciales: `SUM(entregas_parciales.monto_entrega) - SUM(cobros.monto_cobrado)`
   - Si NO tiene entregas parciales: `trabajos.presupuesto - SUM(cobros.monto_cobrado)`

3. **Estado de una Entrega Parcial**
   - Pagada: Si `SUM(cobros.monto_cobrado) WHERE entrega_parcial_id = Y` >= `entregas_parciales.monto_entrega`
   - Parcialmente pagada: Si `0 < SUM(cobros.monto_cobrado) < entregas_parciales.monto_entrega`
   - Pendiente: Si `SUM(cobros.monto_cobrado) == 0`
