# Store Interface: Cuenta Corriente

## State Addition

```typescript
// In DataState interface (src/lib/store.ts)
transacciones: TransaccionCuentaCorriente[];
```

## New Actions

### addTransaccion

```typescript
addTransaccion: (tx: Omit<TransaccionCuentaCorriente, "id" | "created_at">) => TransaccionCuentaCorriente;
```

Creates a new transaction with auto-generated `id` (UUIDv4) and `created_at` (ISO datetime). Appends to `transacciones[]`.

**Params:**
| Field | Type | Description |
|-------|------|-------------|
| cliente_id | string | FK to client |
| tipo | "cargo" \| "abono" | Direction |
| monto | number | Positive amount |
| concepto | string | Description |
| fecha | string | YYYY-MM-DD |
| referencia_trabajo_id | string \| null | Optional job ref |
| referencia_cobro_id | string \| null | Optional cobro ref |
| origen | "automático" \| "manual" | Source |

**Returns:** The newly created `TransaccionCuentaCorriente`.

**Implementation:**
```typescript
addTransaccion: (txData) => {
  const newTx: TransaccionCuentaCorriente = {
    ...txData,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  set((state) => ({ transacciones: [...state.transacciones, newTx] }));
  return newTx;
},
```

## Modified Actions

### addCobro (modified)

Register abono transaction after adding cobro.

```typescript
addCobro: (cobroData) => {
  const newCobro: Cobro = {
    ...cobroData,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  set((state) => {
    // Find client_id from job reference
    const job = state.jobs.find(j => j.id === cobroData.trabajo_id);
    const cliente_id = job?.cliente_id;
    
    if (cliente_id) {
      const newTx: TransaccionCuentaCorriente = {
        id: crypto.randomUUID(),
        cliente_id,
        tipo: "abono",
        monto: cobroData.monto_cobrado,
        concepto: `Cobro registrado: $${cobroData.monto_cobrado.toLocaleString("es-AR")}`,
        fecha: cobroData.fecha_cobro,
        referencia_trabajo_id: cobroData.trabajo_id,
        referencia_cobro_id: newCobro.id,
        origen: "automático",
        created_at: new Date().toISOString(),
      };
      return { cobros: [...state.cobros, newCobro], transacciones: [...state.transacciones, newTx] };
    }
    return { cobros: [...state.cobros, newCobro] };
  });
  return newCobro;
},
```

### removeCobro (modified)

Register reversal cargo before removing cobro.

```typescript
removeCobro: (id) =>
  set((state) => {
    const cobroToRemove = state.cobros.find(c => c.id === id);
    if (!cobroToRemove) return state;
    
    const job = state.jobs.find(j => j.id === cobroToRemove.trabajo_id);
    const cliente_id = job?.cliente_id;
    
    const newState: Partial<DataState> = {
      cobros: state.cobros.filter(c => c.id !== id),
    };
    
    if (cliente_id) {
      const reversalTx: TransaccionCuentaCorriente = {
        id: crypto.randomUUID(),
        cliente_id,
        tipo: "cargo",
        monto: cobroToRemove.monto_cobrado,
        concepto: `Reversión de cobro: $${cobroToRemove.monto_cobrado.toLocaleString("es-AR")}`,
        fecha: new Date().toISOString().slice(0, 10),
        referencia_trabajo_id: cobroToRemove.trabajo_id,
        referencia_cobro_id: id,
        origen: "automático",
        created_at: new Date().toISOString(),
      };
      newState.transacciones = [...state.transacciones, reversalTx];
    }
    
    return newState;
  }),
```

### removeJob (modified)

Register reversal abono if job was `presupuestado`.

```typescript
removeJob: (id) =>
  set((state) => {
    const jobToRemove = state.jobs.find(j => j.id === id);
    const newState: Partial<DataState> = {
      jobs: state.jobs.filter(j => j.id !== id),
      tasks: state.tasks.filter(t => t.trabajo_id !== id),
    };
    
    if (jobToRemove && jobToRemove.estado === "presupuestado") {
      const reversalTx: TransaccionCuentaCorriente = {
        id: crypto.randomUUID(),
        cliente_id: jobToRemove.cliente_id,
        tipo: "abono",
        monto: jobToRemove.presupuesto,
        concepto: `Anulación de presupuesto: ${jobToRemove.titulo}`,
        fecha: new Date().toISOString().slice(0, 10),
        referencia_trabajo_id: id,
        referencia_cobro_id: null,
        origen: "automático",
        created_at: new Date().toISOString(),
      };
      newState.transacciones = [...state.transacciones, reversalTx];
    }
    
    return newState;
  }),
```

### updateJob (modified)

Detect presupuesto changes when job is `presupuestado` and register adjustment.

```typescript
// Not modifying updateJob itself — instead, modify addTask, updateTask, removeTask
// and material actions (addMaterial, updateMaterial, removeMaterial) to detect
// when they change presupuesto on a presupuestado job and emit adjustment.
```

## Migration Action

```typescript
runCCMigration: () => void;
```

Called once on store initialization via `persist`'s `onRehydrateStorage`.

**Algorithm:**
```
1. Check localStorage flag "presupuestito-cc-migrated-v1"
2. If already migrated, return
3. Get all presupuestado jobs → create cargo for each
4. Get all cobros → create abono for each (skip if already covered by a job cargo? No, include all)
5. Save transacciones to state
6. Set localStorage flag
```

## Non-Store Public Interface

### useCuentaCorriente hook (`src/hooks/use-cuenta-corriente.ts`)

```typescript
function useCuentaCorriente(clienteId: string) {
  const transacciones = useDataStore(s => s.transacciones);
  
  const clienteTx = useMemo(() => 
    transacciones.filter(t => t.cliente_id === clienteId),
    [transacciones, clienteId]
  );
  
  const saldo = useMemo(() =>
    clienteTx.reduce((acc, t) => acc + (t.tipo === "cargo" ? t.monto : -t.monto), 0),
    [clienteTx]
  );
  
  const transaccionesConSaldo = useMemo(() => {
    const sorted = [...clienteTx].sort(
      (a, b) => a.fecha.localeCompare(b.fecha) || a.created_at.localeCompare(b.created_at)
    );
    let running = 0;
    const withSaldo = sorted.map(t => {
      running += t.tipo === "cargo" ? t.monto : -t.monto;
      return { ...t, saldo_despues: running };
    });
    return withSaldo.reverse();
  }, [clienteTx]);
  
  return { saldo, transacciones: transaccionesConSaldo, total: clienteTx.length };
}
```

### Saldo display in client-list.tsx (replacement)

**Before (line 128-135):**
```typescript
const saldoPendiente = clientJobs
  .filter((j) => j.estado === "presupuestado")
  .reduce(...);
```

**After:**
```typescript
// Inside renderItem, per client:
const { saldo } = useCuentaCorriente(client.id);
// Use `saldo` directly instead of computing from jobs+cobros
```

> **Note:** `useCuentaCorriente` cannot be called inside `renderItem` (React hook rule). Instead, restructure to call it per client in the parent, or use `useDataStore.getState().transacciones` synchronously inside `renderItem` to compute saldo.

**Recommended approach:** Since `renderItem` is called inside a map and hooks can't be called conditionally, use a sub-component:

```typescript
function ClientListItem({ client, isSelected, onSelect }: { ... }) {
  const { saldo } = useCuentaCorriente(client.id);
  // ... render with saldo
}
```

Then in `renderItem`, return `<ClientListItem ... />`.

### Saldo display in client-detail-pane.tsx (replacement)

Replace `deudaTotal` computed value with:
```typescript
const { saldo, transacciones } = useCuentaCorriente(client.id);
```

## Default Seed Data

Add one transaction for each existing `presupuestado` job in seed data:

```typescript
// In store initial state, alongside existing seed data
transacciones: [
  // j2 (presupuestado, $800K, cliente c2)
  {
    id: "tx1",
    cliente_id: "c2",
    tipo: "cargo" as const,
    monto: 800000,
    concepto: "Emisión de presupuesto: Reforma Consultorio Dental",
    fecha: "2026-06-28",
    referencia_trabajo_id: "j2",
    referencia_cobro_id: null,
    origen: "automático" as const,
    created_at: new Date().toISOString(),
  },
  // j3 (pagado, was presupuestado, $350K, cliente c3)
  {
    id: "tx2",
    cliente_id: "c3",
    tipo: "cargo" as const,
    monto: 350000,
    concepto: "Emisión de presupuesto: Mantenimiento General",
    fecha: "2026-06-28",
    referencia_trabajo_id: "j3",
    referencia_cobro_id: null,
    origen: "automático" as const,
    created_at: new Date().toISOString(),
  },
],
```

> Note: `j1` is `borrador` — no cargo until emitted.
