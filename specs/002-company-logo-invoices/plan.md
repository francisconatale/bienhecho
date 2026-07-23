# Implementation Plan: Company Logo on Invoices

**Branch**: `[002-company-logo-invoices]` | **Date**: 2026-07-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-company-logo-invoices/spec.md`

## Summary

Add the ability for companies to upload a logo (max 2MB image) using Supabase Storage buckets, associate it with their company profile, and dynamically display this logo on all generated invoices (historical and new).

## Technical Context

**Language/Version**: TypeScript (strict)

**Primary Dependencies**: Next.js (App Router), Supabase (supabase-js), React Hook Form, Zod, Lucide React

**Storage**: Supabase Storage (Buckets) for image files, Supabase Database for Company Profile

**Testing**: N/A (assuming manual testing if no framework specified)

**Target Platform**: Web Browser

**Project Type**: Web Application

**Performance Goals**: Fast image loading using Next.js `next/image` optimization

**Constraints**: Max 2MB file size limit for image uploads.

**Scale/Scope**: 1 logo per company profile.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Architecture: Uses Next.js App Router and Feature-Based component placement.
- State: Uses React Hook Form + Zod for upload form validation.
- Design: Uses Tailwind CSS v4 and Lucide icons.
- Custom Hooks: Business logic for uploading to Supabase will be extracted to a custom hook.

No violations.

## Project Structure

### Documentation (this feature)

```text
specs/002-company-logo-invoices/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (dashboard)/
│   │   ├── configuracion/
│   │   │   ├── page.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-logo-upload.ts
│   │   │   └── components/
│   │   │       └── logo-uploader.tsx
│   │   └── facturas/
│   │       └── components/
│   │           └── invoice-document.tsx
```

**Structure Decision**: Using the existing Next.js App Router structure with feature-based components as mandated by GEMINI.md. `use-logo-upload.ts` will handle the Supabase logic.
