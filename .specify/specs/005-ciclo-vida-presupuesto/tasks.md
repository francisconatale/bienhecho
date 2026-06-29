# Tasks: Ciclo de Vida del Presupuesto

**Input**: Design documents from `/specs/007-ciclo-vida-presupuesto/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/store-interface.md

## Format: `[ID] [P] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No setup required — project is already initialized with Next.js, Zustand, Tailwind, etc.

---

## Phase 2: Foundational — Type & Store Updates

**Purpose**: Cambios base que necesitan todas las user stories. Sin esto no arranca nada.

- [ ] T001 Update `JobStatus` type in `src/types/index.ts` — reemplazar los 5 estados por `"borrador" | "presupuestado" | "pagado"`
- [ ] T002 [P] Update `addJob` in `src/lib/store.ts` — cambiar default `estado` de `"presupuestado"` a `"borrador"`
- [ ] T003 [P] Update mock data in `src/lib/store.ts` — mapear estados de jobs mock (`j1: "en_curso"` → `"presupuestado"`, `j3: "listo_para_facturar"` → `"presupuestado"`)

**Checkpoint**: Types y store listos. Las user stories pueden empezar.

---

## Phase 3: User Story 1 — Trabajo arranca como borrador (Priority: P1) 🎯 MVP

**Goal**: El usuario ve que los trabajos nuevos arrancan como "borrador" y el badge muestra los 3 colores correctos.

**Independent Test**: Crear un trabajo desde `/trabajos/nuevo` y verificar que aparece con badge azul "Borrador".

- [ ] T004 Rewrite `JobStatusSelector` in `src/app/trabajos/[id]/components/job-status.tsx` — reemplazar `STATUS_ORDER`/`STATUS_LABELS`/`STATUS_COLORS` con 3 estados (borrador: azul, presupuestado: ámbar, pagado: verde). Mantener el dropdown selector
- [ ] T005 [P] Update `getStatusColor` in `src/app/trabajos/components/job-list.tsx` — agregar colores para `borrador` (gris/outline) y `pagado` (verde/success), simplificar a solo 3 casos
- [ ] T006 [P] Update status text in `src/app/trabajos/components/job-list.tsx:137` — reemplazar `job.estado.replace(/_/g, " ")` para que muestre "borrador / presupuestado / pagado" (los nuevos valores no tienen `_` pero mantener la lógica igual)

**Checkpoint**: US1 completa — el badge y la lista muestran los 3 estados correctamente.

---

## Phase 4: User Story 2 — Generar presupuesto con decisión post-PDF (Priority: P1)

**Goal**: Al generar un PDF de presupuesto, se muestra un diálogo para elegir "Emitir presupuesto" (pasa a `presupuestado`) o "Solo guardar PDF" (sigue en `borrador`).

**Independent Test**: Generar un PDF desde un trabajo en borrador y verificar que aparece un diálogo modal que permite emitir o guardar.

- [ ] T007 Add `confirmPdfEmit` helper in `src/lib/store.ts` o en `src/lib/job-utils.ts` — función que hace `updateJob(id, { estado: "presupuestado" })` para ser llamada desde el diálogo
- [ ] T008 Add post-PDF dialog state in `src/app/trabajos/components/trabajo-detail.tsx` — agregar estado `showPdfDialog` y modificarlo cuando se presiona "Generar Presupuesto". Después de generar el PDF exitosamente, mostrar el diálogo
- [ ] T009 Render post-PDF dialog in `src/app/trabajos/components/trabajo-detail.tsx` — agregar un modal con dos botones: "Emitir presupuesto" (llama a `confirmPdfEmit`) y "Solo guardar PDF" (cierra el diálogo sin cambiar estado). El diálogo debe cerrarse con X/Escape sin cambiar estado (US4)
- [ ] T010 [P] Disable "Generar Presupuesto" button for `pagado` jobs in `src/app/trabajos/components/trabajo-detail.tsx` — extender la condición `disabled` para que también bloquee si `job.estado === "pagado"`

**Checkpoint**: US2 + US4 completas — el flujo de emisión de presupuesto funciona con decisión post-PDF.

---

## Phase 5: User Story 3 — Auto-pagado cuando los cobros cubren el total (Priority: P1)

**Goal**: Cuando se registran cobros que suman el total del trabajo, el estado pasa automáticamente a `pagado`. También se puede marcar manualmente.

**Independent Test**: Registrar cobros hasta cubrir el presupuesto y verificar que el badge cambia automáticamente a verde "Pagado".

- [ ] T011 Add `checkAndAutoPaid` logic in `src/app/trabajos/[id]/hooks/use-payments.ts` — después de `addCobro`, verificar con `useDataStore.getState()` si la suma de cobros >= presupuesto + materiales, y si es así llamar a `updateJob(trabajoId, { estado: "pagado" })`
- [ ] T012 [P] Add "Marcar como pagado" button in `src/app/trabajos/components/trabajo-detail.tsx` — agregar un botón en la sidebar (junto al status selector o en la card de total) que solo se muestre si `job.estado === "presupuestado"`. Al hacer clic, cambiar a `pagado`
- [ ] T013 [P] Add pagado warning in `src/app/trabajos/[id]/components/job-header.tsx` — cuando `job.estado === "pagado"`, deshabilitar la edición inline y mostrar un mensaje visual "Trabajo cerrado — no se puede editar"
- [ ] T014 [P] Prevent "Generar Presupuesto" and editing in sidebar when pagado — ya cubierto en T010, verificar que también se oculte/deshabilite el botón "Marcar como pagado" cuando ya está pagado

**Checkpoint**: US3 completa — pagos únicos y en cuotas pasan automáticamente a `pagado`, y se puede marcar manualmente.

---

## Phase 6: Polish & Cross-Cutting

- [ ] T015 Run quickstart scenarios in `specs/007-ciclo-vida-presupuesto/quickstart.md` — validar los 8 escenarios end-to-end
- [ ] T016 Clean up cualquier referencia a estados antiguos (buscar `en_curso`, `listo_para_facturar`, `facturado`, `cobrado` en el frontend y reemplazar donde corresponda)
- [ ] T017 `npm run lint` — verificar que no hay errores

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2
- **US2 (Phase 4)**: Depends on Phase 2 — can run in parallel with US1
- **US3 (Phase 5)**: Depends on Phase 2 — can run in parallel with US1 and US2
- **Polish (Phase 6)**: Depends on all user stories

### Parallel Opportunities

- All tasks marked [P] can run in parallel
- US1, US2, and US3 can theoretically be worked on in parallel (after Phase 2)
- T002 and T003 can run in parallel
- T004, T005, T006 can run in parallel
- T011, T012, T013, T014 can run in parallel

### Parallel Example

```bash
# Phase 2: Types & Store (parallel)
Task: "Update JobStatus type in src/types/index.ts"
Task: "Update addJob default estado in src/lib/store.ts"
Task: "Update mock data in src/lib/store.ts"

# Phase 3: US1 (parallel)
Task: "Rewrite JobStatusSelector in src/app/trabajos/[id]/components/job-status.tsx"
Task: "Update getStatusColor in src/app/trabajos/components/job-list.tsx"
Task: "Update status text in src/app/trabajos/components/job-list.tsx"

# Phase 5: US3 (parallel after Phase 2)
Task: "Add checkAndAutoPaid in use-payments.ts"
Task: "Add Marcar como pagado button in trabajo-detail.tsx"
Task: "Add pagado warning in job-header.tsx"
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 2: Foundational (types + store + mocks)
2. Complete Phase 3: US1 (badge shows borrador)
3. Complete Phase 4: US2 (PDF + dialog + emit)
4. **STOP and VALIDATE**: Create job → add tasks → generate PDF → emit → see "presupuestado"
5. Deploy/demo: el flujo básico de borrador a presupuestado funciona

### Incremental Delivery

1. Phase 2 → Foundation ready
2. Add US1 + US2 → Test independently → Deploy (MVP: flujo crear + presupuestar)
3. Add US3 → Test independently → Deploy (flujo completo: crear → presupuestar → cobrar → pagado automático)

---

## Notes

- No se requieren nuevas rutas ni páginas. Todos los cambios son sobre componentes existentes.
- El diálogo post-PDF es un modal inline en `trabajo-detail.tsx`, no un componente separado.
- La lógica de `checkAndAutoPaid` vive en el hook `use-payments.ts` porque es donde se registran cobros.
- No hay tests automatizados. La validación es manual via quickstart.md.
