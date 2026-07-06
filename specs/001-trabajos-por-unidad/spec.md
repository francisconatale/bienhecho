# Feature Specification: Trabajos por Unidad/Horas

**Feature Branch**: `[001-trabajos-por-unidad]`

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "vamos a en trabajos agregar trabajos por unidad/horas para que basicamente se tenga un desglose de los trabajos por ejemplo instalacion foco $ 1000 x 6 = 6000, analiza la estructura de ahora por que ya hay productos sin unidad, basicamente esos tendriamos que migrarlos y ponerlos por 1 unidad"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Agregar trabajos con cantidad y precio unitario (Priority: P1)

Como usuario, quiero poder agregar un trabajo especificando la cantidad (unidades u horas) y el precio unitario, para que el sistema calcule automáticamente el total (cantidad x precio unitario).

**Why this priority**: Es la funcionalidad principal solicitada para desglosar los trabajos.

**Independent Test**: Se puede probar creando un nuevo trabajo en un presupuesto, ingresando cantidad y precio, y verificando que el total sea correcto.

**Acceptance Scenarios**:

1. **Given** un presupuesto en edición, **When** agrego un trabajo con cantidad 6 y precio $1000, **Then** el trabajo se guarda con un total de $6000 y se muestra el desglose.
2. **Given** un trabajo existente con cantidad y precio, **When** modifico la cantidad o el precio, **Then** el total se recalcula automáticamente.

---

### User Story 2 - Migración de trabajos existentes sin unidad (Priority: P1)

Como usuario, quiero que los trabajos que ya existen en el sistema sin unidad especificada se migren automáticamente a tener 1 unidad, para mantener la consistencia de los datos.

**Why this priority**: Es necesario para que el sistema no falle con los datos antiguos y toda la estructura quede unificada.

**Independent Test**: Se puede probar verificando que un presupuesto antiguo con trabajos sin unidad ahora los muestre con cantidad "1" y precio unitario igual al total original.

**Acceptance Scenarios**:

1. **Given** un trabajo antiguo que solo tiene precio total de $5000, **When** se actualiza el sistema, **Then** el trabajo pasa a tener cantidad 1 y precio unitario $5000.

### Edge Cases

- What happens when la cantidad o el precio ingresados son 0 o negativos?
- How does system handle trabajos antiguos donde el importe total no era un número válido o estaba vacío?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir especificar una cantidad (numérica, incluyendo decimales) para cada trabajo dentro de un presupuesto.
- **FR-002**: El sistema MUST permitir especificar un precio unitario para cada trabajo.
- **FR-003**: El sistema MUST calcular el precio total del trabajo como `cantidad * precio unitario` de forma automática.
- **FR-004**: El sistema MUST mostrar el desglose (cantidad, precio unitario, total) en la interfaz de edición de presupuestos.
- **FR-005**: El sistema MUST ejecutar una migración de datos para que los trabajos existentes sin cantidad definida asuman una cantidad de `1` y un precio unitario igual al importe total histórico.
- **FR-006**: El sistema se mantendrá simple usando únicamente el campo numérico de "cantidad"; la unidad de medida (horas, unidades, etc.) quedará implícita en el título/descripción del trabajo.

### Key Entities *(include if feature involves data)*

- **Trabajo (Job / Concept)**: Debe incorporar los campos numéricos de cantidad y precio unitario, además del cálculo del total.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de los presupuestos antiguos se visualizan correctamente y sus trabajos muestran cantidad 1 y precio unitario consistente.
- **SC-002**: Los usuarios pueden crear un desglose de trabajos ingresando cantidad y precio unitario de forma fluida.

## Assumptions

- Se asume que el cambio aplica a la estructura de "conceptos" o "trabajos" dentro de un presupuesto.
- Se asume que el precio unitario y la cantidad pueden tener decimales (ej. 1.5 horas).
- Se asume que no se requiere crear un catálogo de trabajos predefinidos con sus unidades por defecto, sino que el ingreso es manual por ahora.
