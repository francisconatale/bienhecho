# Data Model

## Supabase Storage

### Bucket: `company-logos`

- **Type**: Public
- **Constraints**:
  - Max file size: 2MB
  - Allowed MIME types: `image/png`, `image/jpeg`, `image/jpg`
- **Path structure**: `[company_id]/[timestamp_or_uuid].[ext]` (e.g., `12345/1690001234.png`)
  - Saving the file with a unique name ensures cache busting when replacing the logo.

## Supabase Database

### Table: `companies` (or equivalent company profile table)

| Field | Type | Description |
|-------|------|-------------|
| `logo_path` | `varchar` (nullable) | The path in the `company-logos` bucket where the current logo is stored. Example: `12345/1690001234.png`. Null if no logo is uploaded. |

## Validation Rules (Zod)

### Logo Upload Form Schema

```typescript
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const logoSchema = z.object({
  logo: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `El archivo debe pesar como máximo 2MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Solo se permiten formatos .jpg, .jpeg, y .png."
    )
    .optional(),
});
```
