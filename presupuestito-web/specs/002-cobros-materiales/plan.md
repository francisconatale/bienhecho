# Implementation Plan: Gestión de Cobros y Materiales

Este plan detalla los pasos de implementación para la nueva funcionalidad en la aplicación de Presupuestito, basado en la arquitectura existente y las reglas establecidas en `AGENTS.md`, `GEMINI.md` y `database_relations.md`.

## Fase 1: Actualización del Estado Global (Zustand store)

1. **Definir Types / Interfaces (`src/types/index.ts`)**:
   - Crear las interfaces `Material`, `EntregaParcial`, `Cobro` siguiendo los campos requeridos y tipos.
   - Incluir los nuevos arrays en el store o en el modelo de `Trabajo` según corresponda la estructura del mock actual (preferentemente crear stores dedicados si se escala, o agregar a un `useStore` centralizado mockeado).

2. **Actualizar el Store Mock**:
   - Añadir acciones para crear/editar/eliminar materiales.
   - Añadir acciones para crear/editar/eliminar entregas parciales.
   - Añadir acciones para registrar/eliminar cobros.

## Fase 2: Lógica de Negocio (Custom Hooks)

3. **Crear Custom Hooks** en las respectivas features:
   - `useMaterials(trabajoId)`: encapsula lógica de cálculo de subtotal por ítem y total general.
   - `usePayments(trabajoId)`: encapsula cálculo de saldos pendientes, estado de entregas parciales (pagado/pendiente) combinando entregas y cobros del trabajo.

## Fase 3: Componentes UI de Materiales y Modificación de PDFs

4. **Componente de Formulario de Materiales**:
   - Campos: Nombre (texto), Cantidad (número), Precio Unitario (número).
   - Cálculos en tiempo real del Subtotal.
   - Usar React Hook Form y Zod.

5. **Lista de Materiales (`materials-list.tsx`)**:
   - Renderizar la tabla o lista de materiales del trabajo.
   - Seguir patrón de listas genéricas o una tabla simple si se adapta mejor.
   - Mostrar el Total acumulado.
   - Aplicar estilos de Glassmorphism según la regla "Premium".

6. **Actualizar Generación de PDF (Presupuesto/Factura)**:
   - Modificar la función encargada de generar el PDF con `jspdf-autotable`.
   - Incluir una tabla separada para el detalle de materiales.
   - Sumar el costo de los materiales al total general.

## Fase 4: Componentes UI de Cobros y Entregas

6. **Componente de Entregas Parciales (`entregas-list.tsx`)**:
   - Lista que muestra las cuotas/hitos.
   - Para cada entrega, mostrar estado (Pendiente, Pagado, Parcial).
   - Botón para registrar un cobro sobre una entrega específica.

7. **Componente de Formulario de Cobros (`cobro-form.tsx`)**:
   - Campos: Monto, Fecha, Forma de Pago (Select), Notas (opcional).
   - Poder asociar o no a una entrega parcial.
   - Validación para que el monto sea razonable (no negativo, etc).

8. **Panel General de Cuentas a Cobrar**:
   - Organism que integra la lista de entregas y el historial de cobros sueltos.
   - Tarjeta principal con el Saldo Pendiente del Trabajo, de estilo destacado (Aurora/Glassmorphism).

## Fase 5: Integración en la Vista del Trabajo

9. **Modificar `app/(dashboard)/trabajos/[id]/page.tsx`**:
   - Integrar los nuevos componentes al layout principal del trabajo de manera declarativa.
   - Asegurarse de no utilizar un wrapper monolítico (no `content.tsx`).
   - Respetar la jerarquía visual de la página: incorporar nuevas secciones con `backdrop-blur` y animaciones ligeras al entrar en pantalla.

## Criterios de Finalización

- Todos los componentes renderizan adecuadamente bajo estándares Premium.
- La funcionalidad (Zustand mock) se refleja correctamente (se agregan materiales/cobros y se calculan los montos).
- Se respetan todas las reglas descritas en `AGENTS.md` (no Stretched UI en Desktop, patrón In-place si aplica, etc).
