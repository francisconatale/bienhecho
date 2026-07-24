# Implementation Plan: Paginado local y filtrado de tareas por estado

**Branch**: `010-paginado-local-filtrado` | **Date**: 2026-06-29 | **Spec**: [spec.md](file:///home/francisco/Software/bien-hecho/bien-hecho-web/specs/010-paginado-local-filtrado/spec.md)

**Input**: Feature specification from `specs/010-paginado-local-filtrado/spec.md`

## Summary

Implementar paginado en memoria (límite de 10 tareas) en el tablero principal de tareas para reducir la carga cognitiva. Si el límite es excedido, se mostrará un botón "Ver todas" que dirigirá al usuario a una vista especializada por estado (sin límite). Como prueba a largo plazo, también inyectaremos más de 10 tareas en el store global para simular el comportamiento en la aplicación real.

## Technical Context

**Language/Version**: TypeScript / Next.js (App Router)

**Primary Dependencies**: React, Zustand (`useDataStore`), Tailwind CSS, Radix UI (si aplica para componentes).

**Storage**: En memoria via Zustand (`useDataStore`).

**Target Platform**: Web App.

**Project Type**: Next.js App (Frontend only for now).

## Constitution Check

- Todo el código se desarrollará adhiriendo a los patrones de la arquitectura descritos en el contexto global (Hooks funcionales puros de lógica, Componentes separados por Responsabilidad, Estilos basados en Utility CSS y variables globales).

## Project Structure

### Source Code

La estructura involucrará modificaciones a los archivos de la sección de tareas y al archivo de estado global.

```text
src/
├── app/
│   └── tareas/
│       ├── page.tsx               # Agregar lógica de vista principal vs especializada
│       └── hooks/
│           └── use-tareas.ts      # Modificar filtros, agregar slice y manejar estado de vista
└── lib/
    └── store.ts                   # (O donde resida) Agregar datos mock para probar >10 tareas
```

**Structure Decision**: No es necesario crear un nuevo módulo. Modificaremos en-place los componentes de `tareas` y el store global.

## Fases de Implementación (Phase 2 & 3)

1. Agregar mock data (>10 tareas) en el Zustand store para testeo local de escalabilidad.
2. Actualizar el hook `use-tareas.ts` para que exponga tareas limitadas a 10 para la vista de resumen, y la cuenta total de cada categoría.
3. Modificar `TareasFilter` o `TareasList` (y `page.tsx`) para incluir un botón "Ver todas" si la cuenta excede el límite.
4. Implementar el estado en UI para cambiar del modo "Resumen" a "Especializado", ocultando el límite cuando se explora una categoría en específico.
