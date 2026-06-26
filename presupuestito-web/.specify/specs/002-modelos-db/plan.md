# Implementation Plan: Redefinir types y refactorizar store

**Branch**: `002-modelos-db` | **Date**: 2026-06-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-modelos-db/spec.md`

## Summary

Replace all existing types (Client, Job, Concept, Budget) with DB-aligned types (Client, Job, Task). Refactor Zustand store to use new types, remove obsolete entities (projects, concepts, budgets). Update mock data.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Zustand

**Storage**: Zustand (in-memory)

**Project Type**: web-app

**Constraints**: No new dependencies. Types must match DB schema exactly.

## Constitution Check

- ✅ Principle I (Simplicity): Removing code, not adding.
- ✅ Principle II (Data Integrity): Types match DB.
- ✅ Principle III (Tasks ≠ Visits): Task type defined separately.

## Project Structure

```text
src/
├── types/
│   └── index.ts        # T001: New types
├── lib/
│   └── store.ts        # T002: Refactored store
│   └── trades.ts       # T003: Review (may reference old types)
└── mocks/
    └── index.ts        # T004: Updated mock data
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | — | — |
