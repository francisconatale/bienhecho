# Data Model: PDF Personalization Parameters

This feature does not introduce new database tables. The personalization parameters exist only as **transient session state** (React component state), passed directly to `generateBudgetPDF` at generation time.

## PDFParams (TypeScript interface)

```typescript
interface PDFParams {
  /** Primary accent color in hex (e.g. "#3D8B6E") */
  primaryColor: string;
  
  /** Logo size multiplier (0.5 = half, 1.5 = 50% bigger) */
  logoScale: number;
}
```

### Derived colors (computed at runtime by utility function)

| Field | Derivation | Used in PDF |
|-------|-----------|-------------|
| `primary` | From `primaryColor` (parsed to RGB) | Header/footer background |
| `onPrimary` | White if primary luminance < 60%, else black | Text over header/footer |
| `onSurface` | HSL: primary hue, 35% lightness, 15% saturation | Main body text |
| `onSurfaceVariant` | HSL: primary hue, 50% lightness, 20% saturation | Secondary text, labels |
| `outlineVariant` | HSL: primary hue, 80% lightness, 25% saturation | Separators, table borders |

## State management (React)

```typescript
// Inside the preview modal component:
const [pdfParams, setPdfParams] = useState<PDFParams>({
  primaryColor: "#3D8B6E",
  logoScale: 1,
});
```

No Zustand store changes needed — state is local to the modal and discarded on close.

## Future: PDFPreferences entity

When persistence is added, a new table `pdf_preferences` would store:

| Field | Type | Default |
|-------|------|---------|
| `user_id` | uuid PK FK | — |
| `primary_color` | string (hex) | `#3D8B6E` |
| `logo_scale` | decimal (0.5–1.5) | `1.0` |
| `profile_name` | string | `"default"` (for multiple profiles) |
