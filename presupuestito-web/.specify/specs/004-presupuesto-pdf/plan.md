# Implementation Plan: Presupuesto PDF desde tareas

**Branch**: `004-presupuesto-pdf` | **Date**: 2026-06-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-presupuesto-pdf/spec.md`

## Summary

Adapt the existing PDF generation (use-budget-pdf, afip-style template) to work with tasks from a job instead of concepts from a budget. Add a "Generar Presupuesto" button in the job detail page.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: @react-pdf/renderer (existing)

**Storage**: Zustand (from 002, tasks from 003)

**Constraints**: No new dependencies. Reuse existing PDF infrastructure.

## Constitution Check

- ✅ Principle I (Simplicity): Adapting existing code, not rewriting.
- ✅ Principle II (Data Integrity): Total calculated from task prices.
- ✅ Principle III (Tasks ≠ Visits): PDF shows tasks only.

## Project Structure

```text
src/
├── hooks/
│   └── use-budget-pdf.tsx          # T001: Adapt to use tasks
├── lib/pdf/templates/
│   └── afip-style.tsx              # T002: Adapt template
└── app/trabajos/[id]/
    └── page.tsx                    # T003: Add "Generar Presupuesto" button
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | — | — |
