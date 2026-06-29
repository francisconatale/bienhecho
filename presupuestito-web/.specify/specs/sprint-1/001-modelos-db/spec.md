# Feature Specification: Alineación de modelos con DB + Flujo core

**Feature Branch**: `001-modelos-db`

**Created**: 2026-06-25

**Status**: Draft

**Input**: "Alinear los tipos y store con el esquema de DB, implementar CRUD de tareas y adaptar el flujo de presupuesto."

## User Scenarios & Testing

### User Story 1 - Crear trabajo con tareas (Priority: P1)

El usuario crea un trabajo asociado a un cliente, le agrega tareas con precios, y ve el total estimado.

**Why this priority**: Es el flujo mínimo indispensable. Sin esto no hay ni presupuesto ni factura.

**Independent Test**: Se puede crear un cliente, crear un trabajo para ese cliente, agregar 3 tareas con precio, y ver el total correcto.

**Acceptance Scenarios**:

1. **Given** el usuario está en la lista de trabajos, **When** hace clic en "Nuevo Trabajo", **Then** puede seleccionar cliente, poner título, dirección, descripción, presupuesto y fechas.
2. **Given** un trabajo creado, **When** agrega una tarea con descripción y precio, **Then** la tarea aparece en la lista y el total se actualiza.
3. **Given** un trabajo con tareas, **When** marca una tarea como completada, **Then** el checkbox se actualiza y la barra de progreso cambia.

---

### User Story 2 - Generar presupuesto PDF (Priority: P1)

El usuario genera un PDF con las tareas del trabajo para enviar al cliente.

**Why this priority**: Core del flujo simple. El usuario necesita enviar presupuestos para cobrar.

**Independent Test**: Se puede abrir un trabajo, hacer clic en "Generar Presupuesto", y descargar un PDF con las tareas y el total.

**Acceptance Scenarios**:

1. **Given** un trabajo con tareas que tienen precio, **When** el usuario hace clic en "Generar Presupuesto", **Then** se genera un PDF con cada tarea como línea y el total.
2. **Given** el PDF generado, **When** se descarga, **Then** contiene: nombre del cliente, título del trabajo, lista de tareas con precio, total, y fecha.

---

### User Story 3 - Editar y eliminar tareas (Priority: P2)

El usuario puede modificar tareas existentes: cambiar descripción, precio, orden, o eliminarlas.

**Why this priority**: El flujo de creación no sirve si no se puede corregir.

**Independent Test**: Se puede editar el precio de una tarea y ver el total actualizado. Se puede eliminar una tarea y ya no aparece.

**Acceptance Scenarios**:

1. **Given** una tarea existente, **When** el usuario edita el precio, **Then** el total del trabajo se recalcula.
2. **Given** una tarea existente, **When** el usuario la elimina, **Then** desaparece de la lista y el total baja.

---

### User Story 4 - Cambiar estado del trabajo (Priority: P2)

El usuario puede cambiar el estado de un trabajo manualmente (presupuestado → en_curso → listo_para_facturar → facturado → cobrado).

**Why this priority**: Sin estados no hay flujo de negocio.

**Independent Test**: Se puede cambiar el estado de "presupuestado" a "en_curso" y el trabajo aparece como activo.

**Acceptance Scenarios**:

1. **Given** un trabajo en estado `presupuestado`, **When** el usuario cambia el estado a `en_curso`, **Then** el trabajo aparece como activo en el dashboard.
2. **Given** un trabajo en estado `listo_para_facturar`, **When** el usuario genera la factura, **Then** el estado cambia a `facturado`.

---

### User Story 5 - Editar trabajo (Priority: P3)

El usuario puede editar los datos de un trabajo existente (título, dirección, descripción, presupuesto, fechas).

**Why this priority**: Los datos cambian durante la vida del trabajo.

**Independent Test**: Se puede cambiar el título de un trabajo y guardar los cambios.

**Acceptance Scenarios**:

1. **Given** un trabajo existente, **When** el usuario edita el título, **Then** el cambio se guarda y se refleja en la lista.

---

### Edge Cases

- ¿Qué pasa si el usuario crea un trabajo sin tareas? → Debería poder guardarlo, pero no generar presupuesto.
- ¿Qué pasa si intenta generar presupuesto sin tareas con precio? → Botón deshabilitado.
- ¿Qué pasa si cambia el estado a `facturado` sin generar factura? → Debería requerir confirmación.

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow creating a job linked to a client with: título, dirección, descripción, presupuesto, estado, fecha_inicio, fecha_fin_estimada.
- **FR-002**: System MUST allow CRUD of tasks within a job: descripción, precio (nullable), completada, orden.
- **FR-003**: System MUST calculate total estimated = sum of tasks where precio IS NOT NULL.
- **FR-004**: System MUST show progress bar = tasks completed / total tasks.
- **FR-005**: System MUST allow changing job state through the defined flow.
- **FR-006**: System MUST generate a PDF budget from a job's tasks with precio.
- **FR-007**: System MUST NOT force visitas — they are optional for a later phase.

### Key Entities

- **Cliente**: contact data (nombre, telefono, email, direccion, notas)
- **Trabajo**: project unit (titulo, dirección, presupuesto, estado, fechas) linked to a cliente
- **Tarea**: billable item within a trabajo (descripcion, precio, completada, orden)

---

## Success Criteria

- **SC-001**: User can create a job with 3 tasks and see the correct total in under 2 minutes.
- **SC-002**: PDF budget contains all tasks with prices and correct total.
- **SC-003**: Job states follow the defined flow without backward transitions without confirmation.
- **SC-004**: Progress bar accurately reflects task completion percentage.

---

## Assumptions

- No database yet — data lives in Zustand store (in-memory).
- PDF generation already exists (`@react-pdf/renderer`) and will be adapted.
- No auth needed for MVP — single user.
- Visitas are explicitly out of scope for this feature.
