---
description: "Task list template for feature implementation"
---

# Tasks: Company Logo on Invoices

**Input**: Design documents from `specs/002-company-logo-invoices/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No automated tests were explicitly requested. Testing is manual via `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database and Storage initialization

- [x] T001 Configure Supabase bucket `company-logos` with public read access and 2MB upload limit (Manual task in Supabase Dashboard or via Migration)
- [x] T002 Add `logo_path` varchar column to `companies` table in Supabase (Manual task in Supabase Dashboard or via Migration)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create Supabase Storage helpers in `src/lib/supabase/storage.ts` (implemented in `src/services/storage.service.ts`) for uploading files and generating public URLs

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Upload Company Logo (Priority: P1) 🎯 MVP

**Goal**: Allow a company user to upload a company logo (max 2MB image) to Supabase Storage and associate it with their company profile.

**Independent Test**: Verify that a user can successfully upload an image from the settings page, and the `logo_path` is updated in the database.

### Implementation for User Story 1

- [x] T004 [US1] Create custom hook for upload logic in `src/app/(dashboard)/ajustes/hooks/use-logo-upload.ts` (depends on T003)
- [x] T005 [P] [US1] Create form UI component in `src/app/(dashboard)/ajustes/components/logo-uploader.tsx` with React Hook Form and Zod validation
- [x] T006 [US1] Integrate `LogoUploader` component into the settings page `src/app/(dashboard)/ajustes/perfil/page.tsx` (via `profile-layout.tsx`)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Logo on Invoices (Priority: P1)

**Goal**: Dynamically display the uploaded company logo on all generated invoices.

**Independent Test**: Verify that generating a new invoice or viewing a historical invoice displays the company logo at the top (if a logo is uploaded).

### Implementation for User Story 2

- [x] T007 [P] [US2] Update data fetching logic (in `src/hooks/use-budget-pdf.tsx`) to retrieve `logo_path` and generate the public URL
- [x] T008 [US2] Update invoice UI in `src/lib/pdf/generate-budget.ts` to render the logo in the PDF document

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T009 Run quickstart.md validation manually to ensure end-to-end functionality

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after Foundational (Phase 2), but practically depends on US1 to have a logo to test with.

### Parallel Opportunities

- T005 can run in parallel with T004.
- T007 can run in parallel with US1 tasks (assuming mock data is used for testing).

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (Upload works)

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently (Invoice display works)
