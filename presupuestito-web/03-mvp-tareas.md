# MVP — Plan de tareas

## Objetivo del MVP

Una web app funcional que permita presupuestar, gestionar clientes, trabajos, tareas y visitas, y generar facturas. Sin diseño elaborado, sin features extras. Sirve tanto para quien solo quiere cobrar como para quien necesita trackear cada visita.

---

## Stack sugerido

- **Frontend:** Next.js (React) + Tailwind CSS
- **Base de datos:** PostgreSQL (via Supabase o Railway)
- **ORM:** Prisma
- **Auth:** Supabase Auth o NextAuth (usuario único por ahora)
- **Deploy:** Vercel

---

## Fase 1 — Base del sistema

Objetivo: poder cargar clientes y trabajos.

- [ ] Inicializar proyecto Next.js con Tailwind
- [ ] Configurar base de datos PostgreSQL y Prisma
- [ ] Crear migraciones para las 5 tablas (`clientes`, `trabajos`, `tareas`, `visitas`, `visita_tareas`)
- [ ] CRUD de clientes (crear, ver, editar, eliminar)
- [ ] CRUD de trabajos (crear, ver, editar, eliminar)
- [ ] Asociar trabajo a cliente al crearlo
- [ ] Vista lista de trabajos con estado y cliente

---

## Fase 2 — Corazón de la app

Objetivo: la vista de trabajo en detalle funcionando.

- [ ] Vista de detalle de trabajo
  - [ ] Header con datos del trabajo (cliente, presupuesto, estado, fechas)
  - [ ] Barra de progreso basada en tareas completadas
  - [ ] Notas del trabajo (editable inline)
- [ ] CRUD de tareas dentro de un trabajo
  - [ ] Agregar tarea con descripción y precio (opcional)
  - [ ] Marcar tarea como completada / pendiente
  - [ ] Reordenar tareas (drag & drop o flechas)
  - [ ] Eliminar tarea
  - [ ] Mostrar total estimado (suma de tareas con precio)
- [ ] Cambio de estado del trabajo (manual desde un selector)

---

## Fase 3 — Visitas (opcional para el usuario)

Objetivo: registrar el trabajo de campo. **Esta fase es opcional** — si el usuario no necesita tracking, puede saltarla.

- [ ] CRUD de visitas dentro de un trabajo
  - [ ] Agendar visita (fecha, hora inicio, hora fin, notas)
  - [ ] Marcar visita como realizada o cancelada
  - [ ] Ver lista de visitas del trabajo (realizadas y planificadas)
- [ ] Al registrar visita, poder marcar qué tareas se tocaron (tabla `visita_tareas`)
- [ ] Vista de detalle de visita (fecha, horario, notas, tareas avanzadas)

---

## Fase 4 — Presupuesto PDF

Objetivo: generar un presupuesto para enviar al cliente. **Core del flujo simple.**

- [ ] Pantalla de generación de presupuesto desde un trabajo
  - [ ] Listar tareas con precio como líneas de presupuesto
  - [ ] Mostrar subtotal por tarea y total general
  - [ ] Campo para fecha de validez del presupuesto
  - [ ] Campo para notas o condiciones
- [ ] Exportar presupuesto como PDF (usando `react-pdf` o similar)
- [ ] El presupuesto se genera desde cualquier estado `presupuestado` o `en_curso`

---

## Fase 5 — Dashboard y agenda

Objetivo: tener un punto de entrada útil al abrir la app.

- [ ] Dashboard con:
  - [ ] Trabajos pendientes de respuesta (estado `presupuestado`)
  - [ ] Próximas visitas (los próximos 7 días, si existen)
  - [ ] Trabajos activos (estado `en_curso`)
  - [ ] Trabajos listos para facturar (estado `listo_para_facturar`)
- [ ] Vista de agenda semanal de visitas

---

## Fase 6 — Factura

Objetivo: generar la factura desde la app.

- [ ] Pantalla de generación de factura desde un trabajo
  - [ ] Listar tareas con precio como líneas de factura
  - [ ] Mostrar subtotal por tarea y total general
  - [ ] Campo para número de factura y fecha
  - [ ] Campo para condiciones de pago o nota al cliente
- [ ] Exportar factura como PDF (usando `react-pdf` o similar)
- [ ] Al generar factura, cambiar estado del trabajo a `facturado`
- [ ] Marcar trabajo como `cobrado` manualmente

---

## Fase 7 — Pulido

Objetivo: que sea agradable de usar en el día a día.

- [ ] Búsqueda de clientes y trabajos
- [ ] Filtros en lista de trabajos (por estado, por cliente)
- [ ] Confirmación antes de eliminar clientes o trabajos
- [ ] Manejo de errores y estados vacíos en todas las vistas
- [ ] Responsive básico para usar desde el celular
- [ ] Favicon y nombre de la app

---

## Orden de prioridad

| Fase | Valor | Esfuerzo | Prioridad |
|------|-------|----------|-----------|
| Fase 1 — Base | Alto | Medio | 🔴 Primero |
| Fase 2 — Detalle trabajo | Alto | Alto | 🔴 Primero |
| Fase 4 — Presupuesto PDF | Alto | Medio | 🟠 Segundo |
| Fase 6 — Factura | Alto | Medio | 🟠 Segundo |
| Fase 3 — Visitas | Alto | Medio | 🟡 Tercero (opcional) |
| Fase 5 — Dashboard | Medio | Bajo | 🟡 Tercero |
| Fase 7 — Pulido | Medio | Bajo | 🟡 Tercero |

---

## Definición de "MVP listo"

El MVP está completo cuando se puede hacer ESTE flujo de punta a punta (flujo simple, sin visitas):

1. Crear un cliente nuevo
2. Crear un trabajo para ese cliente con tareas y precios
3. Generar y exportar el presupuesto en PDF
4. Generar y exportar la factura en PDF

**Flujo completo** (con visitas) funciona cuando además se puede:

5. Agendar una visita al trabajo
6. Registrar qué tareas se avanzaron en la visita
7. Ver el progreso del trabajo actualizado
