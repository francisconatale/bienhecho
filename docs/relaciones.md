# ESTRUCTURA DE DATOS Y RELACIONES

## 1. MODELOS DE DATOS

### User
- `id` (PK)
- `email` (único)
- `password` (hash)
- `nombre`, `empresa`, `teléfono`
- `plan` (free / premium)
- `fechas` (creación, última actividad)

### Cliente
- `id` (PK)
- `user_id` (FK → User)
- `nombre`, `email`, `teléfono`, `dirección`, `ciudad`
- `fecha_creación`

### Presupuesto
- `id` (PK)
- `user_id` (FK → User)
- `cliente_id` (FK → Cliente)
- `número` (auto-incremental)
- `descripción`, `fechas` (creación, vencimiento)
- `estado` (borrador / enviado / aceptado / rechazado)
- `subtotal`, `descuento (%)`, `impuestos (%)`, `total`
- `notas`
- `fecha_conversión_factura` (Nullable)

### Item (Línea de Presupuesto)
- `id` (PK)
- `presupuesto_id` (FK → Presupuesto)
- `descripción`, `cantidad`, `precio_unitario`, `total`
- `orden`

### Factura
- `id` (PK)
- `presupuesto_id` (FK → Presupuesto) - Relación 1:1
- `número_factura`, `fecha_emisión`, `estado`, `total`, `vencimiento`

---

## 2. DIAGRAMA DE RELACIONES (Resumen)
- **User** 1:N **Cliente**
- **User** 1:N **Presupuesto**
- **Cliente** 1:N **Presupuesto**
- **Presupuesto** 1:N **Item**
- **Presupuesto** 1:1 **Factura**
