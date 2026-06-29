# 005 — Navegación "Volver" Unificada

## Short Name
navigate-back-consistency

## Overview

Unificar el comportamiento del botón "Volver" en todas las páginas de la aplicación para que siempre devuelva al usuario al punto de origen de forma predecible y natural. Actualmente existen múltiples mecanismos inconsistentes (query params sueltos, rutas hardcodeadas, rutas muertas) que generan confusión y navegación inesperada.

## User Scenarios & Testing

### Primary Flow: Navegación ida y vuelta desde Trabajos

1. El usuario está en la lista de Trabajos (`/trabajos`)
2. Hace tap en un trabajo → se abre el detalle (`/trabajos/{id}`)
3. Hace tap en "Volver" → vuelve a la lista de Trabajos
4. **Resultado esperado**: Vuelve exactamente a donde estaba, con la selección anterior

### Primary Flow: Navegación desde Clientes

1. El usuario está en la lista de Clientes (`/clientes`)
2. Selecciona un cliente → se abre el detalle
3. Hace tap en un trabajo del cliente → se abre el detalle del trabajo
4. Hace tap en "Volver" → vuelve al detalle del cliente
5. Hace tap en "Volver" → vuelve a la lista de Clientes
6. **Resultado esperado**: Cada "Volver" retrocede un paso en la cadena de navegación

### Sub-flujo: Materiales y Pagos

1. Desde el detalle del trabajo, el usuario entra a Materiales
2. Hace tap en "Volver" → vuelve al detalle del trabajo (no a la lista)
3. El usuario entra a Pagos
4. Hace tap en "Volver" → vuelve al detalle del trabajo
5. **Resultado esperado**: Las sub-páginas siempre vuelven al trabajo padre

### Sub-flujo: Tarea Detail

1. Desde el detalle del trabajo, el usuario entra a una tarea
2. Hace tap en "Volver" → vuelve al detalle del trabajo
3. **Resultado esperado**: La tarea es una hoja del trabajo, vuelve a él

### Caso edge: Nuevo Trabajo

1. El usuario crea un nuevo trabajo desde la lista de Trabajos
2. Decide cancelar → hace tap en "Volver"
3. **Resultado esperado**: Vuelve a la lista de Trabajos

### Caso edge: Deep link / URL directa

1. El usuario llega a un trabajo por URL directa (sin historial de navegación previo)
2. Hace tap en "Volver"
3. **Resultado esperado**: Vuelve a `/trabajos` como fallback seguro

### Testing Scenarios

| # | Escenario | Acción | Resultado esperado |
|---|-----------|--------|-------------------|
| 1 | Lista → Detalle → Volver | Tap "Volver" en detalle | Vuelve a lista |
| 2 | Clientes → Trabajo → Volver | Tap "Volver" en trabajo | Vuelve a cliente |
| 3 | Trabajo → Materiales → Volver | Tap "Volver" en materiales | Vuelve a trabajo |
| 4 | Trabajo → Pagos → Volver | Tap "Volver" en pagos | Vuelve a trabajo |
| 5 | Trabajo → Tarea → Volver | Tap "Volver" en tarea | Vuelve a trabajo |
| 6 | URL directa → Volver | Tap "Volver" sin historial | Vuelve a `/trabajos` |
| 7 | Clientes → Trabajo → Materiales → Volver → Volver | Doble retroceso | Lista de clientes |
| 8 | Nuevo Trabajo → Cancelar | Tap "Volver" en formulario | Lista de trabajos |

## Functional Requirements

### FR-01: Cadena de navegación con query params `from`

Toda navegación hacia un detalle DEBE incluir un parámetro `from` que identifique el origen. El botón "Volver" DEBE leer este parámetro para determinar el destino.

- El parámetro `from` contiene la ruta relativa del origen (ej: `/trabajos`, `/clientes`)
- Si `from` no existe, el destino por defecto es `/trabajos`
- Los parámetros adicionales necesarios para restaurar el estado (como `clienteId` o el id del trabajo seleccionado) DEBEN propagarse en la URL

### FR-02: Sub-páginas (Materiales, Pagos) vuelven al trabajo padre

Materiales y Pagos son sub-vistas de un trabajo. Al presionar "Volver" DEBEN volver a la vista del trabajo padre, conservando el contexto de navegación original (si el usuario vino desde Clientes, debe poder seguir volviendo a Clientes).

### FR-03: Tarea Detail vuelve al trabajo padre

La página de detalle de una tarea DEBE volver al detalle del trabajo que la contiene. Los parámetros de contexto (`from`, `clienteId`) DEBEN preservarse para que la cadena de navegación no se rompa.

### FR-04: Nuevo Trabajo cancelación

El formulario de nuevo trabajo DEBE tener un botón "Volver" que regrese a la lista de trabajos, o a la vista del cliente si se creó desde allí.

### FR-05: Eliminación de ruta muerta `/tareas`

El caso `from === "tareas"` en el detalle de tarea apunta a una ruta `/tareas` que no existe (generaría 404). DEBE eliminarse o reemplazarse por una ruta válida.

### FR-06: Nomenclatura consistente de parámetros

Los valores del parámetro `from` DEBEN usar los segmentos de ruta reales (`/trabajos`, `/clientes`) en vez de strings descriptivos arbitrarios (`"trabajo"`, `"clientes"`, `"tareas"`). Esto permite construir el href de vuelta directamente con `from` sin lógica condicional.

## Success Criteria

- **0 navegaciones inesperadas**: En los 8 escenarios de testing, el "Volver" siempre lleva al punto de origen correcto
- **0 rutas muertas**: Ningún "Volver" apunta a una ruta que no exista
- **Cadena completa**: Navegación de 3+ niveles (Clientes → Trabajo → Materiales → Volver → Volver → Volver) funciona correctamente
- **Sin query params huérfanos**: Al llegar al destino final, no quedan parámetros `from` innecesarios en la URL
- **Deep links funcionales**: Llegar por URL directa y presionar "Volver" resulta en una navegación segura a una lista

## Key Entities

- **`from`**: Query param que identifica la ruta de origen para navegación de regreso
- **`clienteId`**: Query param que preserva el contexto del cliente seleccionado en la lista
- **`jobId`**: Query param que preserva el trabajo seleccionado en la vista embebida

## Assumptions

- El usuario no necesita volver al estado exacto de scroll de la lista anterior; volver a la ruta correcta es suficiente
- La navegación es siempre lineal (no se requiere historial complejo tipo breadcrumb)
- Los parámetros de estado (qué cliente/estaba seleccionado) se propagan via query params, no via state management global
- El patrón Master-Detail (lista + detalle embebido) maneja su propio estado de selección internamente y no depende de la navegación URL para el "Volver" del detalle

## Out of Scope

- Navegación con historial del navegador (back/forward del browser)
- Persistencia de estado de scroll en listas
- Breadcrumb navigation visual
- State management global de navegación
