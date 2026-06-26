# Tasks: Ampliación de Tarea con Adjuntos de Fotos

**Input**: Design documents from `/specs/001-tarea-adjuntos-fotos/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No tests requested in feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- Paths shown below assume single project - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install `idb` dependency in package.json
- [x] T002 [P] Add `TaskPhoto` type to src/types/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create IndexedDB abstraction layer in src/lib/photo-storage.ts
- [x] T004 Extend Zustand store with taskPhotos state and actions in src/lib/store.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Expandir tarea para ver detalles (Priority: P1) 🎯 MVP

**Goal**: Permitir abrir un modal al hacer clic para ver/editar detalles de la tarea

**Independent Test**: Puedo hacer clic en una tarea y ver un modal con todos los detalles

### Implementation for User Story 1

- [x] T005 [US1] Create TaskDetailModal component in src/app/trabajos/[id]/components/task-detail-modal.tsx
- [x] T006 [US1] Update TaskItem to open modal on click in src/app/trabajos/[id]/components/task-item.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Adjuntar fotos a una tarea (Priority: P1)

**Goal**: Permitir agregar fotos a una tarea para documentar el trabajo realizado

**Independent Test**: Puedo abrir una tarea, subir una foto con descripción, y verla listada

### Implementation for User Story 2

- [x] T007 [P] [US2] Create PhotoUpload component in src/app/trabajos/[id]/components/photo-upload.tsx
- [x] T008 [P] [US2] Create TaskPhotos component in src/app/trabajos/[id]/components/task-photos.tsx
- [x] T009 [US2] Integrate TaskPhotos into TaskDetailModal in src/app/trabajos/[id]/components/task-detail-modal.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Gestionar fotos adjuntas (Priority: P2)

**Goal**: Permitir eliminar fotos que ya no necesito y ver todas las fotos de una tarea

**Independent Test**: Puedo ver la galería de fotos de una tarea y eliminar alguna

### Implementation for User Story 3

- [x] T010 [US3] Add delete functionality with confirmation to TaskPhotos in src/app/trabajos/[id]/components/task-photos.tsx
- [x] T011 [US3] Add photo limit validation (max 20) in src/app/trabajos/[id]/components/task-photos.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T012 Add error handling for file validation in src/app/trabajos/[id]/components/photo-upload.tsx
- [ ] T013 Run quickstart.md validation scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 for expanded panel
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on US2 for photos functionality

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, US1 and US2 can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 2

```bash
# Launch all models for User Story 2 together:
Task: "Create PhotoUpload component in src/app/trabajos/[id]/components/photo-upload.tsx"
Task: "Create TaskPhotos component in src/app/trabajos/[id]/components/task-photos.tsx"
```

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
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
