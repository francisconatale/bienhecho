# Implementation Plan: Ciclo de Vida del Presupuesto

**Branch**: `007-ciclo-vida-presupuesto` | **Date**: 2026-06-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-ciclo-vida-presupuesto/spec.md`

## Summary

Simplificar la máquina de estados de trabajos de 5 estados a 3 (borrador → presupuestado → pagado), donde pagado es terminal. Al generar un presupuesto PDF, mostrar un diálogo que pregunte si emitir formalmente el presupuesto o solo guardar el PDF. Migrar trabajos existentes al nuevo modelo.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 15 (App Router)

**Primary Dependencies**: Next.js `useSearchParams`, `Link`, `lucide-react`, `zustand` (store), `@react-pdf/renderer`

**Storage**: Zustand store en memoria (mocks). Tipos en `src/types/index.ts`.

**Testing**: Manual testing via escenarios del spec

**Target Platform**: Web responsive (mobile-first)

**Project Type**: Web application (frontend)

**Performance Goals**: N/A — sin impacto en rendering

**Constraints**: Solo cambios en frontend. No tocar API, DB, ni backend. Datos en mocks (Zustand).

**Scale/Scope**: ~5-8 archivos modificados, 2-3 archivos nuevos (diálogo, recordatorio)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | ✅ PASS | 3 estados es más simple que 5. Menos complejidad cognitiva |
| II. Data Integrity | ✅ PASS | Constitución enmendada a v1.2.0. Nuevo modelo: borrador → presupuestado → pagado |
| III. Tasks vs Visits | ✅ N/A | Sin cambio en esa distinción |
| IV. Type Safety | ✅ PASS | Se actualizarán tipos `JobStatus` |
| V. Progressive Enhancement | ✅ PASS | Flujo funciona sin JS |

## Project Structure

### Documentation (this feature)

```text
specs/007-ciclo-vida-presupuesto/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (interface contracts)
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── types/
│   └── index.ts                     # JobStatus: "borrador" | "presupuestado" | "pagado"
├── stores/
│   └── job-store.ts                 # Lógica de transición de estados (borrador → presupuestado → pagado)
├── app/
│   ├── trabajos/
│   │   ├── page.tsx                 # Master-detail: mostrar badge con nuevo estado
│   │   ├── nuevo/page.tsx           # Nuevo trabajo arranca como borrador
│   │   └── [id]/
│   │       ├── page.tsx             # Detalle: botón "Marcar como pagado", advertencia si pagado
│   │       └── components/
│   │           └── trabajo-detail.tsx       # Lógica de estado, diálogo post-PDF "Emitir" / "Solo guardar"
│   └── clientes/
│       └── components/client-list.tsx       # Badge de estado actualizado
├── components/
│   └── status-badge.tsx             # Badge con 3 colores (borrador/azul, presupuestado/ámbar, pagado/verde)
```

**Structure Decision**: Cambios distribuidos en archivos existentes. Se agregan 2 componentes nuevos (diálogo post-PDF y recordatorio). No se crean nuevas rutas.

## Complexity Tracking

Sin violaciones constitucionales. No se requiere justificación de complejidad adicional.
