# Data Model: TransaccionCuentaCorriente

## Entity Definition

```typescript
interface TransaccionCuentaCorriente {
  id: string;                    // UUID v4
  cliente_id: string;            // FK → Client.id
  tipo: "cargo" | "abono";      // cargo = debt increases, abono = debt decreases
  monto: number;                 // Always positive. Sign derived from tipo.
  concepto: string;              // Human-readable description
  fecha: string;                 // ISO date YYYY-MM-DD (when the transaction occurred)
  referencia_trabajo_id: string | null;  // FK → Job.id (nullable)
  referencia_cobro_id: string | null;    // FK → Cobro.id (nullable)
  origen: "automático" | "manual";
  created_at: string;            // ISO datetime
}
```

## Constraints & Invariants

| Constraint | Rule |
|------------|------|
| Immutability | Once created, never updated or deleted. Corrections via new adjustment transactions. |
| Monto sign | `monto` is always stored as a positive number. Direction is derived from `tipo`. |
| Referential integrity | `referencia_trabajo_id` and `referencia_cobro_id` are nullable — only set when transaction originates from a job/cobro event. |
| Origen | `"automático"` for system-generated (emit, cobro, reversals). `"manual"` for user adjustments. |
| Balance calculation | `saldo = Σ(cargos) - Σ(abonos)` per `cliente_id`. |

## Balance Semantics

| Saldo | Meaning |
|-------|---------|
| `> 0` | Cliente debe (debt) |
| `= 0` | Sin deuda |
| `< 0` | Saldo a favor (client paid more than billed) |

## Comparison with Current Calculation

**Current (before feature):**
```typescript
// client-list.tsx:128-135
const saldoPendiente = clientJobs
  .filter(j => j.estado === "presupuestado")
  .reduce((acc, j) => {
    const cobrado = allCobros
      .filter(c => c.trabajo_id === j.id)
      .reduce((s, c) => s + c.monto_cobrado, 0);
    return acc + Math.max(0, j.presupuesto - cobrado);
  }, 0);
```

**After (with cuenta corriente):**
```typescript
// via use-cuenta-corriente hook
const saldo = transacciones
  .filter(t => t.cliente_id === client.id)
  .reduce((acc, t) => acc + (t.tipo === "cargo" ? t.monto : -t.monto), 0);
```

**Key difference:** The new calculation does NOT need to iterate jobs or cobros. It's a single pass over transactions. Also supports negative saldo (saldo a favor).

## Transaction Origin: Concept Generation

| Event | Concept Template | Tipo | Origen | Referencias |
|-------|-----------------|------|--------|-------------|
| Emitir presupuesto | `"Emisión de presupuesto: {job.titulo}"` | cargo | automático | referencia_trabajo_id |
| Registrar cobro | `"Cobro registrado: ${formatCurrency(monto)}"` | abono | automático | referencia_trabajo_id, referencia_cobro_id |
| Actualizar cobro (aumento) | `"Ajuste por modificación de cobro (+${delta})"` | abono | automático | referencia_cobro_id |
| Actualizar cobro (disminución) | `"Ajuste por modificación de cobro (${delta})"` | cargo | automático | referencia_cobro_id |
| Eliminar trabajo presupuestado | `"Anulación de presupuesto: {job.titulo}"` | abono | automático | referencia_trabajo_id |
| Eliminar cobro | `"Reversión de cobro: ${formatCurrency(monto)}"` | cargo | automático | referencia_cobro_id |
| Presupuesto modificado (aumento) | `"Actualización de presupuesto: +${delta}"` | cargo | automático | referencia_trabajo_id |
| Presupuesto modificado (disminución) | `"Actualización de presupuesto: ${delta}"` | abono | automático | referencia_trabajo_id |
| Ajuste manual (cargo) | user-defined | cargo | manual | null |
| Ajuste manual (abono) | user-defined | abono | manual | null |

## Running Saldo in History

When rendering transaction history, compute running balance for display:

```typescript
// Sort by fecha (asc) then created_at (asc), compute running balance
const sorted = [...transacciones].sort((a, b) => 
  a.fecha.localeCompare(b.fecha) || a.created_at.localeCompare(b.created_at)
);
let running = 0;
const withSaldo = sorted.map(t => {
  running += t.tipo === "cargo" ? t.monto : -t.monto;
  return { ...t, saldo_despues: running };
});
// Reverse for display (most recent first)
return withSaldo.reverse();
```
