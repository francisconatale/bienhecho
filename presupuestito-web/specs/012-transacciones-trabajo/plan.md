# Implementation Plan: Desglose de Transacciones por Trabajo

**Branch**: `N/A` | **Date**: 2026-08-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/012-transacciones-trabajo/spec.md`

## Summary

Los usuarios necesitan ver en el detalle de un trabajo no solo los cobros recibidos, sino el desglose completo de la cuenta corriente específica para ese trabajo. 
Técnicamente, extenderemos el `PaymentsDashboard` (o crearemos un nuevo componente de timeline) y consumiremos las transacciones usando TanStack Query (`useQuery`) conectándolo a un nuevo `transactions.actions.ts`.

## Technical Context

**Language/Version**: TypeScript, Next.js (App Router)

**Primary Dependencies**: Tailwind CSS v4, Zustand, Zod, React Hook Form, lucide-react

**Storage**: PostgreSQL (Supabase)

**Testing**: Manual / Quickstart guide

**Target Platform**: Web App

**Project Type**: Web Application

**Performance Goals**: Fast UI load, optimistic updates si aplica.

**Constraints**: Usar Decimal para monedas (garantizado en BD). Mantener UI consistente con tokens MD3.

**Scale/Scope**: Limitado al alcance de un trabajo (decenas de transacciones).

## Constitution Check

*GATE: Passed*

- **Simplicity First**: Aprovecha los datos ya existentes en la BD.
- **Data Integrity**: Solo lee transacciones, no las modifica manualmente desde esta vista.
- **Separation of Concerns**: Transacciones financieras separadas de visitas.
- **Progressive Enhancement**: Vista integrada limpiamente y responsive.

## Project Structure

### Documentation (this feature)

```text
specs/012-transacciones-trabajo/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit-tasks command)
```

### Source Code (repository root)

```text
src/
├── actions/
│   └── transactions.actions.ts        # Nuevo Server Action
├── app/(dashboard)/trabajos/[id]/
│   ├── hooks/
│   │   └── use-transactions.ts        # Hook para datos
│   └── components/
│       ├── transactions-timeline.tsx  # Nuevo componente visual
│       └── payments-dashboard.tsx     # Actualización para incluir timeline
└── types/
    └── index.ts                       # Agregar tipo Transaccion
```

**Structure Decision**: Option 2: Web application (Next.js architecture). Centralizaremos el fetching en Server Actions y custom hooks, manteniendo la UI en la vista de detalle del trabajo.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Ninguna violación.
