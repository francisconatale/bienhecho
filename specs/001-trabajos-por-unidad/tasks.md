---
description: "Task list for Trabajos por Unidad/Horas"
---

# Tasks: Trabajos por Unidad/Horas

**Input**: Design documents from `specs/001-trabajos-por-unidad/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify project structure and Supabase access (setup check)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Update `TaskSchema` with `cantidad` and `precio_unitario` fields in `bien-hecho-web/src/lib/schemas.ts`
- [x] T003 [P] Update `Task` interface with new fields in `bien-hecho-web/src/types/task.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Agregar trabajos con cantidad y precio unitario (Priority: P1) 🎯 MVP

**Goal**: Permitir agregar un trabajo especificando cantidad y precio unitario, calculando automáticamente el total.

**Independent Test**: Se puede probar creando un nuevo trabajo en un presupuesto, ingresando cantidad y precio, y verificando que el total sea correcto.

### Implementation for User Story 1

- [x] T004 [US1] Agregar inputs para `cantidad` y `precio_unitario`, con cálculo automático, en `bien-hecho-web/src/app/(dashboard)/trabajos/[id]/components/task-form.tsx`
- [x] T005 [P] [US1] Modificar la visualización de la tarea para mostrar el desglose en `bien-hecho-web/src/app/(dashboard)/trabajos/[id]/components/task-item.tsx`
- [x] T006 [P] [US1] Modificar el panel de detalles para mostrar el desglose en `bien-hecho-web/src/app/(dashboard)/trabajos/[id]/components/task-detail-panel.tsx`
- [x] T007 [US1] Modificar la configuración de autoTable (columnas, headers) para el PDF en `bien-hecho-web/src/lib/pdf/generate-budget.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Migración de trabajos existentes sin unidad (Priority: P1)

**Goal**: Los trabajos existentes sin unidad especificada asumen una cantidad de 1 y precio unitario igual al precio total actual.

**Independent Test**: Verificar un presupuesto antiguo en la UI y en el PDF para asegurarse de que los trabajos se muestran con "Cant: 1".

### Implementation for User Story 2

- [x] T008 [US2] Interceptar la obtención de tareas y establecer valores por defecto si `cantidad` está vacío en `bien-hecho-web/src/services/tasks.service.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T009 Run quickstart.md validation to ensure end-to-end functionality (UI and PDF) works properly.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies, but ensures backwards compatibility

### Parallel Opportunities

- Foundational tasks (T002, T003) can be done in parallel.
- UI rendering tasks (T005, T006) can be done in parallel after T004 is completed.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test backwards compatibility
4. Each story adds value without breaking previous stories
