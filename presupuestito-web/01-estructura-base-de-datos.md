# Estructura de base de datos

## Tablas

---

### `clientes`

Datos de contacto del cliente. Base de todo el sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid PK | Identificador único |
| `nombre` | string | Nombre completo o razón social |
| `telefono` | string | Teléfono de contacto |
| `email` | string | Email (opcional) |
| `direccion` | string | Dirección principal |
| `notas` | text | Notas libres sobre el cliente |
| `created_at` | timestamp | Fecha de creación |

---

### `trabajos`

El proyecto grande. Cada trabajo pertenece a un cliente y tiene presupuesto propio.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid PK | Identificador único |
| `cliente_id` | uuid FK → clientes | Cliente al que pertenece |
| `titulo` | string | Nombre descriptivo del trabajo |
| `direccion` | string | Dirección donde se realiza (puede diferir del cliente) |
| `descripcion` | text | Notas generales del trabajo |
| `presupuesto` | decimal | Monto total presupuestado |
| `estado` | string | `presupuestado` · `en_curso` · `listo_para_facturar` · `facturado` · `cobrado` |
| `fecha_inicio` | date | Fecha de inicio real o estimada |
| `fecha_fin_estimada` | date | Fecha estimada de finalización |
| `created_at` | timestamp | Fecha de creación |

---

### `tareas`

Ítems a facturar dentro de un trabajo. Algunas tienen precio, otras son solo descriptivas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid PK | Identificador único |
| `trabajo_id` | uuid FK → trabajos | Trabajo al que pertenece |
| `descripcion` | string | Qué es la tarea (ej: "Instalación de foco") |
| `precio` | decimal | Precio unitario (nullable — si es null, no se factura) |
| `completada` | boolean | Si la tarea ya fue realizada |
| `orden` | integer | Posición en la lista (para ordenar en la factura) |

---

### `visitas`

Instancias de trabajo en campo. Son registro interno, no van a la factura.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid PK | Identificador único |
| `trabajo_id` | uuid FK → trabajos | Trabajo al que corresponde |
| `fecha` | date | Día de la visita |
| `hora_inicio` | time | Hora de llegada |
| `hora_fin` | time | Hora de salida (nullable si aún no terminó) |
| `notas` | text | Qué se hizo, observaciones, etc. |
| `estado` | string | `planificada` · `realizada` · `cancelada` |
| `created_at` | timestamp | Fecha de creación del registro |

---

### `visita_tareas`

Tabla intermedia. Registra qué tareas se avanzaron en cada visita.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `visita_id` | uuid FK → visitas | Visita |
| `tarea_id` | uuid FK → tareas | Tarea avanzada en esa visita |
| `nota_progreso` | text | Nota específica sobre el avance (opcional) |

**Clave primaria compuesta:** `(visita_id, tarea_id)`

---

## Relaciones

```
CLIENTE (1) ──── (N) TRABAJO
TRABAJO  (1) ──── (N) TAREA
TRABAJO  (1) ──── (N) VISITA
VISITA   (N) ──── (N) TAREA  →  a través de VISITA_TAREAS
```

---

## Estados del trabajo

| Estado | Significado |
|--------|-------------|
| `presupuestado` | Se cargó el trabajo pero aún no arrancó |
| `en_curso` | Hay visitas realizadas o se arrancó |
| `listo_para_facturar` | Todas las tareas completadas |
| `facturado` | Se generó la factura |
| `cobrado` | El cliente pagó |

El estado se maneja manualmente, con la posibilidad futura de que pase automático a `listo_para_facturar` cuando todas las tareas estén completadas.
