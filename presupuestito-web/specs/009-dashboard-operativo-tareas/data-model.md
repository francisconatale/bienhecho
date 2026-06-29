# Data Model: Dashboard Operativo

## Modificaciones a Entidades Existentes

### Tarea (`Task`)
- **Nuevos Campos**:
  - `prioridad?: "alta" | "media" | "baja"`
  - `fecha_vencimiento?: string`
- **Uso**: Filtrar y agrupar visualmente la lista principal de tareas.

### Material (`Material`)
- **Nuevos Campos**:
  - `comprado: boolean`
- **Uso**: Filtrar los materiales en la vista "Lista de compras" (`comprado === false`).

## Transiciones de Estado Adicionales
- Hacer toggle de `comprado` en la vista de materiales actualizará el store global y removerá (visualmente) el material de la "lista de pendientes de compra".
