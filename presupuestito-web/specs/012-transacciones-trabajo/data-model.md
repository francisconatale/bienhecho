# Data Model: Desglose de Transacciones por Trabajo

## Existing Entities

### `transacciones`
La tabla `transacciones` ya existe en la base de datos (creada y utilizada por el módulo general de Cuenta Corriente y los triggers de actualización automática).

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Propietario (FK) |
| `cliente_id` | UUID | Cliente (FK) |
| `tipo` | Enum ('cargo', 'abono') | Determina si suma o resta al saldo del cliente |
| `monto` | Decimal | Valor de la transacción |
| `concepto` | String | Descripción del movimiento ("Emisión de presupuesto", "Cobro registrado", etc) |
| `fecha` | Date | Fecha de ocurrencia |
| `referencia_trabajo_id` | UUID (nullable) | FK a `trabajos.id`. Usado para agrupar las transacciones por trabajo |
| `referencia_cobro_id` | UUID (nullable) | FK a `cobros.id`. Permite identificar qué transacción pertenece a qué cobro |
| `origen` | Enum ('manual', 'automático') | Generalmente automático por los triggers de la BD |
| `created_at` | Timestamp | Fecha de inserción |

## UI Data Structures

Para la vista en el frontend, definiremos la interfaz en TypeScript:

```typescript
export interface Transaccion {
  id: string;
  user_id: string;
  cliente_id: string;
  tipo: "cargo" | "abono";
  monto: number;
  concepto: string;
  fecha: string;
  referencia_trabajo_id?: string | null;
  referencia_cobro_id?: string | null;
  origen: "manual" | "automático";
  created_at: string;
}
```

No requiere modificaciones en la base de datos. Solo consumo de los datos existentes.
