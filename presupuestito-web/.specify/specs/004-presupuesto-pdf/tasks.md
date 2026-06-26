# Tasks: Presupuesto PDF desde tareas

**Input**: Design documents from `/specs/004-presupuesto-pdf/`

**Prerequisites**: spec.md, plan.md, 003-trabajo-crud complete

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Adaptar hook de PDF

- [x] T001 [US1] Adaptar `src/hooks/use-budget-pdf.tsx` — cambiar interfaz de entrada: en vez de conceptos, recibir jobId. Buscar tareas del trabajo en el store, filtrar las que tienen precio, calcular total.
- [x] T001 [US1] La función downloadPDF debe recibir: jobId (string) y generar el PDF con los datos del trabajo y sus tareas.

---

## Phase 2: Adaptar template PDF

- [x] T002 [US1] Adaptar `src/lib/pdf/templates/afip-style.tsx` — recibir: datos del cliente (nombre, teléfono, email, dirección), título del trabajo, lista de tareas con descripción y precio, total, fecha.
- [x] T002 [US1] El template debe mostrar: encabezado empresa (de ajustes), datos cliente, tabla de tareas, subtotal, total, notas del trabajo si existen.
- [x] T002 [P] [US1] Asegurar que el template sea responsive (se vea bien en A4 y en móvil al descargar).

---

## Phase 3: Botón en UI

- [x] T003 [US1] Agregar botón "Generar Presupuesto" en `src/app/trabajos/[id]/page.tsx`. Visible solo si el trabajo tiene tareas con precio. Usa useBudgetPDF.
- [x] T003 [P] [US2] Agregar botón "Preview" al lado de "Generar Presupuesto". Abre el PDF en una nueva pestaña o modal.
- [x] T003 [US1] Deshabilitar botón si no hay tareas con precio. Mostrar tooltip "Agregá tareas con precio para generar el presupuesto".

---

## Phase 4: Limpieza

- [x] T004 [P] [US1] Eliminar `src/app/(dashboard)/presupuestos/nuevo/hooks/use-concept-logic.ts` (ya no existe Concept).
- [x] T004 [P] [US1] Eliminar `src/app/(dashboard)/presupuestos/nuevo/hooks/use-budget-identity.ts` (reemplazado por job form).
- [x] T004 [P] [US1] Eliminar `src/app/(dashboard)/presupuestos/nuevo/hooks/use-budget.ts` (reemplazado por store tasks).
- [x] T004 [P] [US1] Eliminar componentes de conceptos: `src/app/(dashboard)/presupuestos/nuevo/components/concepts/` (carpeta completa).
- [x] T004 [P] [US1] Eliminar `src/app/(dashboard)/presupuestos/nuevo/components/totals-summary.tsx`, `notes-field.tsx`, `identity/` (ya no existen como flujo separado).

---

## Dependencies

- Phase 1 → Phase 2 (template needs adapted hook)
- Phase 2 → Phase 3 (button needs working hook)
- Phase 4 after Phase 3

---

## Notes

- The existing use-budget-pdf.tsx already uses @react-pdf/renderer. The change is in the data source (tasks instead of concepts).
- Company data for the PDF header comes from ajustes/perfil (user-store.ts).
- The presupuestos/nuevo page is completely deleted — replaced by /trabajos/nuevo + "Generar Presupuesto" button.
- Also fixed all old field references (client.name → client.nombre, job.name → job.titulo, etc.) across clientes page, dashboard, and PDF templates.
- Deleted unused client components: client-row.tsx, client-expanded-view.tsx, client-search.tsx.
