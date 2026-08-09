# Tasks: Arquitectura de Interpretación de Tareas por Chat

**Input**: Design documents from `/specs/001-voice-task-arch/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/llm-contract.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verificar la configuración de variables de entorno para Gemini y Supabase en `.env.local`
- [x] T002 Crear la estructura de carpetas necesaria en `src/actions`, `src/hooks`, y `src/components/chat`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Crear migración de Supabase para las tablas `conversations`, `tasks_snapshot` y `pending_steps` en `supabase/migrations/`
- [x] T004 [P] Definir las interfaces de TypeScript (`LLMResponse`, `BackendResponse`, `Tarea`, etc.) en `src/types/chat.ts` basado en `data-model.md`
- [x] T005 [P] Crear el archivo de prompts y configuración estática del modelo en `src/lib/parser/prompt-templates.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Chat Input Parsing (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to describe a task naturally using text chat, so that the system correctly understands my intent and the task parameters without requiring rigid commands.

**Independent Test**: Can be fully tested by submitting a text chat string and verifying the parsed JSON output from the LLM.

### Implementation for User Story 1

- [x] T006 [P] [US1] Mover y refactorizar la lógica experimental del LLM a una Server Action oficial en `src/actions/chat-actions.ts`
- [x] T007 [P] [US1] Crear el store global de Zustand en `src/hooks/use-chat-tasks.ts` para manejar el estado de la conversación y las tareas (mapeando a las interfaces de `src/types/chat.ts`)
- [x] T008 [US1] Crear el componente visual de entrada de chat en `src/components/chat/chat-interface.tsx` (conecta con `use-chat-tasks.ts`)
- [x] T009 [US1] Crear el componente visual para mostrar las tareas extraídas en `src/components/chat/task-list.tsx`
- [x] T010 [US1] Integrar la Server Action `chat-actions.ts` para que inserte las tareas detectadas en Supabase y devuelva el `BackendResponse` inicial.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Clarification Flow (Priority: P2)

**Goal**: As a user, I want the system to ask for missing information if my initial instruction was incomplete, so that I don't have to remember all required fields upfront.

**Independent Test**: Can be tested by providing an incomplete instruction, verifying the backend queues a clarification request, and processing a follow-up answer correctly.

### Implementation for User Story 2

- [x] T011 [P] [US2] Actualizar `src/actions/chat-actions.ts` para que genere y encole `pending_steps` en Supabase cuando reciba un array `missing` del LLM
- [x] T012 [P] [US2] Actualizar `src/actions/chat-actions.ts` para que exponga el `active_pending_step` en su respuesta al frontend.
- [x] T013 [US2] Modificar `src/hooks/use-chat-tasks.ts` para escuchar el `active_pending_step` y actualizar el estado visual de "enfocado/pendiente".
- [x] T014 [US2] Modificar `src/components/chat/task-list.tsx` para resaltar visualmente (ej. borde azul, spinner) la tarea que el backend indica en `active_pending_step`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Retry Logic and Limits (Priority: P3)

**Goal**: As a system administrator, I want the system to limit clarification attempts, so that the user isn't stuck in an endless loop if the LLM cannot parse their response.

**Independent Test**: Can be tested by simulating 3 failed clarification responses and verifying the backend halts the clarification request and transitions to manual intervention or proceeds with partial data.

### Implementation for User Story 3

- [ ] T015 [P] [US3] Agregar lógica en `src/actions/chat-actions.ts` para incrementar la columna `attempts` de `pending_steps` en cada respuesta fallida.
- [ ] T016 [US3] Añadir una validación en `src/actions/chat-actions.ts` que bloquee el step o lo marque como 'FAILED' si supera los 3 intentos.
- [ ] T017 [US3] Actualizar `src/components/chat/task-list.tsx` para mostrar un error visual si una tarea cae en estado de validación fallida y requiere intervención manual.

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T018 [P] Realizar las pruebas manuales dictadas en `quickstart.md`
- [ ] T019 Agregar tratamiento de errores globales y loaders visuales (LoadingSpinner) en `src/components/chat/chat-interface.tsx`
- [ ] T020 Limpiar código experimental residual en `src/app/design-lab/gemini/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed sequentially in priority order (P1 → P2 → P3)

### Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (initial parsing without clarifications)
5. Mover a las siguientes historias para añadir la lógica conversacional (US2) y robustez (US3).
