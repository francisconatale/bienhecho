# Store Interface: Ciclo de Vida del Presupuesto

> Contrato que debe exponer el Zustand store para la gestión de estados.

## `JobStore` (métodos a implementar/modificar)

```typescript
interface JobStore {
  // --- Lectura ---
  jobs: Job[];
  getJobById(id: string): Job | undefined;

  // --- Mutaciones ---
  createJob(data: CreateJobInput): Job;
  //   → asigna estado "borrador" automáticamente

  updateJobStatus(jobId: string, newStatus: JobStatus): void;
  //   → valida transición permitida según data-model.md

  // --- Post-PDF ---
  confirmPdfEmit(jobId: string): void;
  //   → cambia a "presupuestado" (emitir formalmente)

  // --- Pagado ---
  markAsPaid(jobId: string): void;
  //   → cambia a "pagado" manualmente

  // Se llama automáticamente después de registrar un cobro.
  // Si sum(cobros) >= (job.presupuesto + materiales.total), cambia a "pagado".
  checkAndAutoPaid(jobId: string): void;
}
```

## Tipos exportados

```typescript
type JobStatus = "borrador" | "presupuestado" | "pagado";

interface CreateJobInput {
  cliente_id: string;
  titulo: string;
  direccion: string;
  descripcion?: string;
  presupuesto: number;
}
```

## Transiciones validadas

| Desde | Hacia | Condición |
|-------|-------|-----------|
| `borrador` | `presupuestado` | PDF generado + usuario eligió "Emitir presupuesto" en diálogo |
| `presupuestado` | `pagado` | Usuario hizo clic en "Marcar como pagado" |
| `pagado` | `presupuestado` | Solo con confirmación explícita (advertencia) |
