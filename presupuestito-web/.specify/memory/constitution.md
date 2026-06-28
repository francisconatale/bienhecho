<!--
  Sync Impact Report
  Version change: 1.1.0 → 1.2.0
  Modified sections: Principle II (3-state machine replaced 5-state machine)
  Added sections: N/A
  Removed sections: N/A
  Templates requiring updates: ✅ plan-template.md (no changes needed)
    ✅ spec-template.md (no changes needed)
    ✅ tasks-template.md (no changes needed)
  Follow-up TODOs: none
-->

# Presupuestito Constitution

## Core Principles

### I. Simplicity First (MVP Scope)

Presupuestito is a tool for a single freelancer or small employer.
Every feature MUST justify its existence against real daily workflow needs.
No ERP complexity. No multi-tenant abstractions. No premature optimization.

- New features MUST start as the simplest possible implementation.
- YAGNI applies: do not build for hypothetical future users or edge cases
  that the product docs do not explicitly list.
- If a feature is listed under "Ideas para versiones futuras" in
  `02-ideas-producto.md`, it MUST NOT be implemented in the MVP.
- Complexity MUST be justified in writing before adding abstractions,
  patterns, or infrastructure beyond what the MVP plan requires.

**Rationale**: The target user is a single worker who needs to manage
jobs and invoices from their phone or laptop. Simplicity is the product.

### II. Data Integrity for Financial Records

Presupuestito handles budgets, task pricing, and invoices.
Financial accuracy is non-negotiable.

- All monetary values MUST use `decimal` (Prisma `Decimal`) — never
  floating point for calculations or storage.
- Invoice generation MUST reflect the exact task prices at the time
  of generation. Retroactive price changes MUST NOT alter existing
  invoices.
- The workflow state machine for `trabajos.estado` MUST be respected:
  `borrador → presupuestado → pagado`. `pagado` is the terminal state.
  Backward transitions (e.g., from `pagado` back to `presupuestado`) MUST
  require explicit user confirmation.
- UUIDs are the primary key type for all tables (per `01-estructura-base-de-datos.md`).

**Rationale**: Incorrect invoices or lost financial data destroy user
trust. Correctness over speed.

### III. Separation of Concerns: Tasks vs Visits

The distinction between tareas (billable items) and visitas (field records)
is the core architectural decision of this system (stated in
`02-ideas-producto.md` as "la decisión de diseño más importante").

- **Tareas** belong to a `trabajo`. They are the lines of a future
  invoice. They have an optional `precio`. Their `completada` status
  drives progress and invoice readiness.
- **Visitas** belong to a `trabajo`. They are internal field records
  with timestamps and notes. They MUST NOT appear on invoices.
- The `visita_tareas` junction table connects visits to tasks for
  progress tracking only — it MUST NOT influence billing logic.
- No feature may conflate these two concepts. A visit does not
  complete a task; a task does not record a visit.

**Rationale**: Merging these concepts would create confusion between
what gets billed and what was done on-site. The separation keeps
invoicing clean and field tracking flexible.

### IV. Type Safety at Boundaries

All user input and external data MUST be validated before entering
the system. TypeScript strict mode and Zod schemas enforce this.

- All API routes MUST validate request bodies with Zod before
  processing. No `any` types in API handlers.
- Form inputs MUST use react-hook-form + zod for validation
  (established pattern in the codebase).
- Prisma client provides the data layer boundary — raw SQL MUST NOT
  bypass the schema without explicit justification documented in
  the plan.
- Environment variables MUST be validated at startup (e.g., using
  `@t3-oss/env-nextjs` or similar).

**Rationale**: Runtime errors on user input erode trust. Catching
errors at boundaries prevents cascading failures.

### V. Progressive Enhancement

The app MUST work as a responsive web application first.
Native mobile and advanced features are secondary.

- All screens MUST be usable on mobile via responsive Tailwind CSS.
  No separate mobile app in MVP.
- Core functionality (CRUD, invoicing) MUST work without JavaScript
  enhancements where practical.
- PDF export, notifications, and photo attachments are explicitly
  deferred per `02-ideas-producto.md`. They MUST NOT block core
  feature delivery.
- Dark mode is a nice-to-have. Light mode is the primary experience.
  If dark mode is implemented, it MUST use the existing MD3 token
  system (not ad-hoc overrides).

**Rationale**: The user works from the field on their phone and at a
desk on their laptop. Responsive web covers both without native app
complexity.

## Technology Stack

The following stack is locked for the MVP per `03-mvp-tareas.md`:

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js (App Router) | SSR/SSG, React ecosystem, Vercel deploy |
| Styling | Tailwind CSS v4 + MD3 tokens | Existing token system in `globals.css` |
| Database | PostgreSQL (Supabase or Railway) | Relational integrity, UUID PKs, Prisma support |
| ORM | Prisma | Type-safe queries, migration system |
| Auth | Supabase Auth or NextAuth | Single-user for now; Supabase preferred if using Supabase DB |
| State | Zustand (client), React Server Components (server) | Lightweight, existing pattern in codebase |
| Forms | react-hook-form + Zod | Established pattern in the project |
| PDF | @react-pdf/renderer | Already a dependency; used in existing PDF templates |
| Deploy | Vercel | Zero-config Next.js hosting |
| Icons | lucide-react | Existing dependency |

Stack changes MUST be documented in this constitution before adoption.
No new runtime dependencies without explicit rationale.

## Development Workflow

- **Phased delivery**: Follow the 7-phase MVP plan in `03-mvp-tareas.md`.
  Phases 1-2 (base + trabajo detail) are blocking. Phases 3-7 can
  be reordered by priority. Phase 3 (visitas) is optional for users
  who don't need field tracking.
- **Dual flow**: The app supports two user types:
  - **Type A (simple)**: create client → create job → add tasks → generate budget PDF → generate invoice → done.
  - **Type B (full)**: same as Type A plus visitas, agenda, and progress tracking.
  Visitas are never mandatory. The app MUST work without them.
- **Definition of done**: The MVP is complete when the simple flow works:
  create client → create job with tasks → generate budget PDF → generate
  invoice PDF. The full flow (with visitas) is complete when visitas
  and progress tracking also work.
- **Commit discipline**: One logical unit per commit. Message format:
  `type(scope): description` (e.g., `feat(trabajos): add CRUD`, `fix(invoice): correct decimal rounding`).
- **No feature flags in MVP**: Features are either implemented or not.
  Feature flags add complexity that violates Principle I.
- **Error handling**: Every API route MUST return structured error
  responses. Every form MUST show validation errors inline. Empty states
  MUST have helpful messaging (per Phase 6 of MVP plan).

## Governance

This constitution is the authoritative reference for architectural
decisions in the Presupuestito project. All implementation plans and
specifications MUST comply with these principles.

- **Amendments**: Any change to this constitution MUST be documented
  with a version bump, rationale, and the date of amendment.
- **Versioning**: MAJOR for principle removals/redefinitions, MINOR
  for new principles/sections, PATCH for clarifications.
- **Compliance**: Plans generated by `/speckit.plan` MUST pass the
  Constitution Check gate before implementation begins. Violations
  MUST be justified in the Complexity Tracking table.
- **Supremacy**: When this constitution conflicts with any other
  project document, this constitution takes precedence.

**Version**: 1.2.0 | **Ratified**: 2026-06-25 | **Last Amended**: 2026-06-28
