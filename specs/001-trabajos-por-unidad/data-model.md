# Data Model Updates

## Task (Trabajo)

### Types Update (`src/types/task.ts`)
```typescript
export interface Task {
  id: string;
  trabajo_id: string;
  descripcion: string;
  cantidad: number;           // NUEVO
  precio_unitario: number;    // NUEVO
  precio: number | null;      // Total calculado
  completada: boolean;
  orden: number;
}
```

### Zod Schema Update (`src/lib/schemas.ts`)
```typescript
export const TaskSchema = z.object({
  id: z.string(),
  user_id: z.string().uuid().optional(),
  trabajo_id: z.string(),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  cantidad: z.number().min(0.01),         // NUEVO
  precio_unitario: z.number().min(0),     // NUEVO
  precio: z.number().nullable(),          // Total calculado (cantidad * precio_unitario)
  completada: z.boolean(),
  // ... resto igual
});
```

### Database Updates (Supabase `tareas` table)
- **`cantidad`**: `NUMERIC`, default `1`.
- **`precio_unitario`**: `NUMERIC`, nullable (or default `0`).
