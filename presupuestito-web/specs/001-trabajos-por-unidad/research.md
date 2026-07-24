# Research & Analysis

## Unknowns & Clarifications
- All clarifications were resolved during the specification phase.
- Codebase analysis confirmed the exact locations for the needed changes.

## Technology Choices

1. **PDF Generation (jsPDF + jspdf-autotable)**
   - **Decision**: Update the existing `generate-budget.ts` autoTable configuration.
   - **Rationale**: The project already relies on `jspdf-autotable` to render the budget tables. Adding two columns (Cantidad and Precio Unitario) is a simple configuration change to `head` and `columnStyles`.
   - **Alternatives considered**: None, keeping the current rendering engine is safest and fastest.

2. **Data Migration for Existing Records**
   - **Decision**: Implement read-time fallback in `tasks.service.ts` or in the mapping layer, setting `cantidad = 1` and `precio_unitario = precio` if `cantidad` is undefined or null in the database.
   - **Rationale**: Avoids the need for an immediate blocking SQL migration that might disrupt production, though a SQL migration should also be provided for data consistency.
   - **Alternatives considered**: Strict SQL migration only. While good, a read-time fallback ensures zero downtime and immediate compatibility.

3. **UI Updates (Task Form)**
   - **Decision**: Add numerical inputs for `cantidad` (default 1) and `precio_unitario` in `task-form.tsx`.
   - **Rationale**: Best user experience. The total price field will become read-only or calculated automatically on the fly.
