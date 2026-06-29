# Quickstart: Ampliación de Tarea con Adjuntos de Fotos

**Date**: 2026-06-26
**Feature**: 001-tarea-adjuntos-fotos

## Prerequisites

- Node.js 18+ instalado
- Dependencias instaladas (`npm install`)
- App corriendo (`npm run dev`)

## Validación

### Escenario 1: Expandir tarea

1. Ir a `/trabajos/[id]` (ver detalle de un trabajo)
2. Hacer clic en una tarea de la lista
3. **Expected**: La tarea se expande mostrando un panel debajo
4. Hacer clic en la misma tarea
5. **Expected**: La tarea se colapsa

### Escenario 2: Subir foto

1. Expandir una tarea
2. Hacer clic en "Agregar foto"
3. Seleccionar una imagen del dispositivo (jpg, png, o webp)
4. **Expected**: Se muestra preview de la imagen
5. Escribir una descripción (ej: "Estado antes de la pintura")
6. Hacer clic en "Guardar"
7. **Expected**: La foto aparece en la galería de la tarea

### Escenario 3: Validación de archivos

1. Intentar subir un archivo que no sea imagen (ej: .pdf)
2. **Expected**: Error "Solo se permiten archivos jpg, png o webp"
3. Intentar subir una imagen mayor a 5MB
4. **Expected**: Error "La imagen no puede superar 5MB"

### Escenario 4: Eliminar foto

1. Tener una foto adjunta a una tarea
2. Hacer clic en el botón eliminar de la foto
3. **Expected**: Aparece modal de confirmación
4. Confirmar eliminación
5. **Expected**: La foto desaparece de la galería

### Escenario 5: Límite de fotos

1. Agregar 20 fotos a una tarea
2. Intentar agregar una más
3. **Expected**: Botón "Agregar foto" deshabilitado o mensaje de límite

## Archivos a crear/modificar

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/types/index.ts` | MODIFICAR | Agregar tipo `TaskPhoto` |
| `src/lib/store.ts` | MODIFICAR | Agregar state y actions para fotos |
| `src/lib/photo-storage.ts` | NUEVO | Capa de abstracción IndexedDB |
| `src/app/trabajos/[id]/components/task-item.tsx` | MODIFICAR | Agregar expand/collapse |
| `src/app/trabajos/[id]/components/task-photos.tsx` | NUEVO | Galería de fotos |
| `src/app/trabajos/[id]/components/photo-upload.tsx` | NUEVO | Componente de subida |
| `package.json` | MODIFICAR | Agregar dependencia `idb` |

## Dependencias

```bash
npm install idb
```

## Notas

- Las fotos se almacenan localmente (IndexedDB)
- No hay backend por ahora
- El usuario puede perder fotos si limpia datos del navegador
- Futuro: migrar a Supabase Storage cuando se implemente backend
