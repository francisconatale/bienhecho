# Plan de Ejecución: Refactor de Layout

## Fase 1: Análisis y Rediseño de Navegación
- **Objetivo**: Determinar qué se queda en `page.tsx` y qué se va a rutas separadas.
- **Enfoque recomendado**: 
  - La página `page.tsx` de trabajo actuará como un **Hub / Dashboard principal**.
  - Tendrá una lista de "Tareas" (ya existe), un bloque resumen de "Materiales" y un bloque resumen de "Cuentas a Cobrar".
  - Al hacer clic en un Material, idealmente te llevaría a `/trabajos/[id]/materiales/[matId]`, pero para materiales, al ser algo rápido, quizá convenga emular la adición in-place súper rápida y solo separar visualmente en componentes colapsables, o **migrar la gestión entera de Pagos y Materiales a sub-rutas** `/trabajos/[id]/materiales` y `/trabajos/[id]/pagos`.
  - Como el usuario indicó "al estilo de tarea", las **tareas tienen una lista compacta in-place para agregarlas**, y al clickear un ítem vas al detalle (donde hay fotos y campos extra). Haremos exactamente esto: listas compactas en la vista de trabajo y sub-rutas de detalle solo si se necesita, O separar por completo.

## Fase 2: Refactorización
1. Ajustar `MaterialList` para que sea estructuralmente idéntico a `TaskList` (estilo visual, botón de agregar, listado de ítems sin ocupar tanto espacio).
2. Ajustar `PaymentsDashboard` para que no sea un bloque masivo de dos columnas en el main page, sino un componente condensado o extraer los cobros a una sub-ruta.
3. Limpiar `page.tsx`.

## Fase 3: Testing y Estilos
- Verificar responsividad.
- Mantener Glassmorphism y sombras premium.
