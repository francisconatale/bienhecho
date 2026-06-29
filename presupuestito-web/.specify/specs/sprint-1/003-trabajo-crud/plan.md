# Implementation Plan: Trabajo detail + CRUD tareas

**Branch**: `003-trabajo-crud` | **Date**: 2026-06-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-trabajo-crud/spec.md`

## Summary

Build the job creation form, the job detail page with task CRUD, progress bar, status selector, and estimated total. This is the core screen of the app.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15 (App Router)

**Primary Dependencies**: React 19, Tailwind CSS v4, Zustand, lucide-react

**Storage**: Zustand (from 002-modelos-db)

**Project Type**: web-app

**Constraints**: No new dependencies. Mobile-first responsive.

## Constitution Check

- ✅ Principle I (Simplicity): Reusing existing patterns.
- ✅ Principle II (Data Integrity): Total calculated from tasks.
- ✅ Principle III (Tasks ≠ Visits): Tasks only, no visits.
- ✅ Principle V (Progressive Enhancement): Responsive web.

## Project Structure

```text
src/app/trabajos/
├── page.tsx                          # T004: Updated list
├── nuevo/
│   └── page.tsx                      # T001: New job form
└── [id]/
    ├── page.tsx                      # T002: Detail page
    └── components/
        ├── job-header.tsx            # T002: Header with data
        ├── job-status.tsx            # T002: Status selector
        ├── progress-bar.tsx          # T002: Progress bar
        ├── task-list.tsx             # T003: Task list + total
        ├── task-item.tsx             # T003: Task row
        └── task-form.tsx             # T003: Add/edit task form
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | — | — |
