# Data Model: Navegación "Volver" Unificada

## Entities

Este feature no introduce nuevas entidades de datos. Trabaja exclusivamente con query params en URLs.

### Query Params

| Param | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `from` | string | Ruta de origen para navegación de regreso | `/clientes`, `/trabajos` |
| `clienteId` | string (UUID) | ID del cliente seleccionado en la lista | `abc-123` |
| `jobId` | string (UUID) | ID del trabajo seleccionado en la vista embebida | `def-456` |

### Nomenclatura de `from` (unificada)

| Valor | Origen | Destino del "Volver" |
|-------|--------|---------------------|
| `/trabajos` | Lista de trabajos | Lista de trabajos |
| `/clientes` | Lista de clientes | Lista de clientes |
| (ausente) | Deep link / URL directa | `/trabajos` (fallback) |

### Flujo de propagación

```
/clientes → selecciona cliente → /trabajos/{id}?from=/clientes&clienteId={id}
                                       ↓
                              /trabajos/{id}/materiales?from=/clientes&clienteId={id}&jobId={id}
                                       ↓
                              "Volver" → /trabajos/{id}?from=/clientes&clienteId={id}
                                       ↓
                              "Volver" → /clientes?clienteId={id}
                                       ↓
                              "Volver" → /clientes
```

## State Transitions

N/A — no hay estados de entidad involucrados.

## Validation Rules

- `from` debe ser un segmento de ruta válido que comience con `/`
- Si `from` es inválido o no existe, usar `/trabajos` como fallback
- `clienteId` y `jobId` deben ser UUIDs válidos cuando estén presentes
