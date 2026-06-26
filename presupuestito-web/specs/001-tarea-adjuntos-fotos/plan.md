# Implementation Plan: Ampliación de Tarea con Adjuntos de Fotos

**Branch**: `001-tarea-adjuntos-fotos` | **Date**: 2026-06-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-tarea-adjuntos-fotos/spec.md`

## Summary

Expandir la clase Tarea para permitir:
1. Panel colapsable al hacer clic (toggle expand/collapse)
2. Adjuntar fotos con descripción a cada tarea
3. Gestión de fotos (ver galería, eliminar)

Enfoque: Mantener el formulario de crear/editar tarea simple (solo descripción y precio). Las fotos se gestionan en un panel expandido debajo de la tarea.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15 (App Router)

**Primary Dependencies**: React 19, Zustand, Tailwind CSS v4, lucide-react

**Storage**: 
- Estado actual: Zustand in-memory (mocks)
- Fotos: IndexedDB via `idb` library (nueva dependencia)
- Futuro: Supabase Storage cuando se implemente backend

**Testing**: No configurado actualmente (pendiente de Phase 6 del MVP)

**Target Platform**: Web responsive (mobile-first), funciona en desktop

**Project Type**: Web application (Next.js App Router)

**Performance Goals**: 
- Expandir tarea: < 100ms
- Cargar foto: < 5s (conexión normal)
- Renderizar galería: < 200ms

**Constraints**:
- Máximo 20 fotos por tarea
- Tamaño máximo por foto: 5MB
- Formatos permitidos: jpg, png, webp
- Sin backend por ahora (almacenamiento local)

**Scale/Scope**: 
- Single user (freelancer)
- ~50-100 trabajos activos
- ~5-10 fotos por tarea en promedio

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | ✅ PASS | Feature justificada: documentación fotográfica del trabajo es necesaria para el usuario |
| II. Data Integrity | ✅ PASS | Fotos no afectan facturación. Tareas mantienen su estructura actual |
| III. Tasks vs Visits | ✅ PASS | Fotos son adjuntos de tareas, no confunden con visitas |
| IV. Type Safety | ✅ PASS | Se usará Zod para validar archivos. TypeScript para tipos |
| V. Progressive Enhancement | ⚠️ VIOLATION | Fotos estaban "explicitly deferred" en constitución |

### Violation Justification

**Principle V Violation**: Las fotos estaban diferidas en la constitución original.

**Justificación**: 
1. El usuario solicitó explícitamente esta funcionalidad
2. Las fotos son documentación del trabajo, no funcionalidad core de facturación
3. Se implementa con almacenamiento local (IndexedDB), sin dependencia de backend
4. No bloquea el flujo simple de facturación

**Alternativa rechazada**: Esperar a implementar backend para usar Supabase Storage - retrasa valor al usuario.

**Resolución**: La constitución debe ser enmendada para mover "photo attachments" de "deferred" a "implemented with local storage".

## Project Structure

### Documentation (this feature)

```text
specs/001-tarea-adjuntos-fotos/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (UI contracts)
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── trabajos/[id]/
│       └── components/
│           ├── task-item.tsx      # MODIFICAR: agregar expand/collapse
│           ├── task-form.tsx      # SIN CAMBIOS
│           ├── task-photos.tsx    # NUEVO: galería de fotos
│           └── photo-upload.tsx   # NUEVO: componente de subida
├── lib/
│   ├── store.ts                  # MODIFICAR: agregar fotos al state
│   └── photo-storage.ts          # NUEVO: capa de abstracción IndexedDB
└── types/
    └── index.ts                  # MODIFICAR: agregar tipos de fotos
```

**Structure Decision**: Se mantiene la estructura existente. Se agregan nuevos componentes en el mismo directorio de trabajo. No se requieren nuevos directorios.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Principle V (fotos diferidas) | El usuario solicitó la funcionalidad explícitamente | No hay alternativa - el usuario necesita documentar trabajos con fotos |

## Phase 0: Research

### Research Tasks

1. **IndexedDB para almacenamiento de fotos**
   - Decisión: Usar `idb` library (lightweight wrapper)
   - Rationale: Más simple que localStorage para binarios, soporta grandes volúmenes
   - Alternativas: localStorage (límite 5MB), File System API (no soportado en todos lados)

2. **Gestión de estado para fotos**
   - Decisión: Agregar `taskPhotos` al Zustand store
   - Rationale: Consistente con el patrón existente
   - Alternativas: Context API (más complejo), useState local (no persiste entre navegaciones)

3. **Componente de upload**
   - Decisión: Input file con preview antes de guardar
   - Rationale: UX simple, sin dependencias externas
   - Alternativas: Drag & drop (más complejo), cámara directa (limitado en desktop)

**Output**: Ver research.md

## Phase 1: Design

### Data Model

Ver data-model.md para la estructura completa de `TaskPhoto`.

### UI Contracts

Ver contracts/ para los componentes UI.

### Quickstart

Ver quickstart.md para guía de validación.

## Agent Context Update

El plan de implementación debe referenciarse en `AGENTS.md` entre los marcadores `<!-- SPECKIT START -->` y `<!-- SPECKIT END -->`.
