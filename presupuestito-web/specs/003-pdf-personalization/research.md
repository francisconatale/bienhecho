# Research: PDF Personalization

## RQ-1: Color Derivation Strategy

**Decision**: HSL-based color derivation with contrast enforcement

**Rationale**:
- The current colors in `generate-budget.ts` form a coherent family: primary (#3D8B6E) → onSurfaceVariant (#3D6048, darken ~30%) → onSurface (#1A3020, darken ~60%) → outlineVariant (#B5D0BC, lighten ~40%).
- Using HSL (Hue, Saturation, Lightness) manipulation is the simplest approach without external dependencies.
- A small utility function `derivePDFColors(hex: string)` will:
  1. Parse hex to HSL
  2. Derive onSurface: keep hue, reduce lightness by ~55%
  3. Derive onSurfaceVariant: keep hue, reduce lightness by ~30%
  4. Derive outlineVariant: keep hue, increase lightness by ~35%, reduce saturation
  5. Derive onPrimary: white if primary lightness < 60%, black otherwise (WCAG AA contrast)
  6. Return all 5 colors as RGB tuples ready for jsPDF

**Alternatives considered**:
- Manual color entry for all 5 fields → too complex UX, defeats the purpose
- Third-party lib (color, chroma-js) → unnecessary dependency for simple HSL math
- Fixed palette presets → limits customization

## RQ-2: Preview Component Placement

**Decision**: Modal overlay accessible from the budget view toolbar, next to the "Descargar PDF" button

**Rationale**:
- No routing changes needed (stays on the same page)
- Modal pattern is consistent with the existing app UX
- Contains: color picker, logo position selector, live preview panel
- Two actions: "Descargar" (generates PDF with params) and "Cancelar" (discards changes)
- Reuses existing budget data already loaded in the store → no extra data fetching

**Alternatives considered**:
- New route `/budgets/[id]/personalize` → unnecessary navigation, slower UX
- Side drawer → less visible, competes with the budget editing workflow
- Inline preview in the budget page → too much visual noise

## RQ-3: Logo Position Controls When No Logo

**Decision**: Show logo position controls as disabled with a tooltip "Subí un logo desde tu perfil para personalizar su posición"

**Rationale**:
- Keeps the UI stable (controls don't appear/disappear unexpectedly)
- Clear feedback on what's needed to enable the feature
- Uses existing disabled state patterns from the design system

**Alternatives considered**:
- Hide controls entirely → user might not know the option exists
- Show a banner/alert → intrusive for something the user may not care about

## Technology Choices

- **Color manipulation**: Vanilla JS with HSL conversion (no external lib)
- **Color picker UI**: Native `<input type="color">` or shadcn/ui color picker pattern
- **Preview rendering**: React component replicating PDF layout with Tailwind CSS
- **State**: React `useState` in the modal component, passed as params to PDF generator
