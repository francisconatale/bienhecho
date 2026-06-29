# Phase 0: Research

## Current Debt Calculation (3 locations)

| Location | File | Lines | Description |
|----------|------|-------|-------------|
| Client List | `src/app/clientes/components/client-list.tsx` | 128-135 | Iterates `presupuestado` jobs per client, subtracts cobros to show debt badge |
| Client Detail | `src/app/clientes/components/client-detail-pane.tsx` | 40-47 | Same iteration for the detail "Deuda" stat |
| Per-Job | `src/app/trabajos/[id]/hooks/use-payments.ts` | 49-51 | Per-job saldo pendiente calculation |

All three use the same pattern: `Σ(job.presupuesto) - Σ(cobros.monto_cobrado)` for `presupuestado` jobs.

## Hook Points

### 1. Emit Presupuesto (borrador → presupuestado)
- **File**: `src/app/trabajos/components/trabajo-detail.tsx`
- **Line**: 102 — `useDataStore.getState().updateJob(job.id, { estado: "presupuestado" })`
- **Trigger**: User clicks "Emitir" in PDF dialog (line 394)
- **Action needed**: Register cargo transaction after `updateJob`
- **Notes**: Need to know `job.cliente_id` and `job.presupuesto` at emit time

### 2. Register Cobro (manual)
- **File**: `src/app/trabajos/[id]/hooks/use-payments.ts`
- **Lines**: 69-78 — `addCobro()` → `addCobroStore()` + `checkAndAutoPaid()`
- **Trigger**: User fills CobroForm and saves
- **Action needed**: Register abono transaction after `addCobroStore`
- **Notes**: `use-payments` has access to `trabajoId` — need to resolve `cliente_id` from job. Hook should be inside `addCobro()` in the hook or directly in `addCobroStore`.

### 3. Register Cobro (auto, on "Marcar como Pagado")
- **File**: `src/app/trabajos/components/trabajo-detail.tsx`
- **Lines**: 343-357 — adds cobro for remaining balance, then sets estado="pagado"
- **Action needed**: Same as #2 — the `addCobro` call goes through store, so hooking at store level (`addCobroStore`) covers both cases

### 4. Update Cobro
- **File**: `src/app/trabajos/[id]/hooks/use-payments.ts`
- **Lines**: 80-88 — `updateCobro()` → `updateCobroStore()` + `checkAndAutoPaid()`
- **Action needed**: Register adjustment for the difference: `delta = new_monto - old_monto`
  - If `delta > 0`: abono for delta
  - If `delta < 0`: cargo for abs(delta)
- **Notes**: Need to know old monto before update. Can read from store before updating.

### 5. Delete Presupuestado Job
- **File**: `src/lib/store.ts`
- **Lines**: 194-198 — `removeJob()` filters job + tasks
- **Action needed**: Check if job was `presupuestado` → register reversal abono for `job.presupuesto`
- **Notes**: `removeJob` currently has access to `job.id` but NOT the full job object. Need to read job from `get().jobs.find(j.id)` before filtering, or make caller responsible.

### 6. Delete Cobro
- **File**: `src/lib/store.ts`
- **Lines**: 334-337 — `removeCobro()` filters cobro
- **File**: `src/app/trabajos/[id]/hooks/use-payments.ts`
- **Lines**: 90-93 — `removeCobro()` → `removeCobroStore()` + `checkAndAutoPaid()`
- **Action needed**: Register reversal cargo for `cobro.monto_cobrado`
- **Notes**: Same pattern as #5 — need cobro data before removal. Read from `get()` before filtering.

### 7. Presupuesto Change on Presupuestado Job (FR-002 Scenario 2)
- **Trigger**: When tasks/materials are updated on a `presupuestado` job, `job.presupuesto` changes
- **Location**: `addTask`, `updateTask`, `removeTask`, material add/update/remove all recalculate `presupuesto`
- **Complexity**: Need to detect `prevPresupuesto !== newPresupuesto` AND `job.estado === "presupuestado"` 
- **Action needed**: Register adjustment for the difference (cargo if presupuesto increased, abono if decreased)
- **Recommendation**: Create a helper `emitTransaccionAjustePresupuesto(cliente_id, job_id, oldMonto, newMonto)` called from each action that mutates presupuesto. But only when job.estado === "presupuestado".

## Migration Strategy

### Approach
On first load after deployment, generate initial transactions from existing data. Run once.

### Migration Flag
```typescript
// In localStorage, alongside the presupuestito-store persist key
const MIGRATION_KEY = "presupuestito-cc-migrated-v1";
```

### Migration Steps
1. For every `Job` with `estado === "presupuestado"`: create cargo transaction
   - `tipo: "cargo"`, `monto: job.presupuesto`, `concepto: "Emisión de presupuesto: ${job.titulo}"`
   - `referencia_trabajo_id: job.id`, `origen: "automático"`
   - `fecha: job.created_at` (best approximation)
2. For every `Cobro`: create abono transaction
   - `tipo: "abono"`, `monto: cobro.monto_cobrado`, `concepto: "Cobro registrado"`
   - `referencia_trabajo_id: cobro.trabajo_id`, `referencia_cobro_id: cobro.id`, `origen: "automático"`
   - `fecha: cobro.fecha_cobro`
3. Set migration flag

### Verifying Correctness
After migration, for each client:
```
Σ(cargos) - Σ(abonos) === current_debt_calculation
```
Current debt = Σ(presupuestado jobs.presupuesto) - Σ(cobros.monto_cobrado for those jobs)

## TransaccionCuentaCorriente Interface

```typescript
export interface TransaccionCuentaCorriente {
  id: string;
  cliente_id: string;
  tipo: "cargo" | "abono";
  monto: number;
  concepto: string;
  fecha: string;           // Date when transaction occurred (ISO string YYYY-MM-DD)
  referencia_trabajo_id?: string | null;
  referencia_cobro_id?: string | null;
  origen: "automático" | "manual";
  created_at: string;
}
```

## Balance Calculation Utility

```typescript
// Simple sum: cargo adds, abono subtracts
function getSaldo(cliente_id: string, transacciones: TransaccionCuentaCorriente[]): number {
  const clienteTx = transacciones.filter(t => t.cliente_id === cliente_id);
  return clienteTx.reduce((acc, t) => acc + (t.tipo === "cargo" ? t.monto : -t.monto), 0);
}
```

## Helper: use-cuenta-corriente hook

```typescript
// Returns saldo + transactions for a client
function useCuentaCorriente(clienteId: string) {
  // Reads from store, filters by clienteId, sorts by fecha desc
  // Computes saldo running total
  return { transacciones, saldo, isLoading: false };
}
```

## Architectural Decisions

### Store-level vs Hook-level Registration
**Decision**: Register transactions at the **store action level** (in `store.ts`) for emit/delete flows, because:
- `removeJob` and `removeCobro` in the store need to read data before removal
- Ensures transactions are always recorded even if bypassed (e.g., direct `updateJob` call)
- Consistent enforcement of immutability

Exception: For `updateCobro`, hook into the `use-payments.ts` hook because we need the old amount before update.

### Handling updateCobro
The hook-level `updateCobro` in `use-payments.ts` has access to cobros list before update. Pattern:
```
const oldCobro = cobros.find(c => c.id === id);  // before store update
// ... call updateCobroStore ...
// register adjustment for delta
```

### Format for formatCurrency
Use the existing `formatCurrency` in `client-list.tsx` and `client-detail-pane.tsx`. For full-precision display in transaction history (not K/M rounded), use `toLocaleString` directly.

## UI Component Targets

### client-list.tsx (replace debt calculation)
- Lines 128-135: Replace with `useCuentaCorriente(client.id).saldo`
- Keep same visual layout (deuda badge with amber color)

### client-detail-pane.tsx (replace + add history)
- Lines 40-47: Replace `deudaTotal` with `useCuentaCorriente(client.id).saldo`
- Add new section after "Trabajos del Cliente": "Cuenta Corriente" with:
  - Saldo actual card
  - Transaction history list
  - "Ajuste Manual" button

### New: ajuste-manual-form.tsx
- Form with: tipo (cargo/abono), monto, concepto
- Calls `addTransaccion` with `origen: "manual"`
- Confirmation dialog before saving

### New: use-cuenta-corriente.ts hook
- Reads transacciones from store
- Computes saldo
- Provides sorted list

## Summary of Store Changes

### New state
```typescript
transacciones: TransaccionCuentaCorriente[]
```

### New actions
```typescript
addTransaccion: (t: Omit<TransaccionCuentaCorriente, "id" | "created_at">) => TransaccionCuentaCorriente
```

### Modified actions
```typescript
addCobro: // + register abono transaction
removeCobro: // + register reversal cargo
removeJob: // + register reversal abono if job was presupuestado
```

### Migration
```typescript
runMigrationIfNeeded: () => void  // called on store initialization via persist `onRehydrateStorage`
```
