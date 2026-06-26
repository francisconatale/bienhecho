# Research: Alineación de modelos con DB

## Current State Analysis

### Existing Types (src/types/index.ts)

| Type | Current Fields | DB Equivalent | Gap |
|------|---------------|---------------|-----|
| `Client` | id, name, email?, phone?, category?, status? | clientes: id, nombre, telefono, email, direccion, notas, created_at | Missing: direccion, notas, created_at. Wrong: name→nombre, phone→telefono. Extra: category, status |
| `Job` | id, clientId, name, description?, status, createdAt | trabajos: id, cliente_id, titulo, direccion, descripcion, presupuesto, estado, fecha_inicio, fecha_fin_estimada, created_at | Missing: direccion, presupuesto, fecha_inicio, fecha_fin_estimada. Wrong: name→titulo, status values different |
| `Concept` | id, name, description, quantity, unit, price, amount | tareas: id, trabajo_id, descripcion, precio, completada, orden | Concept doesn't exist in DB. Task replaces it. |
| `Budget` | id, clientId, jobId, name, type, total, date, concepts[] | (no table) | Budget is not a table. It's a_JOB in presupuestado state with tasks. |

### Store (src/lib/store.ts)

- Manages: clients, jobs, budgets (all in-memory Zustand)
- Mock data uses old types (name, category, status for clients)
- References `projects` and `works` in some components (work-form.tsx) but store doesn't have them
- Budget store (use-budget.ts) is separate with its own Concept type

### Components referencing old types

- `work-form.tsx`: references `projects` from store (broken)
- `presupuestos/nuevo/`: uses Concept, Budget from use-budget.ts
- `trabajos/[id]/page.tsx`: uses Job.name, Client.name
- `trabajos/page.tsx`: uses Job.name, Job.status, Client.name
- `clientes/`: uses Client.name, Client.category, Client.status

## Key Findings

1. **No Prisma schema exists** — data is entirely in Zustand store
2. **Concept ≠ Task** — Concept has quantity/unit/amount, Task has completada/orden
3. **Budget ≠ Table** — Budget is a workflow state, not a separate entity
4. **Project layer is dead code** — work-form.tsx references projects but store doesn't have them
5. **PDF generation exists** — uses @react-pdf/renderer, adapts to new Task type

## Decision: Keep Zustand for MVP

No database integration in this phase. Keep in-memory store aligned with DB schema so migration is trivial later.
