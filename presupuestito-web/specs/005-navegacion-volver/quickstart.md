# Quickstart: Navegación "Volver" Unificada

## Prerequisites

- Aparición corriendo (`npm run dev`)
- Base de datos con al menos 1 cliente y 1 trabajo con tareas

## Validation Scenarios

### Scenario 1: Trabajos → Detalle → Volver

1. Ir a `/trabajos`
2. Seleccionar un trabajo de la lista
3. Verificar URL: `/trabajos/{id}?from=/trabajos` o sin `from` si vino de la lista
4. Tap "Volver"
5. **Expected**: Vuelve a `/trabajos` con la lista visible

### Scenario 2: Clientes → Trabajo → Volver → Volver

1. Ir a `/clientes`
2. Seleccionar un cliente
3. Tap en un trabajo del cliente
4. Verificar URL: `/trabajos/{id}?from=/clientes&clienteId={id}`
5. Tap "Volver"
6. **Expected**: Vuelve al detalle del cliente
7. Tap "Volver" de nuevo
8. **Expected**: Vuelve a la lista de clientes

### Scenario 3: Trabajo → Materiales → Volver → Volver → Volver

1. Desde `/clientes`, navegar a un trabajo
2. Tap en "Materiales"
3. Verificar URL: `/trabajos/{id}/materiales?from=/clientes&clienteId={id}&jobId={id}`
4. Tap "Volver"
5. **Expected**: Vuelve al detalle del trabajo
6. Tap "Volver"
7. **Expected**: Vuelve al detalle del cliente
8. Tap "Volver"
9. **Expected**: Vuelve a la lista de clientes

### Scenario 4: Tarea → Volver

1. Desde el detalle del trabajo, tap en una tarea
2. Verificar URL: `/trabajos/{id}/tareas/{tareaId}?from=/clientes&clienteId={id}&jobId={id}`
3. Tap "Volver"
4. **Expected**: Vuelve al detalle del trabajo con todos los params de contexto

### Scenario 5: Deep link → Volver

1. Navegar directamente a `/trabajos/{id}` (sin params)
2. Tap "Volver"
3. **Expected**: Vuelve a `/trabajos`

### Scenario 6: Nuevo Trabajo → Cancelar

1. Ir a `/trabajos/nuevo`
2. Tap "Volver"
3. **Expected**: Vuelve a `/trabajos`

## Validation Commands

```bash
# Verificar que no hay rutas rotas en los links
grep -rn "from.*tareas" src/app/trabajos/ # No debería encontrar from="tareas"

# Verificar que todos los backHref usan from
grep -rn "backHref\|from.*searchParams" src/app/trabajos/ src/app/clientes/
```
