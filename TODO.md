# TODO - Presupuestito

Ideas, tareas pendientes y mejoras pendientes. El usuario va guardando acá y se procesan cuando se pida.

---

## Sprint 1 - Completado (25/06/2026)

### T2: Types y Store alineados con DB
- [x] Rewritten `src/types/index.ts` — Client, Job, Task, JobStatus, Visit, VisitaTarea
- [x] Rewritten `src/lib/store.ts` — Zustand store with CRUD for clients, jobs, tasks + mock data
- [x] Cleaned `src/mocks/index.ts`

### T3: Trabajo detail + CRUD tareas
**Phase 1 — Nuevo trabajo**
- [x] Created `src/app/trabajos/nuevo/page.tsx` — form with client selector, title, address, description, budget, dates
- [x] Updated link in `src/app/trabajos/page.tsx` — "Nuevo Presupuesto" → "Nuevo Trabajo"

**Phase 2 — Detalle de trabajo**
- [x] Created `job-header.tsx` — title, client, address, budget, dates
- [x] Created `job-status.tsx` — 5-state selector with color badges + backward confirmation
- [x] Created `progress-bar.tsx` — X/Y tasks progress bar
- [x] Rewritten `[id]/page.tsx` — integrated all components + total estimado

**Phase 3 — CRUD de tareas**
- [x] Created `task-item.tsx` — checkbox, description, price, edit/delete with confirmation
- [x] Created `task-form.tsx` — inline form reusable for add + edit
- [x] Created `task-list.tsx` — sorted list + "Agregar" button

**Phase 4 — Lista de trabajos**
- [x] Rewritten `page.tsx` — new fields, status color badges, filters

**Phase 5 — Limpieza**
- [x] Deleted `src/app/proyectos/` (dead code)
- [x] Deleted `src/app/(dashboard)/presupuestos/nuevo/` (replaced)
- [x] Deleted `budget-list.tsx`, `budget-row.tsx`, `work-form.tsx`
- [x] Updated `quick-actions.tsx` and `bottom-nav.tsx` route references

### T4: Presupuesto PDF desde tareas
- [x] Created `src/lib/pdf/generate-budget.ts` — jspdf + jspdf-autotable PDF generator
- [x] Rewritten `src/hooks/use-budget-pdf.tsx` — accepts jobId, finds tasks, generates PDF
- [x] Added "Generar Presupuesto" button in job detail page (disabled if no priced tasks)
- [x] Migrated from @react-pdf/renderer to jspdf (React 19 compatibility fix)

### Fixes adicionales
- [x] `layout.tsx` — Replaced `next/script` inline with ThemeScript client component
- [x] `page.tsx` (dashboard) — `budgets` → `jobs`
- [x] `recent-activity.tsx` — rewritten to use jobs
- [x] `client-list.tsx`, `client-form.tsx`, `use-client-form.ts` — all fields updated (name→nombre, phone→telefono, etc.)
- [x] Deleted unused: `client-row.tsx`, `client-expanded-view.tsx`, `client-search.tsx`

---

## Backlog

### P1 - Urgente
<!-- Agregar ítems urgentes acá -->

### P2 - Importante
<!-- Agregar ítems importantes acá -->

### P3 - Normal
<!-- Agregar ítems normales acá -->

---

## En progreso

---
