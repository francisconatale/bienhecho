import { z } from "zod";

// --- Enums / Literals ---

export const JobStatusSchema = z.enum(["borrador", "presupuestado", "pagado"]);
export const TaskPrioritySchema = z.enum(["alta", "media", "baja"]);
export const VisitStatusSchema = z.enum(["planificada", "realizada", "cancelada"]);
export const TransaccionTipoSchema = z.enum(["cargo", "abono"]);
export const TransaccionOrigenSchema = z.enum(["automático", "manual"]);

// --- Models ---

export const ClientSchema = z.object({
  id: z.string().uuid().or(z.string()),
  user_id: z.string().uuid().optional(),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  telefono: z.string().min(1, "El teléfono es obligatorio"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  direccion: z.string().min(1, "La dirección es obligatoria"),
  notas: z.string().optional(),
  created_at: z.string(),
});

export const JobSchema = z.object({
  id: z.string(),
  user_id: z.string().uuid().optional(),
  cliente_id: z.string(),
  titulo: z.string().min(1, "El título es obligatorio"),
  direccion: z.string().min(1, "La dirección es obligatoria"),
  descripcion: z.string().optional(),
  presupuesto: z.number().min(0),
  estado: JobStatusSchema,
  fecha_inicio: z.string().optional(),
  fecha_fin_estimada: z.string().optional(),
  created_at: z.string(),
});

export const TaskSchema = z.object({
  id: z.string(),
  user_id: z.string().uuid().optional(),
  trabajo_id: z.string(),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  precio: z.number().nullable(),
  completada: z.boolean(),
  prioridad: TaskPrioritySchema.optional(),
  fecha_vencimiento: z.string().optional(),
  orden: z.number().int(),
});

export const VisitSchema = z.object({
  id: z.string(),
  user_id: z.string().uuid().optional(),
  trabajo_id: z.string(),
  fecha: z.string(),
  hora_inicio: z.string(),
  hora_fin: z.string().optional(),
  notas: z.string().optional(),
  estado: VisitStatusSchema,
  created_at: z.string(),
});

export const VisitaTareaSchema = z.object({
  visita_id: z.string(),
  tarea_id: z.string(),
  nota_progreso: z.string().optional(),
});

export const TaskPhotoSchema = z.object({
  id: z.string(),
  user_id: z.string().uuid().optional(),
  tarea_id: z.string(),
  url: z.string().url(),
  descripcion: z.string(),
  orden: z.number().int(),
  created_at: z.string(),
});

export const MaterialSchema = z.object({
  id: z.string(),
  user_id: z.string().uuid().optional(),
  trabajo_id: z.string(),
  nombre_material: z.string().min(1),
  cantidad: z.number().min(0.01),
  precio_unitario: z.number().min(0),
  subtotal: z.number().min(0),
  comprado: z.boolean(),
  created_at: z.string(),
});

export const CobroSchema = z.object({
  id: z.string(),
  user_id: z.string().uuid().optional(),
  trabajo_id: z.string(),
  monto_cobrado: z.number().min(0.01),
  fecha_cobro: z.string(),
  forma_pago: z.string().optional(),
  notas: z.string().optional(),
  created_at: z.string(),
});

export const TransaccionCuentaCorrienteSchema = z.object({
  id: z.string(),
  user_id: z.string().uuid().optional(),
  cliente_id: z.string(),
  tipo: TransaccionTipoSchema,
  monto: z.number().min(0.01),
  concepto: z.string().min(1),
  fecha: z.string(),
  referencia_trabajo_id: z.string().nullable(),
  referencia_cobro_id: z.string().nullable(),
  origen: TransaccionOrigenSchema,
  created_at: z.string(),
});
