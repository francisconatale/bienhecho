# Feature Specification: Dashboard Operativo de Tareas

## Feature Description
Transformar la pantalla de Tareas en un "Centro de Operaciones" para el prestador, agrupando tareas por prioridad, mostrando un resumen financiero rápido (lo que se puede facturar y qué clientes esperan), y una lista consolidada de materiales a comprar.

## User Scenarios & Testing
- **Scenario 1:** El usuario entra a la pantalla de Tareas y ve un resumen superior con el monto total que puede facturar al terminar las tareas actuales.
- **Scenario 2:** El usuario visualiza una lista de clientes "esperando", basada en el estado del trabajo (ej. "borrador").
- **Scenario 3:** El usuario puede clasificar tareas por prioridad (Alta, Media, Baja) o fecha de vencimiento, viéndolas agrupadas bajo secciones como "Hoy", "Próximo".
- **Scenario 4:** El usuario puede acceder a una lista o pestaña de "Materiales a comprar" (materiales de trabajos activos que tienen `comprado: false`) y marcarlos como comprados.

## Functional Requirements
1. **Resumen Financiero:**
   - Calcular y mostrar la suma del campo `precio` de las `tareas` incompletas pertenecientes a trabajos `presupuestado`.
2. **Alertas de Clientes Esperando:**
   - Identificar trabajos en `borrador` para alertar: "Te falta emitirle el presupuesto a [Cliente]".
   - Identificar trabajos en `presupuestado` con `fecha_inicio` en el pasado y sin tareas completadas para alertar: "Trabajo demorado con [Cliente]".
3. **Agrupación de Tareas por Prioridad:**
   - Permitir asignar `prioridad` a las tareas (`alta`, `media`, `baja`) o una `fecha_vencimiento`.
   - Mostrar la lista de tareas principal agrupada bajo encabezados basados en esta prioridad ("Hoy" para alta, etc.).
4. **Lista de Compras de Materiales:**
   - Agregar una vista (sección o pestaña) que recopile todos los `materiales` donde `comprado: false`.
   - Permitir al usuario hacer toggle del estado de compra desde esta vista.

## Success Criteria
- El usuario puede identificar inmediatamente la prioridad de sus tareas de hoy al abrir la pantalla.
- La pantalla muestra el monto exacto "a facturar" calculado dinámicamente con las tareas pendientes.
- La lista de compras permite gestionar el estado `comprado` de los materiales sin entrar al detalle de cada trabajo.

## Key Entities (Data Model)
- **Task (Tarea):** Requiere campos `prioridad` (alta, media, baja) y opcionalmente `fecha_vencimiento`. (Ya actualizados en la DB).
- **Material:** Requiere campo booleano `comprado` (default: false). (Ya actualizado en la DB).

## Assumptions
- Los estados "alta", "media" y "baja" mapean lógicamente a vistas de "Hoy", "Próximo" y "Sin apuro".
- El resumen financiero excluye tareas de trabajos en `borrador` o `pagado`.
