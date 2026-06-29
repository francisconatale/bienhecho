# Research: Dashboard Operativo

## Decision: Agrupación de Tareas
**Decision**: Agrupar las tareas por la nueva propiedad `prioridad` ("alta", "media", "baja") o por pertenencia a trabajos en estado de alerta ("esperando al cliente").
**Rationale**: El usuario solicitó ver primero lo que tiene que hacer "Hoy". La prioridad "alta" será mapeada a "Hoy", "media" a "Próximo" y "baja" a "Sin apuro".

## Decision: Resumen Financiero
**Decision**: Calcular la suma de los `precio` de todas las tareas `completada: false` de los trabajos en estado `presupuestado`.
**Rationale**: Estas son las tareas que, al completarse, permitirán pasar el trabajo a pagado o facturar saldo, representando el flujo de caja más inmediato.

## Decision: Lista de Compras
**Decision**: Agregar una pestaña o sección "Materiales" separada de la lista de tareas, mostrando todos los materiales de trabajos activos que tengan `comprado: false`.
**Rationale**: Mantiene el checklist de trabajo y el checklist de compras separados en UI para evitar confusión, usando un tab navigation simple en la cabecera del Dashboard.
