# Database Relations

> **Autoridad**: Este archivo es la fuente de verdad para cualquier
> cambio que involucre tablas, relaciones o datos del backend.
> Todo frontend que consulte o modifique datos DEBE respetar
> estrictamente lo definido aquí.

> **Estado actual**: La app usa Supabase (PostgreSQL) con autenticación
> y Row Level Security (RLS). Cada tabla tiene `user_id` para
> single-tenancy. Migraciones en `supabase/migrations/`.

---

## Tablas y_campos

### `clientes`

Base de todo el sistema. Datos de contacto del cliente.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
| `user_id` | uuid FK | no | Usuario propietario (`→ auth.users.id`) |
| `nombre` | string | no | Nombre completo o razón social |
| `telefono` | string | sí | Teléfono de contacto |
| `email` | string | sí | Email (opcional) |
| `direccion` | string | no | Dirección principal |
| `notas` | text | sí | Notas libres sobre el cliente |
| `created_at` | timestamp | no | Fecha de creación |

**Relaciones salientes:**
- Un cliente tiene N trabajos (`trabajos.cliente_id → clientes.id`)

---

### `trabajos`

El proyecto grande. Cada trabajo pertenece a un cliente y tiene presupuesto propio.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
| `user_id` | uuid FK | no | Usuario propietario (`→ auth.users.id`) |
| `cliente_id` | uuid FK | no | Cliente al que pertenece (`→ clientes.id`) |
| `titulo` | string | no | Nombre descriptivo del trabajo |
| `direccion` | string | no | Dirección donde se realiza (puede diferir del cliente) |
| `descripcion` | text | sí | Notas generales del trabajo |
| `presupuesto` | decimal | no | Suma automática de precios de tareas (mantenida por triggers) |
| `total_estimado` | numeric(10,2) | no (default 0) | Suma de precios de tareas + subtotales de materiales. Fuente de verdad del total mostrado. |
| `total_cobrado` | numeric(10,2) | no (default 0) | Suma de `cobros.monto_cobrado` del trabajo. |
| `saldo_pendiente` | numeric(10,2) | no (default 0) | `total_estimado - total_cobrado`. Admite negativos (caso "A favor"). |
| `estado` | string | no | Estado actual del trabajo |
| `fecha_inicio` | date | sí | Fecha de inicio real o estimada |
| `fecha_fin_estimada` | date | sí | Fecha estimada de finalización |
| `created_at` | timestamp | no | Fecha de creación |

**Estados posibles** (`estado`):
- `borrador` — Trabajo creado, aún no se emitió presupuesto
- `presupuestado` — Presupuesto emitido, pendiente de cobro
- `pagado` — Total cobrado, trabajo finalizado (solo lectura)

**Relaciones salientes:**
- Un trabajo tiene N tareas (`tareas.trabajo_id → trabajos.id`)
- Un trabajo tiene N visitas (`visitas.trabajo_id → trabajos.id`)
- Un trabajo tiene N cobros (`cobros.trabajo_id → trabajos.id`)
- Un trabajo tiene N materiales (`materiales.trabajo_id → trabajos.id`)

---

### `tareas`

Ítems a facturar dentro de un trabajo. Algunas tienen precio, otras son solo descriptivas.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
| `user_id` | uuid FK | no | Usuario propietario (`→ auth.users.id`) |
| `trabajo_id` | uuid FK | no | Trabajo al que pertenece (`→ trabajos.id`) |
| `descripcion` | string | no | Qué es la tarea (ej: "Instalación de foco") |
| `cantidad` | decimal | sí | Cantidad de unidades (default `1`) |
| `precio` | decimal | sí | Precio unitario. Si es null, NO se factura |
| `precio_unitario` | decimal | sí | Precio unitario (duplicado para compatibilidad del servicio) |
| `completada` | boolean | no | Si la tarea ya fue realizada |
| `prioridad` | string | sí | Nivel de urgencia (`alta`, `media`, `baja`) para agrupar |
| `fecha_vencimiento`| date | sí | Fecha límite para realizar la tarea (opcional) |
| `orden` | integer | no | Posición en la lista (para ordenar en la factura) |

**Relaciones salientes:**
- Una tarea aparece en N visitas (`visita_tareas.tarea_id → tareas.id`)

**Reglas de negocio:**
- Si `precio` es null → la tarea es descriptiva, NO va a la factura
- Si `precio` tiene valor → es una línea de factura
- El `orden` determina el orden en la factura
- Desde la lista operativa se puede alternar la `prioridad` (urgente/alta) y eliminar tareas de forma rápida (in-place).

### Enum: Prioridad

| Valor | Descripción |
|-------|-------------|
| `alta` | Urgente. Tareas que deben resolverse hoy. |
| `media` | Próximo. Tareas agendadas en la cola de trabajo. |
| `baja` | Sin apuro. Mantenimiento o detalles menores. |

---

### `visitas`

Instancias de trabajo en campo. Son registro interno, NO van a la factura.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
| `user_id` | uuid FK | no | Usuario propietario (`→ auth.users.id`) |
| `trabajo_id` | uuid FK | no | Trabajo al que corresponde (`→ trabajos.id`) |
| `fecha` | date | no | Día de la visita |
| `hora_inicio` | time | no | Hora de llegada |
| `hora_fin` | time | sí | Hora de salida (nullable si aún no terminó) |
| `notas` | text | sí | Qué se hizo, observaciones, etc. |
| `estado` | string | no | Estado de la visita |
| `created_at` | timestamp | no | Fecha de creación del registro |

**Estados posibles** (`estado`):
- `planificada` — Agendada, aún no fue
- `realizada` — Se hizo
- `cancelada` — No se realizó

**Relaciones salientes:**
- Una visita avanza N tareas (`visita_tareas.visita_id → visitas.id`)

---

### `visita_tareas`

Tabla intermedia. Registra qué tareas se avanzaron en cada visita.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `visita_id` | uuid FK | no | Visita (`→ visitas.id`) |
| `tarea_id` | uuid FK | no | Tarea avanzada en esa visita (`→ tareas.id`) |
| `nota_progreso` | text | sí | Nota específica sobre el avance |

**Clave primaria compuesta:** `(visita_id, tarea_id)`

---

### `task_photos`

Fotos asociadas a una tarea (progreso, evidencia, etc.).

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
| `user_id` | uuid FK | no | Usuario propietario (`→ auth.users.id`) |
| `tarea_id` | uuid FK | no | Tarea a la que pertenece (`→ tareas.id`) |
| `url` | string | no | URL pública de la imagen |
| `descripcion` | text | sí | Descripción opcional de la foto |
| `orden` | integer | no | Posición en la galería |
| `created_at` | timestamp | no | Fecha de creación |

---

### `transacciones`

Movimientos de cuenta corriente. Se generan automáticamente al emitir presupuestos o registrar cobros, pero pueden ser manuales.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
| `user_id` | uuid FK | no | Usuario propietario (`→ auth.users.id`) |
| `cliente_id` | uuid FK | no | Cliente al que pertenece (`→ clientes.id`) |
| `tipo` | string | no | `cargo` o `abono` |
| `monto` | decimal | no | Monto de la transacción |
| `concepto` | string | no | Descripción del movimiento |
| `fecha` | date | no | Fecha de la transacción |
| `referencia_trabajo_id` | uuid FK | sí | Trabajo relacionado (`→ trabajos.id`) |
| `referencia_cobro_id` | uuid FK | sí | Cobro relacionado (`→ cobros.id`) |
| `origen` | string | no | `automático` o `manual` |
| `created_at` | timestamp | no | Fecha de creación |

**Tipos** (`tipo`):
- `cargo` — Deuda a favor del usuario (ej: emisión de presupuesto)
- `abono` — Pago registrado (ej: cobro)

**Orígenes** (`origen`):
- `automático` — Generado por triggers del sistema
- `manual` — Creado por el usuario directamente

---

### `cobros`

Registro de pagos recibidos por un trabajo.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
| `user_id` | uuid FK | no | Usuario propietario (`→ auth.users.id`) |
| `trabajo_id` | uuid FK | no | Trabajo al que pertenece (`→ trabajos.id`) |
| `monto_cobrado` | decimal | no | Monto recibido |
| `fecha_cobro` | date | no | Fecha en que se cobró |
| `forma_pago` | string | sí | Efectivo, Transferencia, Cheque, etc. |
| `notas` | text | sí | Comentarios adicionales |
| `created_at` | timestamp | no | Fecha de creación |

---

### `materiales`

Materiales utilizados o presupuestados para un trabajo.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
| `user_id` | uuid FK | no | Usuario propietario (`→ auth.users.id`) |
| `trabajo_id` | uuid FK | no | Trabajo al que pertenece (`→ trabajos.id`) |
| `nombre_material` | string | no | Nombre del material |
| `cantidad` | decimal | no | Cantidad utilizada |
| `precio_unitario` | decimal | no | Precio por unidad |
| `subtotal` | decimal | no | cantidad × precio_unitario (forzado por trigger, la BD es autoridad) |
| `comprado` | boolean | no | Indica si el material ya fue adquirido (default: false) |
| `created_at` | timestamp | no | Fecha de creación |

---

## Funciones y triggers

Los totales de `trabajos` (`presupuesto`, `total_estimado`, `total_cobrado`, `saldo_pendiente`) y el auto-paso a `pagado` son mantenidos **únicamente** por triggers. El frontend los lee, nunca los escribe.

| Trigger | Tabla | Momento / Evento | Función |
|---------|-------|------------------|---------|
| `on_tarea_change_recalcular` | `tareas` | AFTER INSERT OR DELETE OR UPDATE OF `precio, cantidad, precio_unitario` | `recalcular_trabajo_totales` |
| `on_material_subtotal_sync` | `materiales` | BEFORE INSERT OR UPDATE OF `cantidad, precio_unitario` | `sync_material_subtotal` |
| `on_material_change_recalcular` | `materiales` | AFTER INSERT OR DELETE OR UPDATE OF `cantidad, precio_unitario, subtotal` | `recalcular_trabajo_totales` |
| `on_cobro_change_recalcular` | `cobros` | AFTER INSERT OR DELETE OR UPDATE OF `monto_cobrado` | `recalcular_trabajo_totales` |
| `on_cobro_insert` | `cobros` | AFTER INSERT | `emitir_transaccion_cobro` |
| `on_cobro_update_sync_abono` | `cobros` | AFTER UPDATE OF `monto_cobrado, fecha_cobro` | `sync_abono_cobro_update` |
| `on_cobro_delete_revert` | `cobros` | AFTER DELETE | `revertir_abono_cobro_delete` |
| `on_trabajo_estado_presupuestado` | `trabajos` | AFTER UPDATE OF `estado` | `emitir_transaccion_presupuesto` |

**Eliminados** (reemplazados por `recalcular_trabajo_totales`): `on_tarea_change_update_presupuesto` + `update_trabajo_presupuesto()`, `on_cobro_insert_check_pagado` + `check_trabajo_pagado()`.

**Funciones:**

- `recalcular_trabajo_totales()` — RECALCULA `presupuesto = SUM(tareas.precio)`, `total_estimado = presupuesto + SUM(materiales.subtotal)`, `total_cobrado = SUM(cobros.monto_cobrado)`, `saldo_pendiente = total_estimado - total_cobrado`; si `estado = presupuestado` y `saldo_pendiente <= 0` pasa a `pagado`.
- `sync_material_subtotal()` — BEFORE trigger: fuerza `NEW.subtotal = NEW.cantidad * NEW.precio_unitario`.
- `sync_abono_cobro_update()` — al actualizar un cobro, ajusta el `abono` automático (`monto`, `fecha`, `concepto`) de `transacciones` con `referencia_cobro_id = NEW.id`, `tipo = abono`, `origen = automático`.
- `revertir_abono_cobro_delete()` — al borrar un cobro, inserta un `cargo` de anulación `"Anulación de cobro: {titulo}"` (el abono original se conserva como rastro, saldo neto cero).

---

### `get_smart_suggestions()` (RPC)

Función SQL (`security invoker`, RLS activo) que devuelve sugerencias de agenda:
trabajos con tareas críticas (sin completar, prioridad `alta`/`media`) que **no** tienen
una visita futura (hoy o después, y no `cancelada`).

**Parámetros:** ninguno (filtra por `auth.uid()` vía RLS).

**Retorna:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `job_id` | uuid | Trabajo sugerido |
| `job_title` | text | Título del trabajo |
| `client_name` | text | Nombre del cliente (`Cliente Desconocido` si falta) |
| `critical_tasks_count` | bigint | Cantidad de tareas críticas |
| `high_priority_count` | bigint | Cantidad de tareas con prioridad `alta` |
| `critical_tasks` | jsonb | Tareas críticas ordenadas (alta primero, luego por `orden`) |

**Orden:** por `high_priority_count` DESC, luego `critical_tasks_count` DESC.

---

## Mapa de relaciones

```
CLIENTE (1) ──── (N) TRABAJO
TRABAJO  (1) ──── (N) TAREA
TAREA    (1) ──── (N) TASK_PHOTO
TRABAJO  (1) ──── (N) VISITA
TRABAJO  (1) ──── (N) COBRO
TRABAJO  (1) ──── (N) MATERIAL
CLIENTE  (1) ──── (N) TRANSACCION
VISITA   (N) ──── (N) TAREA                      →  a través de VISITA_TAREAS
```

---

## Datos que cada vista necesita

### Dashboard
- Próximas visitas: `visitas` where `estado = 'planificada'` AND `fecha` en próximos 7 días
- Trabajos activos: `trabajos` where `estado = 'presupuestado'`
- Datos necesarios: trabajo título, cliente nombre, fecha de visita, presupuesto

### Lista de clientes
- Todos los `clientes`
- Cantidad de trabajos activos por cliente (JOIN con `trabajos`)
- Total histórico facturado (futuro, sumatoria de facturas)

### Vista de trabajo (pantalla principal)
- **Header**: título, cliente (nombre), dirección, estado, fechas
- **Barra de progreso**: porcentaje de `tareas` con `completada = true` / total tareas
- **Lista de tareas**: todas las `tareas` del trabajo, con checkbox, precio, y acciones rápidas (cambiar prioridad, eliminar)
- **Lista de visitas**: todas las `visitas` del trabajo, realizadas y planificadas
- **Cobros**: listado de `cobros` del trabajo con saldo pendiente
- **Materiales**: listado de `materiales` del trabajo, con costo total
- **Notas**: campo `descripcion` del trabajo (editable inline)
- **Total estimado**: `trabajos.total_estimado` (persistido: suma de `tareas.precio` + `materiales.subtotal`)
- **Total materiales**: suma de `materiales.subtotal` (en vivo para display)
- **Saldo pendiente**: `trabajos.saldo_pendiente` (persistido: `total_estimado - total_cobrado`)

### Agenda / calendario
- `visitas` agrupadas por semana
- Datos: fecha, hora_inicio, hora_fin, trabajo título, cliente nombre

### Generación de presupuesto PDF
- `tareas` del trabajo where `precio IS NOT NULL`, ordenadas por `orden`
- Líneas: descripción + precio de cada tarea
- Total: suma de precios
- Desde `borrador`: muestra diálogo "Emitir" (pasa a presupuestado) o "Solo guardar PDF" (sigue borrador)
- Desde `presupuestado` o `pagado`: botón "Ver PDF" que regenera y descarga directamente sin diálogo

### Cuentas a cobrar (por trabajo)
- **Cobros registrados**: `cobros` del trabajo, con fecha y forma de pago
- **Saldo pendiente**: `trabajos.saldo_pendiente` (persistido por triggers)

### Materiales (por trabajo)
- Todos los `materiales` del trabajo
- Costo total: suma de `subtotal`

---

## Flujo de estados

```
borrador ──(emitir presupuesto)──▶ presupuestado
presupuestado ──(cobro registrado / marcar pagado)──▶ pagado
```

**Reglas:**
- `pagado` es terminal: no se puede modificar el trabajo ni generar presupuesto sin advertencia
- Desde `borrador` se puede generar PDF y guardarlo sin emitir (sigue en borrador)
- Desde `presupuestado` y `pagado` se puede ver/descargar el PDF ("Ver PDF")
- Al marcar "Pagado" manualmente se registra automáticamente un cobro por el saldo restante

---

## Flujo simple (solo presupuestar y cobrar)

```
1. Crear CLIENTE
2. Crear TRABAJO (asociado a CLIENTE, estado: borrador)
3. Agregar TAREAS al TRABAJO (con precio)
4. Generar PRESUPUESTO PDF → diálogo: "Emitir" (pasa a presupuestado) o "Solo guardar PDF"
5. Enviar presupuesto al cliente
6. Cliente aprueba → registrar COBROS o "Marcar como Pagado"
7. Si SUM(cobros) >= total → auto-pasa a pagado
```

**No se usan**: visitas, agenda, tabla `visita_tareas`.

---

## Flujo completo (con seguimiento de campo)

```
 1. Crear CLIENTE
 2. Crear TRABAJO (asociado a CLIENTE, estado: borrador)
 3. Agregar TAREAS al TRABAJO (con o sin precio)
 4. Generar PRESUPUESTO PDF → emitir (pasa a presupuestado)
 5. Agendar VISITAS al TRABAJO
 6. En cada VISITA, marcar TAREAS avanzadas (visita_tareas)
 7. (Opcional) Registrar MATERIALES utilizados
 8. Registrar COBROS o "Marcar como Pagado"
 9. Si SUM(cobros) >= total → auto-pasa a pagado
```

**Se usan**: todas las tablas y funcionalidades.

---

## Dos tipos de usuario

| Característica | Tipo A (simple) | Tipo B (completo) |
|----------------|-----------------|-------------------|
| Presupuesto PDF | Sí | Sí |
| Visitas | No | Sí |
| Agenda | No | Sí |
| Barra de progreso | No | Sí |
| Tabla `visita_tareas` | No | Sí |
| Cobros | Sí | Sí |
| Materiales | Opcional | Sí |

---

## Tablas del chat de tareas (asistente IA)

Backend de la arquitectura de interpretación de tareas por chat (spec `001-voice-task-arch`).
El backend (Server Action `design-lab/gemini/actions.ts`) orquesta el flujo y sirve **una**
tarea de clarificación a la vez. RLS multi-tenancy por `conversations.user_id`.

### `conversations`

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
| `created_at` | timestamptz | no | Fecha de creación |
| `status` | text | no | Estado de la conversación |
| `user_id` | uuid FK | no | Usuario propietario / persona (`→ auth.users.id`) |
| `cliente_id` | uuid FK | sí | Cliente asociado a la conversación (`→ clientes.id`, ON DELETE SET NULL) |
| `trabajo_id` | uuid FK | sí | Trabajo vinculado; las tareas de la conversación pertenecen a este trabajo (`→ trabajos.id`, ON DELETE SET NULL) |

**Enumerado `status`:**
- `IN_PROGRESS` — Conversación activa
- `COMPLETED` — Conversación finalizada

**Relaciones salientes:**
- Una conversación tiene N tareas (`tasks_snapshot.conversation_id → conversations.id`)
- Una conversación tiene N pasos pendientes (`pending_steps.conversation_id → conversations.id`)
- Una conversación se vincula a UN trabajo (`conversations.trabajo_id → trabajos.id`)

### `tasks_snapshot` (tareas detectadas por el LLM)

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
| `conversation_id` | uuid FK | no | Conversación a la que pertenece (`→ conversations.id`, ON DELETE CASCADE) |
| `description` | text | no | Descripción del trabajo detectado |
| `quantity` | numeric | sí | Cantidad (null si falta aclarar) |
| `precio` | numeric | sí | Precio unitario (null si falta aclarar) |
| `status` | text | no | Estado de la tarea |
| `created_at` | timestamptz | no | Fecha de creación |

**Enumerado `status`:**
- `PENDING` — Falta completar algún dato (cantidad o precio)
- `COMPLETED` — Cantidad y precio definidos

### `pending_steps` (cola de aclaraciones)

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
| `conversation_id` | uuid FK | no | Conversación (`→ conversations.id`, ON DELETE CASCADE) |
| `task_id` | uuid FK | no | Tarea a aclarar (`→ tasks_snapshot.id`, ON DELETE CASCADE) |
| `step_type` | text | no | Qué se está aclarando |
| `status` | text | no | Estado del paso |
| `attempts` | int | no | Contador de reintentos (límite: 3) |
| `created_at` | timestamptz | no | Fecha de creación |

**Enumerado `step_type`:**
- `CLARIFY_DATOS` — Faltan datos de la tarea (cantidad y/o precio). Se piden juntos si faltan ambos; el prompt deriva qué falta de la tarea (no hay cases por campo)
- `CLARIFY_CANTIDAD_ADICIONAL` — El usuario quiere SUMAR unidades a una tarea ya registrada pero no dijo cuántas; se pregunta cuántas agregar

**Enumerado `status`:**
- `PENDING` — Esperando la respuesta del usuario
- `RESOLVED` — Dato aclarado correctamente
- `FAILED` — Superó el límite de 3 intentos; requiere intervención manual

**Reglas de negocio:**
- Solo un `pending_steps` en estado `PENDING` se sirve a la vez por conversación
- Una tarea está incompleta si `quantity` **o** `precio` es null. Si faltan ambas se piden juntas en una sola pregunta; si el usuario solo aporta una, el próximo turno pregunta por la que sigue faltando
- Al llegar a 3 `attempts`, el paso pasa a `FAILED` y no se vuelve a preguntar
- Al completarse una tarea incompleta y no existir un paso activo, se encola la siguiente aclaración
- El matching de tareas existentes lo decide la IA usando el contexto de la conversación (descripción exacta). Para un aumento de cantidad, si el usuario dijo cuántas, el backend SUMA y resuelve en el mismo turno (`add: true` + `quantity`); si no lo dijo, encola `CLARIFY_CANTIDAD_ADICIONAL`

**Vínculo con trabajos (carga al sistema):**
- Una conversación se vincula a UN trabajo (`conversations.trabajo_id`) y un cliente (`conversations.cliente_id`)
- Al cargar, se crea el `trabajo` si no existe, se setea `conversations.trabajo_id`, y las tareas del chat se copian como `tareas` de ese trabajo (sin duplicar: se compara por descripción normalizada contra las tareas existentes del trabajo)
- El `quantity` y `precio` del chat se copian a `tareas.cantidad` y `tareas.precio` / `precio_unitario`; si `precio` es null la tarea es descriptiva y NO se factura
- Las tareas nuevas que aparezcan en turnos posteriores se anexan al mismo trabajo vinculado


**La app no fuerza ninguno de los dos flujos.** Las visitas y materiales son opcionales.
