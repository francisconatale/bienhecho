# Implementation Plan: Cuenta Corriente por Cliente

**Branch**: `` | **Date**: 2026-06-28 | **Spec**: [spec.md](../../.specify/specs/006-cuenta-corriente-cliente/spec.md)

**Input**: Feature specification from `.specify/specs/006-cuenta-corriente-cliente/spec.md`

## Summary

Crear una tabla de transacciones de cuenta corriente por cliente que reemplace el cálculo actual de deuda (que recorre trabajos y cobros). Cada emisión de presupuesto genera un cargo automático, cada cobro genera un abono, y el saldo se obtiene con una simple suma de transacciones. Se agrega historial visible en el detalle del cliente y ajustes manuales para correcciones.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 14 (App Router)

**Primary Dependencies**: Zustand (store), lucide-react (icons), react-hook-form + zod (forms)

**Storage**: Zustand store en memoria (mocks + persistencia localStorage). Futura migración a PostgreSQL vía Prisma.

**Testing**: Validación manual vía quickstart.md. Sin framework de tests automatizados en el frontend por ahora.

**Target Platform**: Web (responsive, mobile-first)

**Project Type**: Web application (frontend-only con mocks)

**Performance Goals**: Las transacciones de cuenta corriente se reflejan en <1s tras la acción que las dispara.

**Constraints**: Inmutabilidad de transacciones financieras — una vez creadas no se editan ni eliminan. Las correcciones se hacen mediante transacciones de ajuste.

**Scale/Scope**: Single-user freelancer tool. Máximo decenas de clientes, cientos de transacciones.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | ✅ PASS | Feature reemplaza cálculo complejo por modelo simple de transacciones. Sin abstracciones innecesarias. |
| II. Data Integrity | ✅ PASS | Transacciones inmutables. UUID como PK. Sigue la máquina de estados `borrador → presupuestado → pagado`. |
| III. Tasks vs Visits | ✅ PASS | No afecta esa separación. |
| IV. Type Safety | ✅ PASS | Zod para formularios de ajuste manual. Types estrictos. |
| V. Progressive Enhancement | ✅ PASS | Funcionalidad responsive. Sin dependencias nuevas. |

**Result: GATE PASSED** — No violations. Complexity Tracking table not needed.

## Project Structure

### Documentation (this feature)

```text
specs/008-cuenta-corriente-cliente/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code

```text
src/
├── types/
│   └── index.ts              # + TransaccionCuentaCorriente interface
├── lib/
│   └── store.ts              # + addTransaccion, removeTransaccion, getTransaccionesByClient
├── app/
│   └── clientes/
│       └── components/
│           ├── client-list.tsx         # Replace saldo calculation with transaction-based balance
│           ├── client-detail-pane.tsx  # + Historial transacciones section
│           └── ajuste-manual-form.tsx  # New: form for manual adjustments
├── hooks/
│   └── use-cuenta-corriente.ts        # New: hook to get balance + transactions
```

## Complexity Tracking

> Not needed — all gates passed without violations.

## Phase 0: Research ✅

Completed. See `research.md` for:
- Current debt calculation locations (client-list.tsx:128-135, client-detail-pane.tsx:40-47, use-payments.ts:49-51)
- 7 hook points identified (emit, add cobro, update cobro, delete job, delete cobro, presupuesto change, mark as pagado)
- Migration strategy using localStorage flag + one-time scan
- `TransaccionCuentaCorriente` interface definition
- Balance calculation utility
- `use-cuenta-corriente` hook design
- Architectural decisions (store-level vs hook-level registration)

## Phase 1: Design & Contracts ✅

| Artifact | File | Description |
|----------|------|-------------|
| Data Model | `data-model.md` | Entity def, constraints, balance semantics, concept generation table |
| Store Interface | `contracts/store-interface.md` | New/modified actions, migration, hooks, UI replacement patterns |
| Quickstart | `quickstart.md` | 9 validation scenarios with acceptance criteria |
