# Feature Specification: Ampliación de Tarea con Adjuntos de Fotos

**Feature Branch**: `001-tarea-adjuntos-fotos`

**Created**: 2026-06-26

**Status**: Draft

**Input**: User description: "necesito que amplies la clase tarea, para que se pueda ampliar, y se puedan adjuntar fotos"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Expandir tarea para ver detalles (Priority: P1)

Como usuario, quiero hacer clic en una tarea para verla expandida y acceder a más opciones, como agregar fotos.

**Why this priority**: La funcionalidad base es poder expandir la tarea. Sin esto no hay panel donde adjuntar fotos.

**Independent Test**: Puedo hacer clic en una tarea y ver un panel expandido con más información y opciones.

**Acceptance Scenarios**:

1. **Given** estoy en la lista de tareas de un trabajo, **When** hago clic en una tarea, **Then** se expande mostrando un panel con más detalles
2. **Given** la tarea está expandida, **When** hago clic en otra tarea, **Then** la primera se colapsa y la nueva se expande
3. **Given** la tarea está expandida, **When** hago clic en ella nuevamente, **Then** se colapsa

---

### User Story 2 - Adjuntar fotos a una tarea (Priority: P1)

Como usuario, quiero agregar fotos a una tarea expandida para documentar el trabajo realizado.

**Why this priority**: La fotos son el core de esta feature. Permiten documentar el estado del trabajo.

**Independent Test**: Puedo abrir una tarea, subir una foto con descripción, y verla listada.

**Acceptance Scenarios**:

1. **Given** tengo una tarea expandida, **When** selecciono una foto del dispositivo, **Then** la foto se carga y aparece en la lista de adjuntos
2. **Given** agregué una foto, **When** escribo una descripción para ella, **Then** la descripción se guarda junto con la foto
3. **Given** tengo fotos adjuntas, **When** veo la tarea expandida, **Then** las fotos aparecen como miniaturas con su descripción

---

### User Story 3 - Gestionar fotos adjuntas (Priority: P2)

Como usuario, quiero poder eliminar fotos que ya no necesito y ver todas las fotos de una tarea.

**Why this priority**: La gestión básica de fotos es importante para mantener el registro limpio.

**Independent Test**: Puedo ver la galería de fotos de una tarea y eliminar alguna.

**Acceptance Scenarios**:

1. **Given** tengo fotos adjuntas a una tarea, **When** veo la tarea expandida, **Then** puedo ver todas las fotos en una galería
2. **Given** tengo fotos adjuntas, **When** hago clic en eliminar una foto, **Then** se me pide confirmación y luego se elimina
3. **Given** eliminé una foto, **When** guardo los cambios, **Then** la foto no aparece más en la tarea

---

### Edge Cases

- ¿Qué pasa cuando intento subir un archivo que no es imagen?
- ¿Qué pasa si la foto es muy pesada?
- ¿Qué pasa si pierdo conexión mientras subo una foto?
- ¿Qué pasa si la tarea tiene muchas fotos (más de 20)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema MUST permitir expandir una tarea al hacer clic en ella
- **FR-002**: Sistema MUST mostrar un panel expandido con opciones de adjuntos
- **FR-003**: Sistema MUST permitir seleccionar y subir fotos desde el dispositivo
- **FR-004**: Sistema MUST validar que los archivos sean imágenes (jpg, png, webp)
- **FR-005**: Sistema MUST permitir agregar una descripción a cada foto
- **FR-006**: Sistema MUST mostrar las fotos como miniaturas con su descripción
- **FR-007**: Sistema MUST permitir eliminar fotos con confirmación
- **FR-008**: Sistema MUST persistir las fotos asociadas a cada tarea
- **FR-009**: Sistema MUST limitar el tamaño máximo de cada foto (ej: 5MB)
- **FR-010**: Sistema MUST mostrar un indicador de progreso durante la carga

### Key Entities

- **Tarea**: Se mantiene la estructura actual (id, trabajo_id, descripcion, precio, completada, orden)
- **FotoTarea** (nueva): Imagen adjunta a una tarea con su descripción
  - id: identificador único
  - tarea_id: referencia a la tarea
  - url: ubicación de la imagen
  - descripcion: texto descriptivo de la foto
  - orden: posición en la galería
  - created_at: fecha de creación

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuario puede expandir una tarea en menos de 1 segundo
- **SC-002**: Usuario puede subir una foto en menos de 5 segundos (conexión normal)
- **SC-003**: 100% de las fotos se muestran correctamente en la galería
- **SC-004**: Usuario puede eliminar una foto en menos de 2 segundos (incluyendo confirmación)

## Assumptions

- Las fotos se almacenan localmente (IndexedDB o localStorage) por ahora
- No se requiere backend para almacenar fotos en esta fase
- El usuario trabaja desde un dispositivo con cámara o acceso a galería
- Las fotos son辅助 documentación, no afectan la facturación
- Se permite un máximo de 20 fotos por tarea
