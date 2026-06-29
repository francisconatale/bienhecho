# Tasks: Navegación "Volver" Unificada

**Input**: Design documents from `/specs/005-navegacion-volver/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: No tests requested — manual validation via quickstart.md scenarios.

**Organization**: Tasks grouped by functional requirement. All FRs share the same `from` param mechanism, so they build incrementally on each other.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which functional requirement this task belongs to (FR-01 through FR-06)

---

## Phase 1: Setup — Helper centralizado

**Purpose**: Crear el util function `buildBackHref` que centraliza la lógica de navegación de regreso.

- [x] T001 Create `buildBackHref` helper in `src/lib/nav.ts` — reads `from` and optional context params (`clienteId`, `jobId`) from URLSearchParams, returns a complete href string with fallback to `/trabajos`

---

## Phase 2: FR-01 — Cadena de navegación con query params `from`

**Goal**: El botón "Volver" en trabajo-detail lee `from` para volver al origen correcto. Los links hacia materiales/pagos/tareas pasan el contexto completo.

**Independent Test**: Navegar desde `/clientes` a un trabajo, verificar que `from=/clientes` está en la URL. Tap "Volver" → vuelve a `/clientes`.

- [x] T002 [FR-01] Update `backHref` logic in `src/app/trabajos/components/trabajo-detail.tsx` to use `buildBackHref` — replace existing conditional logic (lines 34-38) with helper call
- [x] T003 [FR-01] Update `backParams` construction in `src/app/trabajos/components/trabajo-detail.tsx` (line 58-60) to use `from=/clientes` or `from=/trabajos` as real route segments instead of descriptive strings
- [x] T004 [FR-01] Update client-to-job link in `src/app/clientes/components/client-list.tsx` (line 232) to pass `from=/clientes` as route segment

---

## Phase 3: FR-02 — Sub-páginas (Materiales, Pagos) vuelven al trabajo padre

**Goal**: Materiales y Pagos siempre vuelven al detalle del trabajo, preservando la cadena de navegación.

**Independent Test**: Desde el detalle del trabajo, entrar a Materiales → "Volver" → vuelve al trabajo. Verificar que `from` y `clienteId` se preservan.

- [x] T005 [FR-02] Update `backHref` in `src/app/trabajos/[id]/materiales/page.tsx` to use `buildBackHref` — replace lines 17-19 with helper call, ensuring context params propagate correctly
- [x] T006 [FR-02] Update `backHref` in `src/app/trabajos/[id]/pagos/page.tsx` to use `buildBackHref` — same pattern as materiales

---

## Phase 4: FR-03 — Tarea Detail vuelve al trabajo padre

**Goal**: El detalle de una tarea siempre vuelve al trabajo, preservando la cadena completa de navegación.

**Independent Test**: Desde el detalle del trabajo, entrar a una tarea → "Volver" → vuelve al trabajo. Verificar que la cadena `from` se preserva.

- [x] T007 [FR-03] Update `backHref` in `src/app/trabajos/[id]/tareas/[tareaId]/page.tsx` to use `buildBackHref` — replace lines 75-79 with helper call
- [x] T008 [FR-03] Update `from` param construction in `src/app/trabajos/[id]/components/task-item.tsx` (line 69) to pass `from` as real route segment (`/clientes` or `/trabajos`) instead of descriptive strings (`"trabajo"`, `"tareas"`)

---

## Phase 5: FR-04 — Nuevo Trabajo cancelación

**Goal**: El formulario de nuevo trabajo tiene un "Volver" que regresa a la lista correcta.

**Independent Test**: Ir a `/trabajos/nuevo` → "Volver" → vuelve a `/trabajos`.

- [x] T009 [FR-04] Update back button in `src/app/trabajos/nuevo/page.tsx` (line 68) to use `buildBackHref` — if `preselectId` exists, back goes to `/clientes?clienteId={id}`, otherwise `/trabajos`

---

## Phase 6: FR-05 — Eliminación de ruta muerta `/tareas`

**Goal**: Eliminar la referencia a `/tareas` que generaría 404.

**Independent Test**: Verificar que `grep -rn "from.*tareas" src/app/trabajos/` no retorna resultados con `from="tareas"`.

- [x] T010 [FR-05] Remove dead `from === "tareas"` branch in `src/app/trabajos/[id]/tareas/[tareaId]/page.tsx` (line 76) — replace with fallback to `/trabajos?id={jobId}`

---

## Phase 7: FR-06 — Nomenclatura consistente de parámetros

**Goal**: Todos los valores de `from` usan segmentos de ruta reales, no strings descriptivos.

**Independent Test**: `grep -rn "from=" src/app/` — todos los valores deben empezar con `/`.

- [x] T011 [FR-06] Audit all `from` param values across the codebase and ensure consistency — verify no instance of `"trabajo"`, `"tareas"`, or `"clientes"` (sin `/`) remains as a `from` value
- [x] T012 [FR-06] Update `buildBackHref` default fallback to use `/trabajos` when `from` is absent or invalid

---

## Phase 8: Polish

**Purpose**: Validación final y limpieza.

- [x] T013 Run quickstart.md validation — manually test all 6 scenarios from `specs/005-navegacion-volver/quickstart.md`
- [x] T014 Verify `useHeaderEditing` reset in `src/app/trabajos/components/trabajo-detail.tsx` — ensure pencil icon reappears after navigation (existing `useEffect` fix)
- [x] T015 Remove unused `Header` import from `src/app/trabajos/[id]/tareas/[tareaId]/page.tsx` if still present

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — creates the shared helper
- **Phase 2 (FR-01)**: Depends on Phase 1 — uses `buildBackHref`
- **Phase 3 (FR-02)**: Depends on Phase 1 — uses `buildBackHref`
- **Phase 4 (FR-03)**: Depends on Phase 1 — uses `buildBackHref`
- **Phase 5 (FR-04)**: Depends on Phase 1 — uses `buildBackHref`
- **Phase 6 (FR-05)**: Depends on Phase 4 — same file as FR-03 tasks
- **Phase 7 (FR-06)**: Depends on Phases 2-5 — final audit after all files updated
- **Phase 8 (Polish)**: Depends on all previous phases

### Parallel Opportunities

After Phase 1 completes:
- Phases 2, 3, 4, 5 can all run in parallel (different files, same pattern)
- T011 (audit) can run in parallel with implementation phases

---

## Implementation Strategy

### MVP First

1. Complete Phase 1: `buildBackHref` helper
2. Complete Phase 2: Trabajo detail (core navigation hub)
3. **STOP and VALIDATE**: Test that Clientes → Trabajo → Volver works
4. Complete Phases 3-5 in parallel: Materiales, Pagos, Tarea
5. Complete Phase 6: Clean up dead route
6. Complete Phase 7: Final audit
7. Complete Phase 8: Full validation

### Incremental Delivery

1. Helper created → Foundation ready
2. Trabajo detail updated → Core flow works (MVP)
3. Sub-pages updated → Full navigation chain works
4. Dead routes cleaned → No broken links
5. Audit complete → 100% consistency

---

## Notes

- All tasks modify existing files — no new components or pages needed
- The `buildBackHref` helper is the only new file (`src/lib/nav.ts`)
- Tasks are ordered to minimize merge conflicts (each phase touches different files)
- Commit after each phase for clean git history
