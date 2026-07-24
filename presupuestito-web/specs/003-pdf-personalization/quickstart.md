# Quickstart: PDF Personalization

## Prerequisites

- The app is running (`npm run dev`)
- A budget exists with at least one task or material
- User has a logo uploaded (optional — color picker works without it)

## Validation Scenarios

### Scenario 1: Color picker changes reflect in preview

1. Open a budget in "presupuestado" or "borrador" state
2. Click the "Personalizar PDF" button (next to "Descargar PDF")
3. The modal opens showing the budget preview with default colors (#3D8B6E)
4. Click the color picker and select a different color (e.g., #2563EB)
5. **Expected**: The preview header, footer, and text colors update instantly
6. Click "Cancelar"
7. **Expected**: Modal closes, no PDF was generated

### Scenario 2: Logo position changes

1. Open the personalization modal (same as above)
2. If no logo is uploaded → position controls are disabled with tooltip
3. If logo is uploaded → click "Derecha" position option
4. **Expected**: Logo in the preview shifts to the right side of the header
5. Toggle back to "Centro" → logo re-centers

### Scenario 3: Generate personalized PDF

1. Set a custom color and logo position
2. Click "Descargar"
3. **Expected**: A PDF is generated and opens in a new tab
4. **Expected**: The PDF header/footer use the selected color
5. **Expected**: The logo appears at the selected position
6. **Expected**: All other content (items, totals, observations) renders correctly

### Scenario 4: Backward compatibility (no params)

1. Call `generateBudgetPDF(data)` without params
2. **Expected**: PDF generates with default colors and centered logo (same behavior as before)

## Files to implement

| File | Purpose |
|------|---------|
| `src/lib/pdf/derivePDFColors.ts` | Color derivation utility |
| `src/lib/pdf/types.ts` | PDFParams type + defaults |
| `src/components/budgets/PDFPreviewModal.tsx` | Preview modal component |
| Modify: `src/lib/pdf/generate-budget.ts` | Accept PDFParams, use derived colors |
| Modify: budget view page | Add "Personalizar PDF" button, wire modal |

## Commands

```bash
# Run the app
npm run dev

# Type-check
npm run typecheck
```
