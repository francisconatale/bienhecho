# Feature Specification: Paginado local y filtrado de tareas por estado

**Feature Branch**: `010-paginado-local-filtrado`

**Created**: 2026-06-29

**Status**: Draft

**Input**: User description: "lo que podriamos hacer es en la seccion de tareas traer las 10 ultimas, y en caso de que haya mas ahi simplemente especializarla por estado"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Limitar a 10 tareas el tablero principal (Priority: P1)

El usuario ingresa al tablero principal de tareas. En lugar de ver una lista infinita que satura la pantalla, solo visualiza un resumen con las 10 tareas pendientes más urgentes/recientes agrupadas por prioridad.

**Why this priority**: Evita la sobrecarga visual (cognitive load) en el tablero de inicio. Esencial para la UX de la aplicación de tareas operativas, manteniendo la pantalla inicial enfocada en lo accionable de corto plazo.

**Independent Test**: Can be fully tested by loading the dashboard with >10 tasks and verifying only the top 10 are rendered in the summary view.

**Acceptance Scenarios**:

1. **Given** un estado global con más de 10 tareas pendientes, **When** el usuario abre la página de tareas en la vista principal, **Then** la lista muestra únicamente un máximo de 10 elementos distribuidos en sus prioridades (alta, media, baja).
2. **Given** el tablero de tareas limitado, **When** existen más tareas ocultas por el límite, **Then** se debe mostrar un indicador o botón estilo "Ver todas las pendientes (X)" que invite a la vista especializada.

---

### User Story 2 - Vistas especializadas por estado (Priority: P1)

Al detectar que hay tareas que exceden el límite (o si el usuario desea enfocarse), el usuario hace clic en "Ver todas las urgentes" o "Ver todas las pendientes" y accede a una lista completa, sin el límite de 10, filtrada específicamente por el estado deseado.

**Why this priority**: Complementa directamente a la US 1. Si limitamos la vista inicial, el usuario requiere imperativamente de una ruta de escape para visualizar el listado completo de un subconjunto de tareas específico.

**Independent Test**: Can be fully tested by triggering the "Ver todas" action and verifying the view switches to display all tasks of the chosen state without truncating.

**Acceptance Scenarios**:

1. **Given** el usuario está en el tablero principal, **When** hace clic en "Ver todas las urgentes", **Then** la vista cambia a una lista que contiene **todas** las tareas de prioridad alta, sin aplicar el límite de 10.
2. **Given** el usuario se encuentra en la vista especializada, **When** inspecciona la pantalla, **Then** debe existir un medio fácil (botón volver o breadcrumb) para retornar a la vista de resumen del tablero principal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El hook `useTareas` MUST calcular dinámicamente un slice de hasta 10 elementos combinando tareas de prioridad alta, media y baja para la vista de resumen.
- **FR-002**: El componente del dashboard MUST presentar botones de navegación/filtro ("Ver todas") condicionalmente cuando la cantidad total de tareas en un estado supere el límite visible.
- **FR-003**: La UI MUST manejar un estado local en la página (ej: `selectedCategory: 'resumen' | 'alta' | 'media' | 'baja' | 'completadas'`) o rutas anidadas para renderizar la vista completa especializada según el estado.

### Key Entities

- **Task (Tarea)**: Mantenida en `useDataStore`, posee atributos `prioridad` ('alta'|'media'|'baja') y `completada` (booleano).
- **ViewState**: Nuevo estado de presentación en `src/app/tareas/page.tsx` para alternar entre "Tablero Resumen" y "Lista Especializada".

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El tablero principal nunca excede la renderización de 10 tareas simultáneas en la sección de pendientes.
- **SC-002**: El usuario puede acceder al 100% de las tareas de la base de datos navegando a través de las vistas especializadas.

## Assumptions

- Se seguirá usando `useDataStore` (Zustand) para obtener las tareas de forma sincrónica en memoria, por lo que el "paginado" (limitar a 10) consiste en aplicar `.slice(0, 10)` a los arreglos resultantes localmente.
- No se implementará por el momento una paginación real de servidor (API calls con limit/offset), es una estrategia de presentación visual (UX).
