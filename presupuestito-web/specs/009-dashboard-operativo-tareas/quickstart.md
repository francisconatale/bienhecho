# Quickstart: Validación del Dashboard Operativo

## Escenarios de Validación

1. **Navegar a la pantalla de Tareas (`/tareas`)**:
   - Verificar que exista una pestaña de "Tareas" y otra de "Materiales".
   - En Tareas, verificar el panel superior que muestre el monto total "A Facturar" basado en las tareas incompletas de trabajos presupuestados.

2. **Validar Agrupación por Prioridad**:
   - Observar que las tareas están agrupadas bajo etiquetas como "Hoy" (Prioridad Alta) y "Próximo" (Media/Baja/Sin asignar).

3. **Validar Alertas de Clientes**:
   - Visualizar tarjetas de alerta para trabajos en estado `borrador`.

4. **Validar Lista de Compras**:
   - Cambiar a la pestaña "Materiales".
   - Confirmar que se listan los materiales pendientes de compra.
   - Hacer click en un checkbox de material y verificar que cambie su estado y/o desaparezca de la lista de "pendientes".
