# MVP — Plan de tareas

## Objetivo del MVP

Una web app funcional que permita gestionar clientes, trabajos, tareas y visitas, y generar una factura básica. Sin diseño elaborado, sin features extras. Solo lo que permite trabajar el día a día.

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

## Fase 3 — Visitas

Objetivo: registrar el trabajo de campo.

- [ ] CRUD de visitas dentro de un trabajo
  - [ ] Agendar visita (fecha, hora inicio, hora fin, notas)
  - [ ] Marcar visita como realizada o cancelada
  - [ ] Ver lista de visitas del trabajo (realizadas y planificadas)
- [ ] Al registrar visita, poder marcar qué tareas se tocaron (tabla `visita_tareas`)
- [ ] Vista de detalle de visita (fecha, horario, notas, tareas avanzadas)

---

## Fase 4 — Dashboard y agenda

Objetivo: tener un punto de entrada útil al abrir la app.

- [ ] Dashboard con:
  - [ ] Próximas visitas (los próximos 7 días)
  - [ ] Trabajos activos (estado `en_curso`)
  - [ ] Trabajos listos para facturar (estado `listo_para_facturar`)
- [ ] Vista de agenda semanal de visitas

---

## Fase 5 — Factura

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

## Fase 6 — Pulido

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
| Fase 3 — Visitas | Alto | Medio | 🟠 Segundo |
| Fase 5 — Factura | Alto | Medio | 🟠 Segundo |
| Fase 4 — Dashboard | Medio | Bajo | 🟡 Tercero |
| Fase 6 — Pulido | Medio | Bajo | 🟡 Tercero |

---

## Definición de "MVP listo"

El MVP está completo cuando se puede hacer este flujo de punta a punta:

1. Crear un cliente nuevo
2. Crear un trabajo para ese cliente con presupuesto y tareas
3. Registrar una visita y marcar qué tareas se avanzaron
4. Ver el progreso del trabajo actualizado
5. Generar y exportar la factura en PDF
