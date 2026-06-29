# Data Model: Alineación con DB

## Types (src/types/index.ts)

### Client

```typescript
export interface Client {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  direccion: string;
  notas?: string;
  created_at: string;
}
```

### Job

```typescript
export type JobStatus =
  | "presupuestado"
  | "en_curso"
  | "listo_para_facturar"
  | "facturado"
  | "cobrado";

export interface Job {
  id: string;
  cliente_id: string;
  titulo: string;
  direccion: string;
  descripcion?: string;
  presupuesto: number;
  estado: JobStatus;
  fecha_inicio?: string;
  fecha_fin_estimada?: string;
  created_at: string;
}
```

### Task

```typescript
export interface Task {
  id: string;
  trabajo_id: string;
  descripcion: string;
  precio: number | null;
  completada: boolean;
  orden: number;
}
```

### Visit (future, not implemented)

```typescript
export type VisitStatus = "planificada" | "realizada" | "cancelada";

export interface Visit {
  id: string;
  trabajo_id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin?: string;
  notas?: string;
  estado: VisitStatus;
  created_at: string;
}
```

### VisitaTarea (future, not implemented)

```typescript
export interface VisitaTarea {
  visita_id: string;
  tarea_id: string;
  nota_progreso?: string;
}
```

## Relationships

```
Client (1) ──── (N) Job
Job    (1) ──── (N) Task
Job    (1) ──── (N) Visit      [future]
Visit  (N) ──── (N) Task       [future, via VisitaTarea]
```

## Derived Values

| Value | Calculation |
|-------|-------------|
| Total estimado | `SUM(task.precio) WHERE precio IS NOT NULL` |
| Progreso | `COUNT(task WHERE completada = true) / COUNT(task)` |
| Tareas facturables | `tasks WHERE precio IS NOT NULL` |

## State Machine

```
presupuestado ──▶ en_curso ──▶ listo_para_facturar ──▶ facturado ──▶ cobrado
```

- `presupuestado`: initial state, job created but not started
- `en_curso`: work has begun (manual or auto from first visit)
- `listo_para_facturar`: all tasks completed
- `facturado`: invoice generated
- `cobrado`: client paid
