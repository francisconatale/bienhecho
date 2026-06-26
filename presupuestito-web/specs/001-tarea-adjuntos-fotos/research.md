# Research: Ampliación de Tarea con Adjuntos de Fotos

**Date**: 2026-06-26
**Feature**: 001-tarea-adjuntos-fotos

## Research Topics

### 1. Almacenamiento de Fotos

**Decisión**: IndexedDB via `idb` library

**Rationale**: 
- Soporta almacenamiento de binarios (fotos como Blob)
- Límite de almacenamiento mucho mayor que localStorage (~50% del disco disponible)
- API moderna con soporte de promises
- Bundle size pequeño (~1.2kb gzipped)

**Alternativas consideradas**:
| Opción | Pros | Contras | Decisión |
|--------|------|---------|----------|
| localStorage | Simple, synchronizado | Límite 5MB, solo strings | ❌ Rechazado |
| File System API | Acceso directo a disco | No soportado en Safari, complejo | ❌ Rechazado |
| IndexedDB nativo | Sin dependencias | API verbosa, callbacks | ⚠️ Alternativa |
| `idb` library | Simple, promises, types | Dependencia externa | ✅ Seleccionado |

**Implementation**:
```typescript
// Estructura de la DB
const DB_NAME = 'presupuestito-photos';
const DB_VERSION = 1;
const STORE_NAME = 'task-photos';

// Schema
interface StoredPhoto {
  id: string;
  tarea_id: string;
  blob: Blob;
  descripcion: string;
  orden: number;
  created_at: string;
}
```

---

### 2. Gestión de Estado

**Decisión**: Extender Zustand store existente

**Rationale**:
- Consistente con el patrón actual (clients, jobs, tasks)
- Zustand ya es dependencia del proyecto
- Persiste durante la sesión del usuario

**Estructura propuesta**:
```typescript
interface DataState {
  // ... existente
  taskPhotos: TaskPhoto[];
  
  addTaskPhoto: (photo: Omit<TaskPhoto, 'id' | 'created_at'>) => TaskPhoto;
  updateTaskPhoto: (id: string, photo: Partial<TaskPhoto>) => void;
  removeTaskPhoto: (id: string) => void;
  getTaskPhotos: (tareaId: string) => TaskPhoto[];
}
```

**Sync con IndexedDB**:
- Las fotos se guardan en IndexedDB (persistencia)
- El store mantiene solo metadata (para UI reactiva)
- Al cargar la app, se leen fotos de IndexedDB al store

---

### 3. Componente de Upload

**Decisión**: Input file nativo con preview

**Rationale**:
- Sin dependencias externas
- Funciona en todos los dispositivos
- Preview antes de guardar (mejor UX)

**Flujo**:
1. Usuario hace clic en "Agregar foto"
2. Se abre selector de archivos (input type="file")
3. Se valida: tipo de archivo, tamaño
4. Se muestra preview con campo de descripción
5. Usuario confirma → se guarda en IndexedDB

**Validaciones**:
- Tipos permitidos: `image/jpeg`, `image/png`, `image/webp`
- Tamaño máximo: 5MB
- Máximo 20 fotos por tarea

---

### 4. UX de Expansión

**Decisión**: Click en tarea → toggle expand/collapse

**Rationale**:
- Patrón familiar (accordion)
- No necesita nuevo componente complejo
- Mantén el formulario de crear/editar simple

**Comportamiento**:
- Click en tarea → se expande panel debajo
- Click en otra tarea → primera se colapsa, nueva se expande
- Click en misma tarea → se colapsa
- Panel expandido muestra: galería de fotos + botón agregar

---

## Conclusiones

| Decisión | Elección | Dependencia Nueva |
|----------|----------|-------------------|
| Almacenamiento fotos | IndexedDB via `idb` | `idb` (~1.2kb) |
| Estado | Zustand store extendido | No |
| Upload | Input file nativo | No |
| UI expansión | Toggle click | No |

**Total dependencias nuevas**: 1 (`idb`)
