# Implementation Plan: PDF Personalization

## Technical Context

- **Frontend Framework**: Next.js App Router (React Server Components + Client Components)
- **State Management**: Zustand (`useDataStore`)
- **Styling**: Tailwind CSS v4, Lucide React icons
- **PDF Generation**: jspdf + jspdf-autotable (existing)
- **Font**: Inter (already embedded in current PDF generation)
- **Current entry point**: `src/lib/pdf/generate-budget.ts`

### Key Files

| File | Role |
|------|------|
| `src/lib/pdf/generate-budget.ts` | PDF generation logic — colors hardcoded (lines 74-78), logo centered (line 127) |
| `src/types/index.ts` | TypeScript type definitions |
| `src/lib/store.ts` | Zustand store |

### Unknowns (NEEDS CLARIFICATION)

- **NEEDS CLARIFICATION: Color derivation strategy**: How to auto-derive secondary colors (onPrimary, onSurface, onSurfaceVariant, outlineVariant) from the primary color? HSL lighten/darken? WCAG contrast ratio enforcement?
- **NEEDS CLARIFICATION: Preview component placement**: Where in the UI does the preview live? A full-page modal? A side panel in the budget view? A new route `/budgets/[id]/preview`?
- **NEEDS CLARIFICATION: Logo position storage in PDF params**: When no logo exists, should logo position controls be hidden or shown as disabled?

## Constitution Check

- No known violations.
- Follow AGENTS.md rules: in-place editing pattern, cursor-default select-none for read-only fields, cursor-pointer for interactive elements.
- Strictly respect `database_relations.md` — this feature does not modify existing database tables.
- This feature does not introduce new database tables (colors and logo position are transient session state).
- Follow existing patterns for component placement and naming.

## Phase 0: Research

See [research.md](research.md).

## Phase 1: Design & Contracts

See [data-model.md](data-model.md), [contracts/pdf-params.md](contracts/pdf-params.md), and [quickstart.md](quickstart.md).
