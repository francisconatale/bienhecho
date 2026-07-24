# Tasks: PDF Personalization

## Phase 1: Setup

No setup tasks required. The feature uses only existing dependencies (jspdf, jspdf-autotable, Tailwind, Lucide, React).

---

## Phase 2: Foundational

**Goal**: Create shared types and utilities needed by all user stories.

- [x] T001 Create `src/lib/pdf/types.ts` with `PDFParams` interface, `DEFAULT_PDF_PARAMS`, `PDFColorSet` type, and `hexToRgb` utility

- [x] T002 [P] Create `src/lib/pdf/derivePDFColors.ts` with HSL-based color derivation function per research.md decisions

- [x] T003 Modify `src/lib/pdf/generate-budget.ts` to accept optional `PDFParams`, replace hardcoded colors with `derivePDFColors()`, and adjust logo X position based on `logoPosition`

**Verification**: `generateBudgetPDF(data)` (no params) still produces identical output to current behavior.

---

## Phase 3: [US3] Live Runtime Preview

**Goal**: Build and wire the preview modal that houses color picker and logo selector.

- [x] T004 [US3] Create `src/components/budgets/PDFPreviewModal.tsx` with:
  - Modal shell (consistent with existing app modal patterns)
  - HTML/CSS preview of the budget layout (header with logo, sender/receiver blocks, item table, observations, footer with total)
  - Props: `data: PDFData`, `onDownload`, `onCancel`
  - Internal state for `PDFParams` with defaults

- [x] T005 [US3] Locate the budget view page that contains the "Ver PDF" / "Descargar PDF" button and add a "Personalizar PDF" button next to it that opens the modal

**Verification**: Open a budget → click "Personalizar PDF" → modal opens showing budget layout with default colors and centered logo → click "Cancelar" → modal closes, no PDF generated.

---

## Phase 4: [US1] Customize PDF Colors

**Goal**: Add color picker to the modal and make the preview + PDF generation use the selected color.

- [x] T006 [P][US1] Add a color picker (`<input type="color">`) to the PDFPreviewModal header area that updates `primaryColor` in `PDFParams` state

- [x] T007 [US1] Wire the color picker to the preview: re-render preview colors via `derivePDFColors()` immediately on picker change; on "Descargar", pass `PDFParams` to `generateBudgetPDF()`

**Verification**: Open modal → pick a color → preview header/footer/text colors update instantly → click "Descargar" → PDF opens with the selected color applied.

---

## Phase 5: [US2] Adjust Logo Position

**Goal**: Add logo position selector and apply it to preview + PDF.

- [x] T008 [P][US2] Add a logo position radio group (Izquierda/Centro/Derecha) to the PDFPreviewModal. If no logo URL in `userProfile`, render controls as disabled with tooltip "Subí un logo desde tu perfil para personalizar su posición"

- [x] T009 [US2] Wire logo position to preview (reposition logo in HTML/CSS preview) and to PDF generation (logo alignment on header)

**Verification**: With logo uploaded → open modal → switch to "Derecha" → preview logo shifts right → "Descargar" → PDF logo aligns right. Without logo → options disabled with tooltip.

---

## Phase 6: Shared Layout Refactor

**Goal**: Extract shared layout constants and a reusable BudgetPreview component used by both preview and PDF generation.

- [x] T012 Create `src/lib/pdf/budget-layout.ts` with shared layout constants (LAYOUT object)

- [x] T013 Create `src/components/budgets/BudgetPreview.tsx` — React component rendering budget layout using shared constants

- [x] T014 [P] Refactor `PDFPreviewModal.tsx` to use `BudgetPreview` instead of duplicating layout

- [x] T015 [P] Refactor `generate-budget.ts` to reference `LAYOUT` constants and `buildItemsList()`

**Verification**: Preview and PDF generation produce identical layouts. Build passes with `npm run build`.

---

## Phase 7: Polish & Edge Cases

**Goal**: Handle edge cases and ensure backward compatibility.

- [x] T010 Handle edge cases:
  - No logo: hide logo area in preview, disable position controls
  - Very light primary color (#FFCC00): `derivePDFColors` must produce black `onPrimary` text for readability
  - Long budget content: preview modal scrolls naturally (no overflow clipping)
  - Unsaved changes: closing modal discards params (already default behavior via `useState`)

- [x] T011 Verify all scenarios in `quickstart.md` pass. Run `npm run build` to ensure no type errors.

**Verification**: All 4 scenarios from quickstart.md pass. No type-check errors.

---

## Dependencies

```
Foundational (T001-T003)
        │
        ▼
  [US3] Preview Modal (T004-T005)
        │
        ├────────────────┐
        ▼                ▼
 [US1] Colors    [US2] Logo Position
 (T006-T007)     (T008-T009)
        │                │
        └────┬───────────┘
             ▼
      Polish (T010-T011)
```

US1 and US2 are independent and can be parallelized (T006 with T008, T007 with T009).

### Parallel execution

- **T002 ↔ T001**: T002 depends on `PDFColorSet` and `hexToRgb` from T001, so they must be sequential
- **T006 ↔ T008**: Fully parallel (different controls in the same component)
- **T007 ↔ T009**: Fully parallel (different wiring logic in the same component)

---

## Implementation Strategy

### MVP (Phase 2 + Phase 3)

Deliverable: A "Personalizar PDF" button that opens a modal showing a live preview of the budget with default colors. No customization yet — just the preview infrastructure.

### Increment 1 (MVP + Phase 4 + Phase 5)

Full feature: color picker, logo position selector, and personalized PDF generation.

### Final (Phase 6)

Polish, edge cases, and verification.

---

## Summary

| Item | Count |
|------|-------|
| **Total tasks** | 15 |
| **Foundational** | 3 |
| **[US3] Preview Modal** | 2 |
| **[US1] Colors** | 2 |
| **[US2] Logo Position** | 2 |
| **Shared Layout Refactor** | 4 |
| **Polish** | 2 |
| **Parallelizable** | 4 (T002, T006, T008, T014, T015) |
