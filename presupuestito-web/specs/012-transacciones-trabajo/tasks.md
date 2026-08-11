# Implementation Tasks: Desglose de Transacciones por Trabajo

**Branch**: `N/A` | **Date**: 2026-08-10

## 🏗️ Phase 1: Setup & Infrastructure
No se requieren tareas de setup adicionales. La base de datos y la arquitectura ya están configuradas.

## 🧱 Phase 2: Foundational
*Prerequisites that block all user stories.*
No se requieren tareas fundacionales.

## 🚀 Phase 3: Visualización de Transacciones (US1 & US2)
*Objetivo: Implementar la consulta y visualización de cargos, abonos y ajustes en el detalle del trabajo.*

- [x] T001 [US1] Crear la acción de servidor para consultar transacciones de un trabajo en `src/actions/transactions.actions.ts`
- [x] T002 [US1] Crear el hook `useTransactions` en `src/app/(dashboard)/trabajos/[id]/hooks/use-transactions.ts`
- [x] T003 [P] [US1] Crear el componente de línea de tiempo `TransactionsTimeline` en `src/app/(dashboard)/trabajos/[id]/components/transactions-timeline.tsx`
- [x] T004 [US1] Integrar el nuevo componente reemplazando la vista estática de cobros en `src/app/(dashboard)/trabajos/[id]/components/payments-dashboard.tsx`

## 💅 Phase 4: Polish & Cross-Cutting
- [x] T005 Revisar y ajustar el diseño responsive y los estados de carga en `src/app/(dashboard)/trabajos/[id]/components/payments-dashboard.tsx`

---

## 🔗 Dependencies & Execution Order
1. T001 y T003 pueden desarrollarse en paralelo (T003 puede usar datos mockeados inicialmente).
2. T002 depende de T001.
3. T004 depende de T002 y T003.
4. T005 depende de T004.

## 📦 MVP Scope
El MVP completo incluye de T001 a T005 para satisfacer las US1 y US2 al mismo tiempo, ya que los ajustes y cobros usan la misma estructura subyacente.
