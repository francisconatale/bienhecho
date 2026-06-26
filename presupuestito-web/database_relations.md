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
- Un trabajo tiene N entregas parciales (`entregas_parciales.trabajo_id → trabajos.id`)
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

### `entregas_parciales`

Hitos o cuotas contra el presupuesto de un trabajo. Cada trabajo puede tener N entregas.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
| `trabajo_id` | uuid FK | no | Trabajo al que pertenece (`→ trabajos.id`) |
| `numero_entrega` | integer | no | Número correlativo por trabajo (1, 2, 3...) |
| `concepto` | string | sí | Ej: "Anticipo", "Avance 50%", "Materiales gruesa" |
| `monto_entrega` | decimal | no | Monto comprometido de esta entrega |
| `fecha_estimada` | date | sí | Fecha tentativa de cobro |
| `created_at` | timestamp | no | Fecha de creación |

**Relaciones salientes:**
- Una entrega parcial tiene N cobros (`cobros.entrega_parcial_id → entregas_parciales.id`)

---

### `cobros`

Registro de pagos recibidos. Opcionalmente vinculados a una entrega parcial.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | uuid PK | no | Identificador único |
| `trabajo_id` | uuid FK | no | Trabajo al que pertenece (`→ trabajos.id`) |
| `entrega_parcial_id` | uuid FK | sí | Entrega asociada (`→ entregas_parciales.id`). Null cuando el cobro no corresponde a una entrega específica (ej: pago anticipado) |
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
TRABAJO  (1) ──── (N) ENTREGA_PARCIAL
TRABAJO  (1) ──── (N) COBRO
TRABAJO  (1) ──── (N) MATERIAL
VISITA   (N) ──── (N) TAREA                      →  a través de VISITA_TAREAS
ENTREGA_PARCIAL (1) ──── (N) COBRO               (relación opcional)
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
- **Entregas y cobros**: listado de `entregas_parciales` con su estado de cobro y saldo pendiente
- **Materiales**: listado de `materiales` del trabajo, con costo total
- **Notas**: campo `descripcion` del trabajo (editable inline)
- **Total estimado**: suma de `tareas.precio` where precio IS NOT NULL
- **Total materiales**: suma de `materiales.subtotal`
- **Saldo pendiente**: `SUM(entregas_parciales.monto_entrega) - SUM(cobros.monto_cobrado)` del trabajo

### Agenda / calendario
- `visitas` agrupadas por semana
- Datos: fecha, hora_inicio, hora_fin, trabajo título, cliente nombre

### Generación de presupuesto PDF
- `tareas` del trabajo where `precio IS NOT NULL`, ordenadas por `orden`
- Líneas: descripción + precio de cada tarea
- Total: suma de precios
- Se puede generar desde cualquier estado (`presupuestado` o `en_curso`)
- No cambia el estado del trabajo

### Generación de factura
- `tareas` del trabajo where `precio IS NOT NULL`
- Líneas: descripción + precio de cada tarea
- Total: suma de precios
- Estados para generar: trabajo debe estar en `listo_para_facturar`
- Al generar: cambio estado a `facturado`

### Cuentas a cobrar (por trabajo)
- **Entregas pendientes**: `entregas_parciales` del trabajo, con monto comprometido
- **Cobros registrados**: `cobros` del trabajo, con fecha y forma de pago
- **Saldo pendiente**: `SUM(entregas_parciales.monto_entrega) - SUM(cobros.monto_cobrado)`
- Si no hay entregas parciales, el saldo pendiente = `trabajos.presupuesto - SUM(cobros.monto_cobrado)`

### Materiales (por trabajo)
- Todos los `materiales` del trabajo
- Costo total: suma de `subtotal`

---

## Flujo de estados

```
presupuestado ──(arrancó / hay visitas)──▶ en_curso
en_curso ──(todas las tareas completadas)──▶ listo_para_facturar
listo_para_facturar ──(factura generada)──▶ facturado
facturado ──(cliente pagó)──▶ cobrado
```

**Nota**: desde `presupuestado` se puede generar el presupuesto PDF en
cualquier momento, sin cambiar de estado.

---

## Flujo simple (solo presupuestar y cobrar)

```
1. Crear CLIENTE
2. Crear TRABAJO (asociado a CLIENTE, estado: presupuestado)
3. Agregar TAREAS al TRABAJO (con precio)
4. Generar PRESUPUESTO PDF → enviar al cliente
5. Cliente aprueba → cambiar estado a en_curso (o directamente a listo_para_facturar)
6. Generar FACTURA desde el trabajo
7. (Opcional) Registrar entregas parciales y cobros
8. Marcar como cobrado cuando el cliente pague
```

**No se usan**: visitas, agenda, tabla `visita_tareas`.

---

## Flujo completo (con seguimiento de campo)

```
 1. Crear CLIENTE
 2. Crear TRABAJO (asociado a CLIENTE, estado: presupuestado)
 3. Agregar TAREAS al TRABAJO (con o sin precio)
 4. Generar PRESUPUESTO PDF → enviar al cliente
 5. Cliente aprueba → cambiar estado a en_curso
 6. Agendar VISITAS al TRABAJO
 7. En cada VISITA, marcar TAREAS avanzadas (visita_tareas)
 8. (Opcional) Registrar MATERIALES utilizados
 9. Cuando todas las tareas completadas → estado listo_para_facturar
10. Generar FACTURA desde el trabajo
11. (Opcional) Definir entregas parciales
12. Registrar COBROS (contra entregas o directos)
13. Marcar como cobrado cuando el cliente pague
```

**Se usan**: todas las tablas y funcionalidades.

---

## Dos tipos de usuario

| Característica | Tipo A (simple) | Tipo B (completo) |
|----------------|-----------------|-------------------|
| Presupuesto PDF | Sí | Sí |
| Factura PDF | Sí | Sí |
| Visitas | No | Sí |
| Agenda | No | Sí |
| Barra de progreso | No | Sí |
| Tabla `visita_tareas` | No | Sí |
| Entregas parciales | Opcional | Opcional |
| Cobros | Sí | Sí |
| Materiales | Opcional | Sí |

**La app no fuerza ninguno de los dos flujos.** Las visitas, entregas parciales y materiales son opcionales.
