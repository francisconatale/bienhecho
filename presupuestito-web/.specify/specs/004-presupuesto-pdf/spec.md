# Feature Specification: Presupuesto PDF desde tareas

**Feature Branch**: `004-presupuesto-pdf`

**Created**: 2026-06-25

**Status**: Draft

**Input**: "Generar un PDF de presupuesto a partir de las tareas de un trabajo."

**Depends on**: 003-trabajo-crud (tasks must exist in a job first)

## User Scenarios & Testing

### User Story 1 - Generar presupuesto PDF (Priority: P1)

El usuario genera un PDF con las tareas del trabajo para enviar al cliente.

**Why this priority**: Core del flujo simple. Sin esto no se puede cobrar.

**Independent Test**: Se puede abrir un trabajo con tareas, hacer clic en "Generar Presupuesto", y descargar un PDF con las tareas y el total.

**Acceptance Scenarios**:

1. **Given** un trabajo con al menos 1 tarea con precio, **When** hace clic en "Generar Presupuesto", **Then** se genera un PDF.
2. **Given** el PDF generado, **When** se descarga, **Then** contiene: nombre del cliente, dirección, teléfono, título del trabajo, lista de tareas con precio, subtotal, total, fecha de generación.
3. **Given** un trabajo sin tareas con precio, **When** ve el detalle, **Then** el botón "Generar Presupuesto" está deshabilitado.

---

### User Story 2 - Preview del presupuesto (Priority: P2)

El usuario puede ver una preview del presupuesto antes de descargar.

**Why this priority**: Evitar errores al enviar al cliente.

**Independent Test**: Se puede hacer clic en "Preview" y ver el PDF en pantalla antes de descargar.

**Acceptance Scenarios**:

1. **Given** un trabajo con tareas, **When** hace clic en "Preview", **Then** se abre una vista previa del PDF.
2. **Given** la preview, **When** cierra, **Then** vuelve al detalle del trabajo.

---

### Edge Cases

- ¿Qué pasa si el trabajo no tiene tareas con precio? → Botón deshabilitado, mostrar mensaje.
- ¿Qué pasa si el cliente no tiene teléfono o email? → Se omite en el PDF, no se rompe.
- ¿Qué pasa si el presupuesto del trabajo es 0? → Se calcula desde las tareas, ignora el campo presupuesto del trabajo.

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST generate a PDF with: client data, job title, task list with prices, subtotal, total, date.
- **FR-002**: System MUST only include tasks where precio IS NOT NULL in the PDF.
- **FR-003**: System MUST calculate total = sum of task prices.
- **FR-004**: System MUST disable the generate button when no billable tasks exist.
- **FR-005**: System MUST use existing @react-pdf/renderer dependency.
- **FR-006**: PDF template MUST show company branding (logo, name from settings).

---

## Success Criteria

- **SC-001**: PDF downloads in under 2 seconds.
- **SC-002**: PDF contains all billable tasks with correct prices and total.
- **SC-003**: PDF is formatted professionally (company name, client data, clean layout).

---

## Assumptions

- 003-trabajo-crud is complete (tasks exist in jobs).
- @react-pdf/renderer is already installed.
- afip-style.tsx template exists and will be adapted.
- Company data (name, logo) comes from ajustes/perfil.
