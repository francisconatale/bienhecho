# Feature Specification: Trabajo detail + CRUD tareas

**Feature Branch**: `003-trabajo-crud`

**Created**: 2026-06-25

**Status**: Draft

**Input**: "Implementar la vista de detalle de trabajo con CRUD completo de tareas."

**Depends on**: 002-modelos-db (types and store must be aligned first)

## User Scenarios & Testing

### User Story 1 - Crear trabajo (Priority: P1)

El usuario crea un trabajo nuevo asociado a un cliente existente.

**Why this priority**: No hay flujo sin poder crear trabajos.

**Independent Test**: Se puede ir a /trabajos/nuevo, seleccionar cliente, poner título y dirección, guardar. El trabajo aparece en la lista.

**Acceptance Scenarios**:

1. **Given** el usuario en la lista de trabajos, **When** hace clic en "Nuevo Trabajo", **Then** ve un formulario con: selector de cliente, título, dirección, descripción (opcional), presupuesto, fecha inicio, fecha fin estimada.
2. **Given** el formulario completo, **When** guarda, **Then** el trabajo se crea con estado `presupuestado` y aparece en la lista.
3. **Given** el formulario incompleto (sin título o cliente), **When** intenta guardar, **Then** el botón está deshabilitado.

---

### User Story 2 - Ver detalle de trabajo (Priority: P1)

El usuario abre un trabajo y ve toda su información: header, estado, progreso, tareas.

**Why this priority**: La pantalla principal de la app.

**Independent Test**: Se puede hacer clic en un trabajo de la lista y ver header con cliente, título, dirección, presupuesto, estado, fechas, barra de progreso y lista de tareas.

**Acceptance Scenarios**:

1. **Given** la lista de trabajos, **When** hace clic en uno, **Then** ve la página de detalle.
2. **Given** la página de detalle, **When** carga, **Then** muestra: título, cliente, dirección, presupuesto, estado con badge de color, fechas, barra de progreso, total estimado.
3. **Given** un trabajo sin tareas, **When** carga el detalle, **Then** la barra de progreso muestra 0% y dice "Sin tareas aún".

---

### User Story 3 - Agregar tarea (Priority: P1)

El usuario agrega una tarea a un trabajo con descripción y precio opcional.

**Why this priority**: Sin tareas no hay presupuesto ni factura.

**Independent Test**: Se puede hacer clic en "Agregar tarea", poner descripción y precio, guardar. La tarea aparece en la lista y el total se actualiza.

**Acceptance Scenarios**:

1. **Given** la página de detalle, **When** hace clic en "Agregar tarea", **Then** aparece un formulario inline con descripción y precio.
2. **Given** el formulario con descripción y precio, **When** guarda, **Then** la tarea aparece en la lista ordenada y el total estimado se recalcula.
3. **Given** una tarea sin precio, **When** se guarda, **Then** aparece en la lista pero no se suma al total.

---

### User Story 4 - Editar tarea (Priority: P2)

El usuario edita la descripción o precio de una tarea existente.

**Why this priority**: Los datos cambian, se cometen errores.

**Independent Test**: Se puede editar el precio de una tarea y ver el total actualizado.

**Acceptance Scenarios**:

1. **Given** una tarea existente, **When** hace clic en editar, **Then** abre el formulario con los datos actuales.
2. **Given** el formulario de edición, **When** cambia el precio y guarda, **Then** el total se recalcula.

---

### User Story 5 - Eliminar tarea (Priority: P2)

El usuario elimina una tarea de un trabajo.

**Why this priority**: Flexibilidad en la edición.

**Independent Test**: Se puede eliminar una tarea y ya no aparece. El total baja.

**Acceptance Scenarios**:

1. **Given** una tarea existente, **When** la elimina con confirmación, **Then** desaparece de la lista.
2. **Given** la tarea eliminada, **When** se calcula el total, **Then** ya no se incluye.

---

### User Story 6 - Marcar tarea completada (Priority: P2)

El usuario marca/desmarca una tarea como completada.

**Why this priority**: Drive progress tracking.

**Independent Test**: Se puede hacer clic en el checkbox de una tarea y la barra de progreso cambia.

**Acceptance Scenarios**:

1. **Given** una tarea pendiente, **When** marca el checkbox, **Then** la tarea se marca como completada.
2. **Given** tareas completadas, **When** se calcula el progreso, **Then** la barra refleja el porcentaje correcto.

---

### User Story 7 - Cambiar estado del trabajo (Priority: P2)

El usuario cambia el estado de un trabajo manualmente.

**Why this priority**: Estados = flujo de negocio.

**Independent Test**: Se puede cambiar el estado de "presupuestado" a "en_curso" y el badge de color cambia.

**Acceptance Scenarios**:

1. **Given** un trabajo en `presupuestado`, **When** cambia el estado a `en_curso`, **Then** el badge cambia a color primario.
2. **Given** un trabajo, **When** intenta ir hacia atrás en el flujo, **Then** necesita confirmación.

---

### User Story 8 - Editar trabajo (Priority: P3)

El usuario edita los datos de un trabajo existente.

**Why this priority**: Los datos cambian durante la vida del trabajo.

**Independent Test**: Se puede cambiar el título y guardar.

**Acceptance Scenarios**:

1. **Given** un trabajo existente, **When** edita el título, **Then** el cambio se guarda.

---

### Edge Cases

- ¿Qué pasa si se elimina un trabajo que tiene tareas? → Se eliminan en cascada.
- ¿Qué pasa si se crea un trabajo sin tareas? → Se guarda, progreso 0%.
- ¿Qué pasa si se intenta cambiar a `facturado` directamente desde `presupuestado`? → Confirmación requerida.

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow creating a job with: cliente (selector), titulo, direccion, descripcion, presupuesto, fecha_inicio, fecha_fin_estimada.
- **FR-002**: System MUST create jobs in state `presupuestado` by default.
- **FR-003**: System MUST allow CRUD of tasks within a job: descripcion, precio (nullable), completada, orden.
- **FR-004**: System MUST calculate total estimado = sum of tasks where precio IS NOT NULL.
- **FR-005**: System MUST show progress bar = tasks completed / total tasks.
- **FR-006**: System MUST allow changing job state with confirmation for backward transitions.
- **FR-007**: System MUST delete tasks in cascade when job is deleted.

---

## Success Criteria

- **SC-001**: User can create a job in under 30 seconds.
- **SC-002**: User can add 5 tasks and see correct total in under 1 minute.
- **SC-003**: Progress bar updates immediately when task is completed.
- **SC-004**: Job states display with correct color badges.

---

## Assumptions

- 002-modelos-db is complete (types and store ready).
- No visitas in this feature (future).
- Client list already works (existing /clientes page).
