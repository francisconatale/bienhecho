# Contract: PDF Personalization Parameters

## Purpose

Define the interface between the UI (preview modal) and the PDF generation engine (`generateBudgetPDF`).

## Interface: PDFParams

```typescript
interface PDFParams {
  primaryColor: string; // hex color, e.g. "#3D8B6E"
  logoScale: number; // 0.5 to 1.5, default 1.0
}
```

### Default values

```typescript
const DEFAULT_PDF_PARAMS: PDFParams = {
  primaryColor: "#3D8B6E",
  logoScale: 1,
};
```

## Interface: derivePDFColors

```typescript
type PDFColorSet = {
  primary: [number, number, number];      // RGB tuple for jsPDF
  onPrimary: [number, number, number];
  onSurface: [number, number, number];
  onSurfaceVariant: [number, number, number];
  outlineVariant: [number, number, number];
};

function derivePDFColors(hex: string): PDFColorSet
```

Consumes a hex string, returns the 5 RGB tuples that `generateBudgetPDF` currently hardcodes.

## Modified function signature

```typescript
// Before:
export async function generateBudgetPDF(data: PDFData): Promise<void>

// After:
export async function generateBudgetPDF(
  data: PDFData,
  params?: PDFParams
): Promise<void>
```

When `params` is undefined, fall back to `DEFAULT_PDF_PARAMS` (backward compatible).

## Utility: hexToRgb

```typescript
function hexToRgb(hex: string): [number, number, number] | null
```

Parses `#RRGGBB` or `#RGB` hex strings to RGB tuples (0-255). Returns null for invalid input.

## Preview component contract

```typescript
interface PDFPreviewProps {
  data: PDFData;
  params: PDFParams;
  onParamsChange: (params: PDFParams) => void;
  onDownload: () => void;
  onCancel: () => void;
}
```

The preview component receives budget data and current params, renders a visual approximation using HTML/CSS, and exposes change handlers.
