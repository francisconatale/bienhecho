# Database Relations

> **Autoridad**: Este archivo es la fuente de verdad para cualquier
> cambio que involucre tablas, relaciones o datos del backend.
> Todo frontend que consulte o modifique datos DEBE respetar
> estrictamente lo definido aquí.

> **Estado actual**: Por ahora los datos viven en mocks (Zustand store
> en memoria). Los types en `src/types/index.ts` DEBEN respetar esta
> estructura. Cuando se implemente la DB real, las migraciones se
> basan en este archivo.

---

## Tablas y_campos

### `clientes`

Base de todo el sistema. Datos de contacto del cliente.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
| `nombre` | string | no | Nombre completo o razón social |
| `telefono` | string | no | Teléfono de contacto |
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
| `cliente_id` | uuid FK | no | Cliente al que pertenece (`→ clientes.id`) |
| `titulo` | string | no | Nombre descriptivo del trabajo |
| `direccion` | string | no | Dirección donde se realiza (puede diferir del cliente) |
| `descripcion` | text | sí | Notas generales del trabajo |
| `presupuesto` | decimal | no | Suma automática de precios de tareas (no influye en cobro final) |
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
| `trabajo_id` | uuid FK | no | Trabajo al que pertenece (`→ trabajos.id`) |
| `descripcion` | string | no | Qué es la tarea (ej: "Instalación de foco") |
| `precio` | decimal | sí | Precio unitario. Si es null, NO se factura |
| `completada` | boolean | no | Si la tarea ya fue realizada |
| `orden` | integer | no | Posición en la lista (para ordenar en la factura) |

**Relaciones salientes:**
- Una tarea aparece en N visitas (`visita_tareas.tarea_id → tareas.id`)

**Reglas de negocio:**
- Si `precio` es null → la tarea es descriptiva, NO va a la factura
- Si `precio` tiene valor → es una línea de factura
- El `orden` determina el orden en la factura

---

### `visitas`

Instancias de trabajo en campo. Son registro interno, NO van a la factura.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
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

### `cobros`

Registro de pagos recibidos por un trabajo.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
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
| `trabajo_id` | uuid FK | no | Trabajo al que pertenece (`→ trabajos.id`) |
| `nombre_material` | string | no | Nombre del material |
| `cantidad` | decimal | no | Cantidad utilizada |
| `precio_unitario` | decimal | no | Precio por unidad |
| `subtotal` | decimal | no | cantidad × precio_unitario |
| `created_at` | timestamp | no | Fecha de creación |

---

## Mapa de relaciones

```
CLIENTE (1) ──── (N) TRABAJO
TRABAJO  (1) ──── (N) TAREA
TRABAJO  (1) ──── (N) VISITA
TRABAJO  (1) ──── (N) COBRO
TRABAJO  (1) ──── (N) MATERIAL
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
- **Lista de tareas**: todas las `tareas` del trabajo, con checkbox y precio
- **Lista de visitas**: todas las `visitas` del trabajo, realizadas y planificadas
- **Cobros**: listado de `cobros` del trabajo con saldo pendiente
- **Materiales**: listado de `materiales` del trabajo, con costo total
- **Notas**: campo `descripcion` del trabajo (editable inline)
- **Total estimado**: suma de `tareas.precio` where precio IS NOT NULL
- **Total materiales**: suma de `materiales.subtotal`
- **Saldo pendiente**: `SUM(tareas.precio WHERE precio IS NOT NULL) + SUM(materiales.subtotal) - SUM(cobros.monto_cobrado)`

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
- **Saldo pendiente**: `SUM(tareas.precio WHERE precio IS NOT NULL) + SUM(materiales.subtotal) - SUM(cobros.monto_cobrado)`

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

**La app no fuerza ninguno de los dos flujos.** Las visitas y materiales son opcionales.
