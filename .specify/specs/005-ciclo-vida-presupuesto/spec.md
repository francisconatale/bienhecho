# Feature Specification: Ciclo de Vida del Presupuesto

**Feature Branch**: `007-ciclo-vida-presupuesto`

**Created**: 2026-06-28

**Status**: Draft

**Input**: User description: "Simplificar los estados de trabajo a borrador, presupuestado y pagado, donde pagado es terminal. Al generar un presupuesto PDF, preguntar si se desea emitir formalmente el presupuesto o solo guardar el PDF."

## User Scenarios & Testing

### User Story 1 - Trabajo arranca como borrador (Priority: P1)

Como usuario, cuando creo un trabajo nuevo, quiero que arranque como "borrador" para poder cargar tareas y ajustar detalles sin que el cliente reciba un presupuesto formal aún.

**Why this priority**: Es la base del nuevo modelo de estados. Sin esto no existe el concepto de "presupuesto formal".

**Independent Test**: Crear un trabajo nuevo desde cero y verificar que su estado inicial sea "borrador".

**Acceptance Scenarios**:

1. **Given** que estoy en la pantalla de nuevo trabajo, **When** completo el formulario y guardo, **Then** el trabajo aparece con estado "borrador"
2. **Given** un trabajo en estado "borrador", **When** veo su detalle, **Then** no se muestran acciones de emisión de presupuesto como ya realizadas (no hay PDF generado previamente)

---

### User Story 2 - Generar presupuesto con decisión post-PDF (Priority: P1)

Como usuario, cuando genero el presupuesto PDF de un trabajo, quiero que el sistema me pregunte si quiero emitir formalmente el presupuesto (pasar a "presupuestado") o solo guardar el PDF sin emitir.

**Why this priority**: Es el punto de inflexión donde el trabajo pasa de borrador a presupuestado, y donde se decide el siguiente paso comercial.

**Independent Test**: Generar un presupuesto PDF desde un trabajo en borrador y verificar que aparece un diálogo de decisión antes de cambiar el estado.

**Acceptance Scenarios**:

1. **Given** un trabajo en estado "borrador", **When** hago clic en "Generar presupuesto", **Then** se muestra un diálogo con dos opciones: "Emitir presupuesto" y "Solo guardar PDF"
2. **Given** el diálogo post-generación, **When** selecciono "Emitir presupuesto", **Then** el trabajo pasa a estado "presupuestado"
3. **Given** el diálogo post-generación, **When** selecciono "Solo guardar PDF", **Then** el PDF se descarga pero el trabajo permanece en "borrador"

---

### User Story 3 - Marcar trabajo como pagado (Priority: P1)

Como usuario, cuando el cliente paga el total del trabajo, quiero que el trabajo pase automáticamente a "pagado" sin que tenga que hacer nada extra, ya sea en un solo pago o en cuotas.

**Why this priority**: El estado terminal debe cerrarse solo cuando corresponde, sin fricción.

**Independent Test**: Registrar cobros hasta completar el total del trabajo y verificar que el estado cambia automáticamente a "pagado".

**Acceptance Scenarios**:

1. **Given** un trabajo en "presupuestado" con presupuesto de $1000, **When** registro un cobro único de $1000, **Then** el trabajo pasa automáticamente a "pagado"
2. **Given** un trabajo en "presupuestado" con presupuesto de $1000, **When** registro un cobro de $600 y luego otro de $400, **Then** al registrar el segundo cobro el trabajo pasa automáticamente a "pagado"
3. **Given** un trabajo en "presupuestado", **When** lo marco manualmente como "pagado" (sin que los cobros cubran el total), **Then** el estado cambia a "pagado" igualmente
4. **Given** un trabajo en estado "pagado", **When** intento modificarlo, **Then** el sistema muestra una advertencia de que es un trabajo cerrado

---

### User Story 4 - Cancelar diálogo sin emitir (Priority: P2)

Como usuario, si genero un PDF pero cierro el diálogo sin decidir, quiero que el trabajo no cambie de estado para no emitir un presupuesto por error.

**Why this priority**: Caso borde importante para evitar emisiones accidentales.

**Independent Test**: Cerrar el diálogo post-PDF sin seleccionar opción y verificar que el estado no cambió.

**Acceptance Scenarios**:

1. **Given** un trabajo en estado "borrador", **When** genero el PDF y cierro el diálogo sin elegir opción, **Then** el trabajo permanece en "borrador"

---



### Edge Cases

- ¿Qué pasa si un trabajo en "borrador" tiene tareas cargadas pero nunca se genera el presupuesto? — Sigue siendo borrador. El usuario puede dejarlo así indefinidamente.
- ¿Qué pasa si se intenta generar un presupuesto desde un trabajo ya "pagado"? — El sistema debe bloquear la acción con un mensaje claro: el trabajo está cerrado.
- ¿Qué pasa si hay cobros parciales que no cubren el total? — El trabajo sigue en "presupuestado".
- ¿Qué pasa si el usuario cierra el diálogo post-generación sin elegir opción? — El trabajo permanece en "borrador", el estado no cambia. El PDF ya se descargó pero no se emitió.

## Requirements

### Functional Requirements

- **FR-001**: El sistema DEBE asignar estado "borrador" a todo trabajo nuevo creado
- **FR-002**: El sistema DEBE permitir generar presupuesto PDF solo desde estados "borrador" o "presupuestado" (no desde "pagado")
- **FR-003**: El sistema DEBE mostrar un diálogo de decisión inmediatamente después de generar el PDF, con dos opciones: "Emitir presupuesto" y "Solo guardar PDF"
- **FR-004**: Si el usuario elige "Emitir presupuesto", el sistema DEBE cambiar el estado del trabajo a "presupuestado"
- **FR-005**: Si el usuario elige "Solo guardar PDF", el sistema DEBE descargar el PDF pero el trabajo DEBE permanecer en "borrador"
- **FR-006**: El sistema DEBE permitir marcar un trabajo como "pagado" manualmente desde la vista de detalle
- **FR-007**: El sistema DEBE pasar automáticamente el trabajo a "pagado" cuando la suma de cobros registrados sea mayor o igual al total del trabajo (presupuesto + materiales)
- **FR-008**: El sistema DEBE mostrar un trabajo en estado "pagado" visualmente como cerrado y advertir al intentar editarlo
- **FR-009**: Si el usuario cierra el diálogo post-generación sin seleccionar una opción, el estado NO DEBE cambiar (permanece en "borrador")

### Key Entities

- **Trabajo**: Entidad principal. Tiene un estado que determina su ciclo de vida comercial. Estados: `borrador`, `presupuestado`, `pagado`.
- **Cobro**: Registro de pago recibido. La suma de sus montos determina si se sugiere el estado "pagado".
_(No hay nuevas entidades. Solo cambia el modelo de estados del trabajo.)_

## Success Criteria

### Measurable Outcomes

- **SC-001**: Un usuario puede crear un trabajo, cargarle tareas, generar el presupuesto PDF, cobrar al cliente total o parcialmente, y el trabajo se cierra solo cuando el total está cubierto.
- **SC-002**: El diálogo post-generación de presupuesto permite al usuario decidir entre emitir o guardar en menos de 10 segundos.
- **SC-004**: Un trabajo marcado como "pagado" no puede ser modificado sin una advertencia explícita, reduciendo el riesgo de errores en facturación.

## Assumptions

- Los estados operativos internos (progreso de tareas, visitas, materiales) siguen existiendo aunque el estado comercial se simplifique a 3 valores.
- El diálogo post-generación es solo para decidir entre emitir o no. La agenda del empleador (organizar visitas) queda para otro scope.

- El diálogo post-generación se muestra después de que el PDF se ha generado exitosamente.
- La Constitución del proyecto fue enmendada para reflejar el nuevo modelo de 3 estados (Principio II, v1.2.0).
