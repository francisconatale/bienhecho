# UI Contracts: TaskItem Expandable

**Component**: `task-item.tsx`
**Feature**: 001-tarea-adjuntos-fotos

## Contract: TaskItem

### Props

```typescript
interface TaskItemProps {
  task: Task;
}
```

### State

```typescript
interface TaskItemState {
  isExpanded: boolean;      // Panel expandido o colapsado
  isEditing: boolean;       // Modo edición (formulario)
  confirmDelete: boolean;   // Modal de confirmación
}
```

### Comportamiento

| Acción | Estado | Resultado |
|--------|--------|-----------|
| Click en tarea | `isExpanded = false` | `isExpanded = true`, muestra panel fotos |
| Click en tarea | `isExpanded = true` | `isExpanded = false`, colapsa panel |
| Click en otra tarea | `isExpanded = true` | Primera colapsa, nueva expande |
| Click en editar | `isEditing = false` | `isEditing = true`, muestra TaskForm |
| Guardar edición | `isEditing = true` | `isEditing = false`, actualiza tarea |
| Click en eliminar | `confirmDelete = false` | `confirmDelete = true`, muestra modal |
| Confirmar eliminar | `confirmDelete = true` | Elimina tarea, `confirmDelete = false` |

### UI Structure

```
TaskItem (expandido)
├── Checkbox (completada)
├── Contenido (descripcion + precio)
├── Acciones (editar, eliminar)
└── Panel Expandido (condicional)
    └── TaskPhotos
        ├── Lista de fotos (miniaturas)
        ├── Botón "Agregar foto"
        └── PhotoUpload (condicional)
```

---

## Contract: TaskPhotos

**Component**: `task-photos.tsx`

### Props

```typescript
interface TaskPhotosProps {
  tareaId: string;
  isExpanded: boolean;
}
```

### State

```typescript
interface TaskPhotosState {
  photos: TaskPhoto[];      // Fotos de esta tarea
  isUploading: boolean;     //Mostrando uploader
  isLoading: boolean;       // Cargando fotos
}
```

### Comportamiento

| Acción | Estado | Resultado |
|--------|--------|-----------|
| Montaje | `isLoading = true` | Carga fotos de IndexedDB |
| Fotos cargadas | `isLoading = false` | Muestra galería |
| Click "Agregar foto" | `isUploading = false` | `isUploading = true`, muestra PhotoUpload |
| Foto subida | `isUploading = true` | `isUploading = false`, agrega a galería |
| Click en foto | - | Abre preview modal (futuro) |
| Click eliminar foto | - | Muestra confirmación |
| Confirmar eliminar | - | Elimina foto de IndexedDB |

### UI Structure

```
TaskPhotos
├── Header ("Fotos" + contador)
├── Galería (grid de miniaturas)
│   └── PhotoThumbnail (×N)
│       ├── Imagen (preview)
│       ├── Descripción
│       └── Botón eliminar
├── Botón "Agregar foto"
└── PhotoUpload (condicional)
    ├── Input file (hidden)
    ├── Preview de imagen
    ├── Campo descripción
    └── Botones (Cancelar/Guardar)
```

---

## Contract: PhotoUpload

**Component**: `photo-upload.tsx`

### Props

```typescript
interface PhotoUploadProps {
  tareaId: string;
  onSave: (photo: TaskPhoto) => void;
  onCancel: () => void;
}
```

### State

```typescript
interface PhotoUploadState {
  file: File | null;        // Archivo seleccionado
  preview: string;          // URL de preview
  descripcion: string;      // Descripción de la foto
  isValidating: boolean;    // Validando archivo
  error: string | null;     // Error de validación
}
```

### Validación

| Regla | Error |
|-------|-------|
| Tipo no es imagen | "Solo se permiten archivos jpg, png o webp" |
| Tamaño > 5MB | "La imagen no puede superar 5MB" |
| Descripción vacía | "Agregá una descripción" (warning, no bloquea) |

### Comportamiento

| Acción | Estado | Resultado |
|--------|--------|-----------|
| Seleccionar archivo | - | Valida tipo y tamaño, muestra preview |
| Escribir descripción | - | Actualiza `descripcion` |
| Click "Guardar" | - | Valida, guarda en IndexedDB, llama `onSave` |
| Click "Cancelar" | - | Llama `onCancel`, limpia estado |

### UI Structure

```
PhotoUpload
├── Input file (hidden, trigger por botón)
├── Preview de imagen
├── Campo "Descripción" (textarea)
├── Error message (condicional)
└── Botones
    ├── Cancelar
    └── Guardar
```
