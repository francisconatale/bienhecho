# Implementation Plan: Alineación de modelos con DB + Flujo core

**Branch**: `001-modelos-db` | **Date**: 2026-06-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-modelos-db/spec.md`

## Summary

Realign the data types (`Client`, `Job`, `Task`) with the PostgreSQL schema in `01-estructura-base-de-datos.md`, refactor the Zustand store to use the new types, implement CRUD for tasks within a job, update the job detail page to show tasks/progress/states, and adapt the budget PDF flow to generate from tasks.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15 (App Router)

**Primary Dependencies**: React 19, Tailwind CSS v4, Zustand, @react-pdf/renderer, lucide-react

**Storage**: Zustand (in-memory, no DB yet)

**Testing**: TBD

**Target Platform**: Web (responsive, mobile-first)

**Project Type**: web-app

**Constraints**: No new dependencies. Use existing stack only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Principle I (Simplicity): Realigning existing code, no new abstractions.
- ✅ Principle II (Data Integrity): Types will match DB schema exactly.
- ✅ Principle III (Tasks ≠ Visits): Tasks are billable items. Visits not implemented.
- ✅ Principle IV (Type Safety): Types defined at boundaries.
- ✅ Principle V (Progressive Enhancement): Responsive web, no native app.

## Project Structure

### Documentation (this feature)

```text
specs/001-modelos-db/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── types/
│   └── index.ts              # T1.1: Redefinir Client, Job, Task
├── lib/
│   └── store.ts              # T1.2: Refactorizar store con nuevos tipos
├── app/
│   ├── trabajos/
│   │   ├── page.tsx          # T1.4: Actualizar lista de trabajos
│   │   ├── nuevo/
│   │   │   └── page.tsx      # T1.4: Formulario nuevo trabajo
│   │   └── [id]/
│   │       ├── page.tsx      # T1.4: Detalle trabajo con tareas
│   │       └── components/
│   │           ├── task-list.tsx      # T1.3: Lista de tareas
│   │           ├── task-form.tsx      # T1.3: Formulario agregar/editar tarea
│   │           ├── task-item.tsx      # T1.3: Fila de tarea
│   │           ├── job-header.tsx     # T1.4: Header con datos del trabajo
│   │           ├── job-status.tsx     # T1.4: Selector de estado
│   │           └── progress-bar.tsx   # T1.4: Barra de progreso
│   └── (dashboard)/
│       └── presupuestos/
│           └── nuevo/
│               ├── page.tsx           # T1.5: Adaptar flujo presupuesto
│               └── hooks/
│                   └── use-budget.ts  # T1.5: Adaptar store de presupuesto
├── hooks/
│   └── use-budget-pdf.tsx    # T1.5: Adaptar generación PDF
└── lib/
    └── pdf/
        └── templates/
            └── afip-style.tsx # T1.5: Adaptar template PDF
```

**Structure Decision**: Single Next.js project. No monorepo. Code stays in `src/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | — | — |
