# Feature Specification: PDF Personalization

**Feature Branch**: `[003-pdf-personalization]`

**Created**: 2026-07-23

**Status**: Draft

**Input**: User description: "parametrizar colores del PDF (color picker) y posición del logo, con preview en runtime sin necesidad de guardar los valores; a futuro considerar guardar preferencias/perfiles"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Customize PDF Colors (Priority: P1)

Como usuario, quiero poder elegir el color principal del presupuesto PDF mediante un color picker, para que el documento refleje la identidad visual de mi empresa.

**Why this priority**: Sin un color personalizable, todos los PDFs se ven iguales. Es la personalización más visible.

**Independent Test**: Se puede probar seleccionando un color en el picker y verificando que el preview del presupuesto (o el PDF generado) aplique correctamente ese color en header, footer y textos asociados.

**Acceptance Scenarios**:

1. **Given** que estoy en la pantalla de personalización de PDF, **When** selecciono un color en el color picker, **Then** el preview se actualiza instantáneamente con el nuevo color aplicado.
2. **Given** que tengo un color personalizado seleccionado, **When** genero el PDF, **Then** el documento usa ese color en header, footer y total.
3. **Given** que cambio el color varias veces, **When** el preview se actualiza, **Then** cada cambio se refleja sin demora perceptible.

---

### User Story 2 - Adjust Logo Position (Priority: P1)

Como usuario, quiero poder elegir la posición del logo en el encabezado del PDF (izquierda, centro, derecha), para adaptar el diseño a mi marca.

**Why this priority**: La posición del logo impacta directamente en la percepción profesional del documento.

**Independent Test**: Se puede probar seleccionando cada opción de alineación y verificando que el logo se reposicione correctamente en el preview.

**Acceptance Scenarios**:

1. **Given** que cargo un logo en mi perfil, **When** selecciono "izquierda" como posición, **Then** el logo aparece alineado a la izquierda del header.
2. **Given** que cambio la posición a "centro", **When** veo el preview, **Then** el logo se centra en el header.
3. **Given** que cambio la posición a "derecha", **When** veo el preview, **Then** el logo se alinea a la derecha.

---

### User Story 3 - Live Runtime Preview (Priority: P1)

Como usuario, quiero ver un preview en vivo del presupuesto mientras ajusto colores y posición del logo, para tomar decisiones de diseño sin tener que generar y descargar PDFs de prueba.

**Why this priority**: Sin preview, el flujo es prueba-error lento y frustrante.

**Independent Test**: Se puede probar abriendo la pantalla de personalización con un presupuesto cargado, modificando colores y verificando que el preview HTML/CSS se actualice al instante sin generar un PDF intermedio.

**Acceptance Scenarios**:

1. **Given** que estoy viendo un presupuesto, **When** accedo a la personalización de PDF, **Then** veo una representación visual del presupuesto con los colores actuales y el logo en su posición.
2. **Given** que modifico el color o la posición del logo, **When** el preview se actualiza, **Then** los cambios son inmediatos (sin recarga de página ni generación de PDF).
3. **Given** que estoy conforme con el preview, **When** hago clic en "Descargar PDF", **Then** se genera el PDF final aplicando todas las personalizaciones seleccionadas.

### Edge Cases

- ¿Qué pasa si el usuario no tiene logo cargado? El preview muestra el header sin logo y las opciones de posición están deshabilitadas u ocultas.
- ¿Qué pasa si el usuario selecciona un color muy claro? El sistema debe garantizar contraste mínimo para que el texto sobre el color sea legible.
- ¿Qué pasa si el preview tiene muchos items y no entra en una página? Debe renderizarse completo (con scroll si es necesario).
- ¿Qué pasa si el usuario cierra la pantalla de personalización sin descargar? Los cambios se descartan (no se persisten).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST proporcionar un color picker para seleccionar el color primario del PDF.
- **FR-002**: El sistema MUST derivar automáticamente los colores secundarios (texto sobre primary, variantes, bordes) a partir del color primario seleccionado, garantizando contraste legible.
- **FR-003**: El sistema MUST permitir seleccionar la posición del logo entre las opciones: izquierda, centro, derecha.
- **FR-004**: El sistema MUST mostrar un preview en vivo del presupuesto usando HTML/CSS en el navegador, sin generar un PDF intermedio.
- **FR-005**: El preview MUST reflejar instantáneamente cualquier cambio en color o posición del logo.
- **FR-006**: El preview MUST incluir: header con logo (en la posición seleccionada) y nombre de empresa, bloques "DE"/"PARA", tabla de items, observaciones y footer con total.
- **FR-007**: El sistema MUST generar el PDF final con `generateBudgetPDF` aplicando el color primario seleccionado y la posición de logo elegida.
- **FR-008**: Los valores de personalización NO MUST persistirse entre sesiones en esta fase (se descartan al cerrar la pantalla).

### Key Entities *(include if feature involves data)*

N/A en esta fase — los valores de personalización son transitorios (solo estado local en la sesión). A futuro se agregará una entidad `PDFPreferences` asociada al perfil de usuario.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario puede personalizar color y posición del logo y ver el resultado en el preview en menos de 5 segundos desde que abre la pantalla.
- **SC-002**: El preview se actualiza en menos de 100ms tras cada cambio de color o posición.
- **SC-003**: 100% de los PDFs generados con personalización aplican correctamente el color seleccionado y la posición del logo elegida.
- **SC-004**: Un usuario puede completar el flujo completo (personalizar + descargar) sin generar ningún PDF de prueba intermedio.

## Assumptions

- Se asume que el usuario tiene un logo cargado previamente en su perfil (feature #002).
- Se asume que el color picker permite elegir cualquier color hexadecimal, no solo una paleta predefinida.
- Se asume que la derivación de colores secundarios se hace mediante una función utilitaria (lighten/darken HSL) para mantener contraste.
- Se asume que el preview es un componente React que replica visualmente la estructura del PDF pero usando HTML/CSS, no una renderización de jsPDF en canvas.
- Se asume que los valores de personalización se pasan como parámetros a `generateBudgetPDF` y no se almacenan en base de datos.
