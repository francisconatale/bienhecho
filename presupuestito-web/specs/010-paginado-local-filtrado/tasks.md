# Implementation Tasks: Paginado local y filtrado de tareas por estado

**Branch**: `010-paginado-local-filtrado`

**Input**: Plan from `specs/010-paginado-local-filtrado/plan.md`

## Task Breakdown

### Task 1: Actualizar hook `use-tareas.ts` para soportar categorías especializadas
- **File**: `src/app/tareas/hooks/use-tareas.ts`
- **Description**: 
  - Agregar un estado interno para la categoría seleccionada (ej. `category`: `"resumen" | "alta" | "media" | "baja" | "completadas"`), y exportar este estado y su setter.
  - El filtro actual `filter` ("pendientes" | "completadas") puede seguir existiendo, pero si la categoría es específica, prevalece la categoría.
  - Retornar las cuentas totales por cada prioridad para poder mostrar en los botones "Ver todas las altas (X)", etc.

### Task 2: Modificar lógica de agrupamiento y límite en `use-tareas.ts`
- **File**: `src/app/tareas/hooks/use-tareas.ts`
- **Description**:
  - Si la vista es "resumen", agrupar las tareas pendientes (prioridad alta, luego media, luego baja) y asegurar que entre todas no sumen más de 10. Para lograrlo, hacer un único arreglo `pendientes` ordenado por prioridad y fecha, aplicar `.slice(0, 10)`, y luego reagrupar esas 10 en alta/media/baja para retornarlas en `groupedTasks`.
  - Si la vista es especializada (ej. "alta"), retornar en `groupedTasks.alta` absolutamente todas las tareas altas, y dejar las demás vacías.
  - Asegurar que `groupedTasks.completadas` no se vea afectado si no aplica.

### Task 3: Actualizar componentes de UI para mostrar modo Resumen vs Especializado
- **Files**: `src/app/tareas/page.tsx`, `src/app/tareas/components/tareas-list.tsx`
- **Description**:
  - En `page.tsx`, si estamos en una categoría específica, mostrar un título o breadcrumb para indicar que estamos viendo una categoría particular ("Tareas de Prioridad Alta") junto a un botón para volver al "Resumen".
  - En `tareas-list.tsx`, al final de cada sección (alta, media, baja), si el número total de esa categoría es mayor al que se está mostrando (debido al límite global de 10), renderizar un botón "Ver todas las [prioridad] (Total: X)" que al hacer clic llame a `setCategory("alta")` (por ejemplo).
  - Asegurar que la estética premium se mantenga y la experiencia sea fluida (quizás ocultar los filtros globales de TareasFilter si estamos dentro de una categoría enfocada).

## Execution Plan

1. Ejecutar Task 1 y Task 2 juntas (modificaciones en el hook `use-tareas.ts` para manejar estados y paginado).
2. Ejecutar Task 3 (modificaciones en UI para consumir este nuevo estado y navegar entre resumen/especializado).
