# Database Relations

> **Autoridad**: Este archivo es la fuente de verdad para cualquier
> cambio que involucre tablas, relaciones o datos del backend.
> Todo frontend que consulte o modifique datos DEBE respetar
> estrictamente lo definido aquí.

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
| `presupuesto` | decimal | no | Monto total presupuestado |
| `estado` | string | no | Estado actual del trabajo |
| `fecha_inicio` | date | sí | Fecha de inicio real o estimada |
| `fecha_fin_estimada` | date | sí | Fecha estimada de finalización |
| `created_at` | timestamp | no | Fecha de creación |

**Estados posibles** (`estado`):
- `presupuestado` — Se cargó pero aún no arrancó
- `en_curso` — Hay visitas realizadas o se arrancó
- `listo_para_facturar` — Todas las tareas completadas
- `facturado` — Se generó la factura
- `cobrado` — El cliente pagó

**Relaciones salientes:**
- Un trabajo tiene N tareas (`tareas.trabajo_id → trabajos.id`)
- Un trabajo tiene N visitas (`visitas.trabajo_id → trabajos.id`)

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

## Mapa de relaciones

```
CLIENTE (1) ──── (N) TRABAJO
TRABAJO  (1) ──── (N) TAREA
TRABAJO  (1) ──── (N) VISITA
VISITA   (N) ──── (N) TAREA  →  a través de VISITA_TAREAS
```

---

## Datos que cada vista necesita

### Dashboard
- Próximas visitas: `visitas` where `estado = 'planificada'` AND `fecha` en próximos 7 días
- Trabajos activos: `trabajos` where `estado = 'en_curso'`
- Trabajos listos para facturar: `trabajos` where `estado = 'listo_para_facturar'`
- Datos necesarios: trabajo título, cliente nombre, fecha de visita, presupuesto

### Lista de clientes
- Todos los `clientes`
- Cantidad de trabajos activos por cliente (JOIN con `trabajos`)
- Total histórico facturado (futuro, sumatoria de facturas)

### Vista de trabajo (pantalla principal)
- **Header**: título, cliente (nombre), dirección, presupuesto, estado, fechas
- **Barra de progreso**: porcentaje de `tareas` con `completada = true` / total tareas
- **Lista de tareas**: todas las `tareas` del trabajo, con checkbox y precio
- **Lista de visitas**: todas las `visitas` del trabajo, realizadas y planificadas
- **Notas**: campo `descripcion` del trabajo (editable inline)
- **Total estimado**: suma de `tareas.precio` where precio IS NOT NULL

### Agenda / calendario
- `visitas` agrupadas por semana
- Datos: fecha, hora_inicio, hora_fin, trabajo título, cliente nombre

### Generación de factura
- `tareas` del trabajo where `precio IS NOT NULL`
- Líneas: descripción + precio de cada tarea
- Total: suma de precios
- Estados para generar: trabajo debe estar en `listo_para_facturar`
- Al generar: cambio estado a `facturado`

---

##flujo de estados

```
presupuestado ──(arrancó / hay visitas)──▶ en_curso
en_curso ──(todas las tareas completadas)──▶ listo_para_facturar
listo_para_facturar ──(factura generada)──▶ facturado
facturado ──(cliente pagó)──▶ cobrado
```

---

##flujo de creación

```
1. Crear CLIENTE
2. Crear TRABAJO (asociado a CLIENTE)
3. Agregar TAREAS al TRABAJO (con o sin precio)
4. Agendar VISITAS al TRABAJO
5. En cada VISITA, marcar TAREAS avanzadas (visita_tareas)
6. Cuando todas las tareas completadas → estado listo_para_facturar
7. Generar FACTURA desde el trabajo
8. Marcar como cobrado cuando el cliente pague
```
