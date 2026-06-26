# Implementation Tasks: Gestión de Cobros y Materiales

## Configuración y Estado Global (Zustand & Types)
- [x] Definir interfaces TS en `src/types/index.ts` para `Material`, `EntregaParcial` y `Cobro`.
- [x] Actualizar el store de Zustand para soportar CRUD mock de `materiales`.
- [x] Actualizar el store de Zustand para soportar CRUD mock de `entregas_parciales` y `cobros`.
- [x] Implementar función auxiliar de cálculo de saldo pendiente (para no ensuciar componentes).

## Desarrollo: Gestión de Materiales y PDFs
- [x] Crear form schema (Zod) para `Material` en `hooks/use-material-form.ts` o similar.
- [x] Crear hook `useMaterials` para encapsular la lógica (subtotales y total general).
- [x] Crear componente de formulario atómico (o in-place) para añadir materiales.
- [x] Construir componente lista `material-list.tsx` que presente los ítems agregados y el costo total.
- [x] Asegurarse de utilizar estilos UI coherentes (Glassmorphism, sombras).
- [x] Modificar el servicio de generación de PDF (`jsPDF`) para agregar la sección de materiales desglosados y calcular el nuevo total del presupuesto.

## Desarrollo: Entregas Parciales y Cobros
- [x] Crear schemas (Zod) para `EntregaParcial` y `Cobro`.
- [x] Crear hook `usePayments` que retorne saldo pendiente, lista de entregas y cobros asociados.
- [x] Implementar componente de formulario para agregar entregas parciales.
- [x] Implementar componente de formulario para registrar cobros (incluyendo selector para asociar con entrega parcial opcional).
- [x] Implementar el panel de Cuentas a Cobrar (`payments-dashboard.tsx`), mostrando el Saldo Pendiente destacado.
- [x] Implementar la lista histórica de cobros y entregas con estados visuales (Pendiente, Pagado, Parcial).

## Integración en Vistas
- [x] Incorporar el componente de Gestión de Materiales en la vista detalle del Trabajo (`app/(dashboard)/trabajos/[id]/page.tsx`).
- [x] Incorporar el panel de Cuentas a Cobrar en la vista detalle del Trabajo.
- [x] Refinar las animaciones de entrada y verificar consistencia de espaciados (seguir reglas `AGENTS.md` y `SPACING-GUIDELINES.md`).

## Testing Manual (basado en User Stories)
- [x] Validar adición de múltiples materiales y recálculo del total.
- [x] Validar adición de una entrega parcial (aumenta las cuotas, el saldo a cobrar queda bien reflejado).
- [x] Validar registro de un cobro asociado a entrega (cambia el estado de la entrega, disminuye saldo pendiente general).
- [x] Validar registro de un cobro sin entrega (disminuye saldo pendiente base del presupuesto).
