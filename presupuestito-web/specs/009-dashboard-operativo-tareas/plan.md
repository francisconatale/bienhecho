# Implementation Plan: Dashboard Operativo de Tareas

## Technical Context
- **Frontend Framework**: Next.js App Router
- **State Management**: Zustand (`useDataStore`)
- **Styling**: Tailwind CSS v4, Lucide React icons
- **Data Model**: `Task` and `Material` already updated in `src/types/index.ts` and `src/lib/store.ts`.

## Constitution Check
- No known violations.
- We will strictly use `bg-surface/30` with `backdrop-blur-xl` and Aurora aesthetics for desktop layouts, while mobile will render cards independently as specified in `AGENTS.md` "Redesign & Estética Premium" rule.

## Phase 0: Research
See [research.md](research.md).

## Phase 1: Design & Contracts
See [data-model.md](data-model.md), [contracts/store-interface.md](contracts/store-interface.md), and [quickstart.md](quickstart.md).
