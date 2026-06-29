---

description: "Task list for Cuenta Corriente por Cliente feature"
---

# Tasks: Cuenta Corriente por Cliente

**Input**: Design documents from `specs/008-cuenta-corriente-cliente/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/store-interface.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: No project initialization needed — project exists. Seed data transactions included in foundational.

*No tasks — project already set up with Next.js, Zustand, Tailwind.*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T001 Create `TransaccionCuentaCorriente` interface and add to exports in `src/types/index.ts`
- [ ] T002 [P] Add `transacciones` state array and `addTransaccion` action to `DataState` in `src/lib/store.ts`
- [ ] T003 [P] Add seed data transactions for existing presupuestado/pagado jobs (j2, j3) in initial state in `src/lib/store.ts`
- [ ] T004 Create `use-cuenta-corriente` hook in `src/hooks/use-cuenta-corriente.ts` with saldo calculation + running balance
- [ ] T005 Implement `runCCMigration` in `src/lib/store.ts` with localStorage flag, called via `onRehydrateStorage`

**Checkpoint**: Foundation ready — types, store, hook, and migration complete. User stories can begin.

---

## Phase 3: User Story 1 — Ver saldo de cuenta corriente (Priority: P1) 🎯 MVP

**Goal**: Replace debt calculation in client list and detail pane with transaction-based balance from `useCuentaCorriente`.

**Independent Test**: Open `/clientes` — each client shows saldo calculated from transacciones, not from jobs/cobros iteration.

- [ ] T006 Create `ClientListItem` sub-component in `src/app/clientes/components/client-list.tsx` using `useCuentaCorriente` to show saldo
- [ ] T007 [P] Replace `deudaTotal` calculation with `useCuentaCorriente(client.id).saldo` in `src/app/clientes/components/client-detail-pane.tsx`

**Checkpoint**: US1 complete — client list and detail show balance from transaction data.

---

## Phase 4: User Story 2 — Auto-cargo al emitir presupuesto (Priority: P1)

**Goal**: When user emits a budget (borrador → presupuestado), a cargo transaction is automatically registered.

**Independent Test**: Emit presupuesto for a borrador job → cargo transaction appears in cuenta corriente and saldo increases.

- [ ] T008 Register cargo transaction after `updateJob({ estado: "presupuestado" })` in `doGeneratePDF` callback in `src/app/trabajos/components/trabajo-detail.tsx`
- [ ] T009 [P] Detect presupuesto changes on `presupuestado` jobs and register adjustment transactions in task/material actions in `src/lib/store.ts` (FR-002 scenario 2)

**Checkpoint**: US2 complete — emitting a budget creates a cargo; modifying presupuesto on emitted jobs creates adjustments.

---

## Phase 5: User Story 3 — Auto-abono al recibir cobro (Priority: P1)

**Goal**: When a cobro is registered (manual or auto on mark-as-pagado), an abono transaction is automatically registered. Reversals on delete.

**Independent Test**: Register a cobro → abono appears in cuenta corriente and saldo decreases. Delete cobro → reversal cargo appears.

- [ ] T010 Modify `addCobro` in `src/lib/store.ts` to register abono transaction after creating cobro
- [ ] T011 [P] Modify `removeCobro` in `src/lib/store.ts` to register reversal cargo before removing cobro (FR-008)
- [ ] T012 [P] Modify `removeJob` in `src/lib/store.ts` to register reversal abono if job was `presupuestado` (FR-007)
- [ ] T013 Handle `updateCobro` adjustment (delta) in `src/app/trabajos/[id]/hooks/use-payments.ts`

**Checkpoint**: US3 complete — cobro create/update/delete all correctly impact cuenta corriente.

---

## Phase 6: User Story 4 — Ver historial de transacciones (Priority: P2)

**Goal**: Show transaction history in client detail with date, concept, type, amount, and running balance.

**Independent Test**: Open client detail → "Cuenta Corriente" section shows all transactions sorted by date with running balance.

- [ ] T014 Add "Cuenta Corriente" section to `src/app/clientes/components/client-detail-pane.tsx` with:
  - Saldo actual card (using `useCuentaCorriente`)
  - Transaction history list with fecha, concepto, tipo badge, monto, saldo después
  - Distinguish automático vs manual transactions visually (FR-010)
  - "Sin movimientos" empty state
  - Cursor and read-only rules per AGENTS.md

**Checkpoint**: US4 complete — transaction history visible and auditable in client detail.

---

## Phase 7: User Story 5 — Ajuste manual (Priority: P3)

**Goal**: Allow user to register manual cargo/abono transactions with custom concept.

**Independent Test**: Click "Ajuste Manual" in client detail → fill form → transaction appears with manual styling.

- [ ] T015 Create `AjusteManualForm` component in `src/app/clientes/components/ajuste-manual-form.tsx` with tipo selector, monto input, concepto input, and confirmation dialog
- [ ] T016 Integrate "Ajuste Manual" button and form modal into the "Cuenta Corriente" section in `src/app/clientes/components/client-detail-pane.tsx`

**Checkpoint**: US5 complete — manual adjustments can be registered and are visually distinct from automatic ones.

---

## Phase 8: Polish & Validation

**Purpose**: End-to-end validation of all user stories.

- [ ] T017 Run through all 9 scenarios in `specs/008-cuenta-corriente-cliente/quickstart.md` and fix any issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: No dependencies — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2
- **US2 (Phase 4)**: Depends on Phase 2 (needs `addTransaccion`)
- **US3 (Phase 5)**: Depends on Phase 2 (needs `addTransaccion` + modified store)
- **US4 (Phase 6)**: Depends on US1 (Phase 3) — both modify `client-detail-pane.tsx`
- **US5 (Phase 7)**: Depends on US4 (Phase 6) — integrates into the history section
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Parallelism

| Story | Can run parallel with |
|-------|---------------------|
| US1 (Phase 3) | US2, US3 (after Phase 2) |
| US2 (Phase 4) | US1, US3 (after Phase 2) |
| US3 (Phase 5) | US1, US2 (after Phase 2) |
| US4 (Phase 6) | Nothing — depends on US1 |
| US5 (Phase 7) | Nothing — depends on US4 |

### Parallel Opportunities

- T002 ↔ T003 (different parts of store.ts)
- T007 ↔ T006 (different files)
- T009 ↔ T008 (different files)
- T011 ↔ T012 ↔ T010 (different parts of store.ts, but same file — caution)
- T015 ↔ T016 (T016 depends on T015)

---

## Parallel Execution Examples

```bash
# Phase 2 foundational tasks:
Task: "Create TransaccionCuentaCorriente type in src/types/index.ts"
Task: "Add transacciones state + addTransaccion action in src/lib/store.ts"
Task: "Add seed data in src/lib/store.ts"

# US1 (after Phase 2):
Task: "Create ClientListItem in client-list.tsx"
Task: "Replace deudaTotal in client-detail-pane.tsx"

# US2 (after Phase 2):
Task: "Register cargo on emit in trabajo-detail.tsx"

# US3 (after Phase 2):
Task: "Modify addCobro in store.ts"
Task: "Modify removeCobro in store.ts"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 2: Foundational
2. Complete Phase 3: US1
3. **STOP and VALIDATE**: Client list shows balance from transactions
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Foundational → Foundation ready
2. Add US1 → Test independently (client saldo) → MVP
3. Add US2 → Test (emit → cargo)
4. Add US3 → Test (cobro → abono)
5. Add US4 → Test (transaction history)
6. Add US5 → Test (manual adjustment)

### What Each Story Unlocks

| Story | Value |
|-------|-------|
| US1 | Eliminates complex debt calculation from UI |
| US2 | Auto-track debt when emitting budgets |
| US3 | Auto-track payments against debt |
| US4 | Transparency into balance composition |
| US5 | Corrections for edge cases |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No tests framework exists — validation via quickstart.md scenarios
- Follow AGENTS.md rules: cursor-default select-none for read-only, glassmorphic surfaces, in-place editing (Stripe-like)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
