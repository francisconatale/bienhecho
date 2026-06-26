# Ideas y decisiones del producto

## Concepto central

Una herramienta estilo Notion pero pensada para un trabajador independiente (o empleador con un trabajador). Permite presupuestar, gestionar trabajos, planificar visitas al campo y generar facturas, sin la complejidad de un ERP.

**Doble flujo**: la app sirve tanto para quien solo quiere presupuestar y cobrar, como para quien necesita trackear cada visita en campo.

---

## Lo que resuelve

- Crear un presupuesto y enviarlo al cliente como PDF
- Saber qué trabajos están activos y en qué estado están
- Planificar y registrar visitas a cada trabajo (opcional)
- Tener clara la lista de cosas a cobrar por trabajo
- Generar la factura desde la misma app cuando el trabajo termina
- Tener el historial de cada cliente en un solo lugar

---

## Dos tipos de usuario

### Tipo A — Solo presupuestar y cobrar

No necesita tracking de campo. Solo:
1. Crear cliente
2. Crear trabajo con tareas y precios
3. Generar PDF del presupuesto y enviarlo al cliente
4. Cuando termina, generar factura y cobrar

**No usa**: visitas, agenda, barra de progreso, tabla `visita_tareas`.

### Tipo B — Seguimiento completo

Necesita control de campo. Usa todo:
1. Crear cliente
2. Crear trabajo con tareas
3. Agendar visitas, registrar avances
4. Marcar tareas completadas
5. Generar factura y cobrar

**Usa**: todo lo que ofrece la app.

**La app no fuerza ninguno de los dos flujos.** Las visitas son opcionales. Si no las registrás, el sistema funciona igual.

---

## Distinción clave: tareas vs. visitas

Esta es la decisión de diseño más importante del sistema.

**Tareas** → son ítems a facturar. Le pertenecen al trabajo. Algunas tienen precio, otras son descriptivas (ej: "Limpieza final"). Son las líneas de la factura y del presupuesto.

**Visitas** → son registro interno de campo. Le pertenecen al trabajo pero no van a la factura. Sirven para saber cuándo se fue, cuánto tiempo se estuvo y qué se hizo ese día. **Opcional.**

La conexión entre ambas es la tabla `visita_tareas`: al registrar una visita se puede marcar qué tareas se tocaron ese día, sin afectar el estado de facturación.

---

## Vistas principales

### Dashboard
Vista de inicio. Muestra:
- Trabajos con presupuesto enviado (pendientes de respuesta)
- Próximas visitas planificadas (solo si hay)
- Trabajos activos (en curso)
- Trabajos listos para facturar (sin cobrar)
- Acceso rápido a crear trabajo

### Lista de clientes
- Nombre, teléfono, dirección
- Cantidad de trabajos activos
- Total histórico facturado (a futuro)

### Vista de trabajo (pantalla principal)
La pantalla más importante de la app. Concentra todo:
- Header con cliente, dirección, presupuesto, estado y fechas
- Barra de progreso basada en tareas completadas (solo si hay tareas completadas)
- Lista de tareas a facturar (con checkbox y precio)
- Lista de visitas (realizadas y planificadas) — solo si se usan
- Notas del trabajo
- Botón "Generar presupuesto PDF" (desde `presupuestado`)
- Botón "Generar factura" (desde `listo_para_facturar`)

### Agenda / calendario
- Vista semanal de visitas planificadas
- Permite ver de un vistazo qué hay para hoy o esta semana
- **Opcional**: si el usuario no agenda visitas, esta vista queda vacía

---

## Cruces de datos que generan valor

**Trabajo → presupuesto PDF**
Con un botón, las tareas con precio se convierten en líneas de presupuesto. El total se calcula automáticamente. Se genera un PDF para enviar al cliente por WhatsApp.

**Visita → tareas avanzadas**
Al registrar una visita, el trabajador marca qué tareas tocó ese día. Sirve para el seguimiento interno sin interferir con la factura.

**Trabajo → factura**
Con un botón, las tareas con precio se convierten en líneas de factura. Las tareas sin precio se omiten o aparecen como conceptos sin monto. El total se calcula automáticamente.

**Tareas completadas → estado del trabajo**
Cuando todas las tareas están completadas, el sistema puede sugerir (o cambiar automáticamente) el estado a `listo_para_facturar`.

**Cliente → historial**
Desde la ficha de un cliente se ven todos sus trabajos pasados, cuánto se facturó en total y cuántas visitas implicó cada trabajo.

---

## Ideas para versiones futuras

- **Fotos en visitas**: adjuntar fotos del antes/después como respaldo y para mostrarle al cliente el trabajo hecho.
- **Múltiples trabajadores**: asignar visitas a distintas personas del equipo.
- **Notificaciones**: recordatorio de visita planificada para el día siguiente.
- **Versiones de presupuesto**: historial de versiones con estado de envío/respuesta del cliente.

---

## Lo que queda afuera (por ahora)

- Gestión de múltiples trabajadores
- Control de stock de materiales
- Integración con sistemas de facturación electrónica
- App móvil nativa (arranca como web)
