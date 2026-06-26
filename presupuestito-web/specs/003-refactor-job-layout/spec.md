# Reorganización de Layout de Trabajo (Materiales y Pagos)

## 1. Contexto
La página principal de Detalles del Trabajo (`/trabajos/[id]`) se ha sobrecargado tras incluir las listas completas y formularios in-place de **Materiales** y **Pagos/Entregas Parciales**. Para mantener una jerarquía visual limpia y una navegación óptima (evitando el scroll infinito), se solicita reorganizar estas secciones "al estilo de tarea".

## 2. Definición del "Estilo de Tarea"
Actualmente, las tareas se presentan en una lista resumida (`TaskList`) dentro del Trabajo. Cada ítem de la lista es clickeable y lleva a una sub-ruta de detalle (`/trabajos/[id]/tareas/[tareaId]`). 
Siguiendo este patrón, el objetivo es **limpiar la vista principal** y llevar el detalle de gestión a rutas separadas o mantener las listas en la principal pero en un formato altamente condensado y delegar la edición compleja a sub-vistas, o bien emular la estructura de lista compacta para Materiales y Pagos.

## 3. Propuesta de Refactor (UX/UI)
1. **Página Principal del Trabajo (`/trabajos/[id]`)**:
   - Mantener el Sidebar con el **Progreso** y la tarjeta de **Total Estimado** (que agrupa el botón de Generar Presupuesto).
   - En la columna principal, en vez de tener todas las listas desplegadas con sus formularios grandes, tendremos "Secciones Resumen" o listas compactas.
   - **Opción A (Rutas separadas para gestión global)**: Crear `/trabajos/[id]/materiales` y `/trabajos/[id]/pagos` como vistas enteras, y en el `page.tsx` principal solo poner accesos directos (ej: tarjetas resumen que digan "Materiales: 5 ítems - $X" -> Ver Materiales).
   - **Opción B (Sub-rutas por ítem)**: Dejar las listas en el `page.tsx` de forma resumida (como `TaskItem`), y mover la edición/detalle a sub-rutas (ej: `/trabajos/[id]/materiales/[matId]`). Sin embargo, dado que Materiales y Pagos suelen ser rápidos de cargar, la Opción A o una versión súper compactada podría ser más eficiente.

*Basándonos en "al estilo tarea", procederemos agrupando las listas de Materiales y Plan de Pagos como "Listas Compactas" en la vista principal, donde el ítem redirecciona a una página dedicada si requiere más detalle, o bien se crea una sub-página global para gestionar los materiales y otra para los pagos de este trabajo, quitando los pesados Dashboards del `page.tsx`.*

## 4. Requerimientos
- Extraer `MaterialList` y `PaymentsDashboard` de la vista principal si resultan muy pesados, y reemplazarlos por "Summaries" (Resúmenes).
- Crear las rutas necesarias (`/trabajos/[id]/materiales` y `/trabajos/[id]/pagos`) o aplicar el patrón exacto de `task-list.tsx` (lista con modal/form in-place, pero muy compacta).
- Mantener los hooks existentes (`useMaterials`, `usePayments`).
