# Feature Specification: Redefinir types y refactorizar store

**Feature Branch**: `002-modelos-db`

**Created**: 2026-06-25

**Status**: Draft

**Input**: "Alinear los tipos TypeScript y el store Zustand con el esquema de PostgreSQL."

## User Scenarios & Testing

### User Story 1 - Types alineados con DB (Priority: P1)

Los tipos Client, Job y Task reflejan exactamente la estructura de las tablas en la DB.

**Why this priority**: Sin types correctos nada más funciona bien.

**Independent Test**: Los types compilan sin errores y sus campos coinciden 1:1 con `01-estructura-base-de-datos.md`.

**Acceptance Scenarios**:

1. **Given** los types definidos, **When** se compila el proyecto, **Then** no hay errores de tipo.
2. **Given** el type Client, **When** se compara con la tabla `clientes`, **Then** tiene los mismos campos (nombre, telefono, email, direccion, notas, created_at).

---

### User Story 2 - Store refactorizado (Priority: P1)

El store de Zustand usa los nuevos types y no tiene entidades obsoletas (projects, concepts, budgets).

**Why this priority**: El store es la fuente de datos. Si está mal, todo lo demás falla.

**Independent Test**: El store crea, edita y elimina clientes y trabajos con los nuevos campos. No hay referencias a projects o concepts.

**Acceptance Scenarios**:

1. **Given** el store, **When** se agrega un cliente, **Then** tiene: nombre, telefono, email, direccion, notas.
2. **Given** el store, **When** se agrega un trabajo, **Then** tiene: cliente_id, titulo, direccion, presupuesto, estado, fechas.
3. **Given** el store, **When** se busca `projects` o `concepts`, **Then** no existen.

---

### Edge Cases

- ¿Qué pasa si algún componente todavía usa los tipos viejos? → Se rompe en compilación (eso es bueno, revela el código muerto).

---

## Requirements

### Functional Requirements

- **FR-001**: Types MUST match DB schema from `01-estructura-base-de-datos.md` exactly.
- **FR-002**: Store MUST support CRUD for Client and Job with new fields.
- **FR-003**: Store MUST include `tasks: Task[]` with addTask, updateTask, removeTask.
- **FR-004**: Store MUST NOT contain `projects`, `works`, `budgets`, or `concepts`.
- **FR-005**: JobStatus MUST be: 'presupuestado' | 'en_curso' | 'listo_para_facturar' | 'facturado' | 'cobrado'.

### Key Entities

- **Client**: nombre, telefono, email, direccion, notas
- **Job**: titulo, direccion, presupuesto, estado, fechas
- **Task**: descripcion, precio, completada, orden

---

## Success Criteria

- **SC-001**: TypeScript compila sin errores.
- **SC-002**: Store permite crear un cliente con todos los campos de la DB.
- **SC-003**: Store permite crear un trabajo con los 5 estados posibles.
- **SC-004**: Store permite agregar, editar y eliminar tareas dentro de un trabajo.

---

## Assumptions

- No database yet — data in Zustand only.
- Mock data will be updated to use new types.
- Components that break will be fixed in subsequent features (003, 004).
