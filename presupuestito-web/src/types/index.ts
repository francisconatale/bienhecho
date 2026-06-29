import { z } from "zod";
import {
  ClientSchema,
  JobStatusSchema,
  JobSchema,
  TaskPrioritySchema,
  TaskSchema,
  VisitStatusSchema,
  VisitSchema,
  VisitaTareaSchema,
  TaskPhotoSchema,
  MaterialSchema,
  CobroSchema,
  TransaccionTipoSchema,
  TransaccionOrigenSchema,
  TransaccionCuentaCorrienteSchema,
} from "@/lib/schemas";

// --- Tipos inferidos desde Zod ---

export type JobStatus = z.infer<typeof JobStatusSchema>;
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;
export type VisitStatus = z.infer<typeof VisitStatusSchema>;
export type TransaccionTipo = z.infer<typeof TransaccionTipoSchema>;
export type TransaccionOrigen = z.infer<typeof TransaccionOrigenSchema>;

export type Client = z.infer<typeof ClientSchema>;
export type Job = z.infer<typeof JobSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Visit = z.infer<typeof VisitSchema>;
export type VisitaTarea = z.infer<typeof VisitaTareaSchema>;
export type TaskPhoto = z.infer<typeof TaskPhotoSchema>;
export type Material = z.infer<typeof MaterialSchema>;
export type Cobro = z.infer<typeof CobroSchema>;
export type TransaccionCuentaCorriente = z.infer<typeof TransaccionCuentaCorrienteSchema>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
