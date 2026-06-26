# Data Model: Ampliación de Tarea con Adjuntos de Fotos

**Date**: 2026-06-26
**Feature**: 001-tarea-adjuntos-fotos

## Entity: TaskPhoto

Representa una foto adjunta a una tarea. Almacena metadata en Zustand y el blob en IndexedDB.

### Fields

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
| `tarea_id` | uuid FK | no | Referencia a la tarea (`→ tareas.id`) |
| `url` | string | no | URL.createObjectURL del blob (temporal) o ruta de almacenamiento |
| `descripcion` | string | sí | Descripción de la foto |
| `orden` | integer | no | Posición en la galería |
| `created_at` | timestamp | no | Fecha de creación |

### Relationships

```
TAREA (1) ──── (N) TASK_PHOTO
```

Una tarea puede tener múltiples fotos. Una foto pertenece a una sola tarea.

### Validation Rules

| Regla | Valor | Descripción |
|-------|-------|-------------|
| `tarea_id` | required | Debe referenciar una tarea existente |
| `url` | required | Debe ser una URL válida |
| `descripcion` | optional | Máximo 500 caracteres |
| `orden` | required | >= 0, único por tarea |
| Archivo | required | jpg, png, webp; máximo 5MB |
| Límite | 20 fotos | Máximo por tarea |

### State Transitions

Las fotos no tienen estados complejos. Solo:
- **Creada**: Se sube y guarda
- **Eliminada**: Se marca para eliminación (confirmación requerida)

### IndexedDB Schema

```typescript
interface StoredPhoto {
  id: string;           // uuid
  tarea_id: string;     // uuid FK
  blob: Blob;           // Imagen original
  descripcion: string;  // Descripción
  orden: number;        // Posición
  created_at: string;   // ISO timestamp
}
```

**Database**: `presupuestito-photos`
**Object Store**: `task-photos`
**Index**: `tarea_id` (para queries por tarea)

---

## Entity: Task (modificada)

La entidad Task existente NO cambia en estructura. Solo se agrega una relación:

| Campo | Tipo | Cambio |
|-------|------|--------|
| `id` | uuid PK | Sin cambio |
| `trabajo_id` | uuid FK | Sin cambio |
| `descripcion` | string | Sin cambio |
| `precio` | decimal | Sin cambio |
| `completada` | boolean | Sin cambio |
| `orden` | integer | Sin cambio |
| `fotos` | TaskPhoto[] | **NUEVO** (virtual, no persistido en DB) |

**Nota**: `fotos` es un campo virtual que se calcula al hacer query de fotos por `tarea_id`. No se almacena en la tabla `tareas`.

---

## Diagrama

```
┌─────────────────┐
│     TAREA       │
├─────────────────┤
│ id (uuid PK)    │
│ trabajo_id (FK) │
│ descripcion     │
│ precio          │
│ completada      │
│ orden           │
└────────┬────────┘
         │
         │ 1
         │
         │ N
┌────────┴────────┐
│   TASK_PHOTO    │
├─────────────────┤
│ id (uuid PK)    │
│ tarea_id (FK)   │
│ url             │
│ descripcion     │
│ orden           │
│ created_at      │
└─────────────────┘
```
