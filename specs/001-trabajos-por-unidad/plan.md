# Implementation Plan: Trabajos por Unidad/Horas

**Branch**: `[001-trabajos-por-unidad]` | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-trabajos-por-unidad/spec.md`

## Summary

Agregar los campos numéricos de cantidad y precio unitario a los trabajos (tareas del presupuesto), calcular automáticamente el precio total, actualizar la interfaz de edición, y modificar el PDF del presupuesto para que muestre el desglose completo. Adicionalmente, migrar datos antiguos asignando cantidad 1 por defecto.

## Technical Context

**Language/Version**: TypeScript (strict)

**Primary Dependencies**: Next.js (App Router), Tailwind CSS v4, Zod, React Hook Form, jsPDF, jspdf-autotable

**Storage**: Supabase (PostgreSQL)

**Testing**: Vitest

**Target Platform**: Web (Desktop & Mobile browsers)

**Project Type**: Web application

**Performance Goals**: Generación instantánea del PDF del presupuesto.

**Constraints**: Debe mantener compatibilidad hacia atrás con los presupuestos antiguos. Mantener la UI consistente con los tokens de Tailwind v4 y componentes atómicos.

**Scale/Scope**: Modificación de esquemas (Zod/TS), componentes de formulario (UI), tabla de renderizado del PDF y servicio de consultas.

## Constitution Check

*GATE: Passed*

- **Arquitectura de Componentes**: Los cambios se harán respetando la estructura Feature-Based en `app/(dashboard)/trabajos/[id]/components`.
- **Custom Hooks Pattern**: La lógica de cálculo y migración se mantendrá en los hooks o servicios, no en los componentes UI (puramente declarativos).
- **Estilos**: Se usarán las clases de Tailwind v4 y variables del `@theme`.

## Project Structure

### Documentation (this feature)

```text
specs/001-trabajos-por-unidad/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code (repository root)

```text
bien-hecho-web/
└── src/
    ├── app/(dashboard)/trabajos/
    │   └── [id]/components/
    │       ├── task-form.tsx          # Formulario a modificar
    │       ├── task-item.tsx          # Visualización en lista
    │       └── task-detail-panel.tsx  # Panel de detalles
    ├── lib/
    │   ├── schemas.ts                 # Validaciones Zod
    │   └── pdf/
    │       └── generate-budget.ts     # Generación del documento
    ├── services/
    │   └── tasks.service.ts           # Capa de datos y "migración" en lectura
    └── types/
        └── task.ts                    # Interfaces TypeScript
```

**Structure Decision**: El proyecto ya tiene una estructura Next.js establecida bajo `bien-hecho-web/src`. Modificaremos los archivos existentes en sus respectivas ubicaciones según el diseño de Features y Lib.

## Complexity Tracking

No constitution violations detected.
