# Feature Specification: Paginación Universal

**Feature Branch**: `004-paginacion-universal`

**Created**: 2026-06-26

**Status**: Draft

**Input**: User description: "Encárgate de hacer otra feature con todos estos puntos que tratamos — hook de paginación genérico + componente de botones compartido + integrar en todas las listas"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegar lista de clientes paginada (Priority: P1)

Como usuario, quiero ver los clientes divididos en páginas de 10 en lugar de desplazar una lista interminable, para encontrar y gestionar clientes más rápido.

**Why this priority**: Es la lista principal de la app y la que más crece con el uso. Sin paginación, degrada la experiencia en mobile.

**Independent Test**: Con 25 clientes en el sistema, la lista muestra máximo 10 por página, con indicador "Mostrando 1–10 de 25" y controles para avanzar/retroceder.

**Acceptance Scenarios**:

1. **Given** 25 clientes registrados, **When** entro a la página de Clientes, **Then** veo solo 10 clientes en la lista y un control de paginación que dice "Mostrando 1–10 de 25"
2. **Given** estoy en la página 2 de la lista de clientes, **When** escribo en el buscador, **Then** el resultado del filtro muestra desde la página 1

---

### User Story 2 - Navegar tareas globales paginadas (Priority: P1)

Como usuario, quiero ver las tareas de todos mis trabajos paginadas para poder revisarlas sin una pared de texto.

**Why this priority**: La página de Tareas (global) es la que más ítems acumula a largo plazo.

**Independent Test**: Con 30 tareas sin filtrar, la página muestra máximo 10 por página. Al cambiar el filtro "pendientes/completadas", se reinicia a página 1.

**Acceptance Scenarios**:

1. **Given** 22 tareas pendientes y page size 10, **When** estoy en la pestaña "Pendientes", **Then** veo 10 tareas en página 1, 10 en página 2, y 2 en página 3

---

### User Story 3 - Paginación en listas de detalle de trabajo (Priority: P2)

Como usuario, quiero que las listas de tareas y materiales dentro de un trabajo también paginen, para no perder contexto al hacer scroll.

**Why this priority**: Con trabajos grandes (20+ tareas o materiales), la página de detalle se vuelve inmanejable.

**Independent Test**: Con 15 tareas en un trabajo, la sección de tareas muestra 10 por página con controles abajo.

**Acceptance Scenarios**:

1. **Given** un trabajo con 18 tareas, **When** veo el detalle del trabajo, **Then** la sección de Tareas del Trabajo muestra máximo 10 con paginación

---

### User Story 4 - Paginación en agenda y dashboard (Priority: P3)

Como usuario, quiero que las visitas del día y los widgets del dashboard también paginen si hay muchos resultados.

**Why this priority**: Menos crítico porque el filtro por día ya acota, y los widgets del dashboard muestran pocos items naturalmente.

**Independent Test**: Con 12 visitas en un día, la lista de visitas muestra máximo 10 con paginación.

**Acceptance Scenarios**:

1. **Given** más de 10 visitas en un día seleccionado, **When** veo el panel de visitas, **Then** aparecen controles de paginación
2. **Given** el dashboard con más de 5 trabajos recientes, **When** veo la sección Actividad Reciente, **Then** puedo navegar las páginas

---

### Edge Cases

- **Lista vacía**: Cuando no hay items (filtro sin resultados, trabajo sin tareas), no se muestra ningún control de paginación
- **Una sola página**: Con menos items que el page size, los controles de paginación no se renderizan
- **Cambio de filtro**: Cualquier cambio en search/filtro/tab debe reiniciar a página 1 automáticamente
- **Items eliminados**: Si elimino el último item de una página, retrocedo a la página anterior automáticamente
- **Page size inconsistente**: Cada lista puede tener su propio page size (clientes=10, tareas globales=15, dashboard=5) sin afectar a las demás

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE proveer un hook genérico `usePagination<T>` que reciba un array de items y un page size, y retorne los items de la página actual más metadatos de navegación (página actual, total páginas, total items, flags isFirst/isLast, funciones goToPage/nextPage/prevPage)
- **FR-002**: El hook DEBE reiniciar a página 1 automáticamente cuando el array de items cambie (por search, filtro, cambio de pestaña)
- **FR-003**: El hook DEBE ocultarse cuando `totalPages <= 1` (no renderizar controles si no hay múltiples páginas)
- **FR-004**: El sistema DEBE proveer un componente compartido `PaginationButtons` que muestre: flecha anterior, números de página con elipsis para rangos grandes, flecha siguiente, y texto "Mostrando X–Y de Z resultados"
- **FR-005**: Los botones de paginación DEBEN ser clickeables y responsivos en mobile (área táctil mínima 44x44px)
- **FR-006**: Cada lista DEBE mantener su propio estilo visual y layout; la paginación solo agrega el hook y el componente de botones sin alterar la apariencia de los items
- **FR-007**: La paginación DEBE aplicarse a: lista de Clientes, lista de Tareas global, lista de Tareas por trabajo, lista de Materiales, lista de Visitas del día en Agenda, widgets Actividad Reciente y Próximas Visitas del dashboard
- **FR-008**: Cada lista DEBE poder configurar su propio page size sin afectar a las demás

### Key Entities

- **PaginatedList**: Abstracción conceptual que representa cualquier lista con paginación. No es una entidad de datos sino un patrón de UI.
- **PaginationState**: Estado de navegación (página actual, total páginas) manejado por el hook, efímero y local a cada lista.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuarios pueden navegar listas de 50+ items sin superar 10 items visibles por página
- **SC-002**: El componente PaginationButtons se renderiza en todas las listas especificadas (7 integraciones) con el mismo aspecto visual y comportamiento
- **SC-003**: Los controles de paginación son operables en pantallas de 375px de ancho sin solapamiento ni corte
- **SC-004**: El hook resetea a página 1 inmediatamente al cambiar el filtro/search en todas las listas
- **SC-005**: Cero regresiones visuales en las listas existentes — los items se ven idénticos antes y después de la paginación

## Assumptions

- Los datos están en memoria (Zustand) y la paginación es 100% client-side. No hay backend que soporte paginación server-side.
- El page size default es 10 para listas principales, 5 para widgets del dashboard.
- No se requiere persitir la página actual en URL o localStorage.
- Cada instancia del hook es independiente (no hay estado global de paginación compartido entre listas).
- El diseño visual de PaginationButtons sigue el patrón glassmorphic existente (bg-surface/30, backdrop-blur-2xl, rounded-[28px]) para mantener consistencia con el design system.
