# Implementation Plan: Navegación "Volver" Unificada

**Branch**: `005-navegacion-volver` | **Date**: 2026-06-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-navegacion-volver/spec.md`

## Summary

Unificar el botón "Volver" en todas las páginas usando query param `from` como mecanismo único. Cada navegación hacia un detalle pasa `from=/ruta-origen` y parámetros de contexto (`clienteId`, `jobId`). El "Volver" lee `from` para construir el href de regreso. Se eliminan strings descriptivos inconsistentes y la ruta muerta `/tareas`.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 15 (App Router)

**Primary Dependencies**: Next.js `useSearchParams`, `Link`, `lucide-react`

**Storage**: N/A (solo query params en URL)

**Testing**: Manual testing via escenarios del spec (8 scenarios)

**Target Platform**: Web responsive (mobile-first)

**Project Type**: Web application (frontend)

**Performance Goals**: N/A — no rendering impact

**Constraints**: Solo cambios en frontend. No tocar API, DB, ni backend.

**Scale/Scope**: ~8 archivos modificados, 0 archivos nuevos

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | ✅ PASS | Solución con query params existentes, sin abstracciones nuevas |
| II. Data Integrity | ✅ N/A | Sin cambios en datos financieros |
| III. Tasks vs Visits | ✅ N/A | Sin cambio en esa distinción |
| IV. Type Safety | ✅ PASS | Los valores de `from` serán string literals tipados |
| V. Progressive Enhancement | ✅ PASS | Funciona sin JS (Links son `<a>` nativos) |

## Project Structure

### Documentation (this feature)

```text
specs/005-navegacion-volver/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
src/app/
├── trabajos/
│   ├── page.tsx                          # Lista master-detail
│   ├── nuevo/page.tsx                    # Nuevo trabajo
│   └── [id]/
│       ├── page.tsx                      # Detalle trabajo (TrabajoDetail)
│       ├── components/
│       │   ├── trabajo-detail.tsx        # Lógica backHref principal
│       │   └── task-item.tsx             # Construye links a tareas
│       ├── materiales/page.tsx           # Sub-página materiales
│       ├── pagos/page.tsx                # Sub-página pagos
│       └── tareas/[tareaId]/page.tsx     # Detalle tarea
├── clientes/
│   └── components/client-list.tsx        # Link de clientes → trabajo
```

**Structure Decision**: Cambios distribuidos en archivos existentes. No hay nuevos componentes ni directorios.

## Complexity Tracking

> No constitution violations. Sin justificación de complejidad adicional requerida.
