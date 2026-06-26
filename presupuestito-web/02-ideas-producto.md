# Ideas y decisiones del producto

## Concepto central

Una herramienta estilo Notion pero pensada para un trabajador independiente (o empleador con un trabajador). Permite gestionar trabajos, planificar visitas al campo y generar facturas, sin la complejidad de un ERP.

---

## Lo que resuelve

- Saber qué trabajos están activos y en qué estado están
- Planificar y registrar visitas a cada trabajo
- Tener clara la lista de cosas a cobrar por trabajo
- Generar la factura desde la misma app cuando el trabajo termina
- Tener el historial de cada cliente en un solo lugar

---

## Distinción clave: tareas vs. visitas

Esta es la decisión de diseño más importante del sistema.

**Tareas** → son ítems a facturar. Le pertenecen al trabajo. Algunas tienen precio, otras son descriptivas (ej: "Limpieza final"). Son las líneas de la futura factura.

**Visitas** → son registro interno de campo. Le pertenecen al trabajo pero no van a la factura. Sirven para saber cuándo se fue, cuánto tiempo se estuvo y qué se hizo ese día.

La conexión entre ambas es la tabla `visita_tareas`: al registrar una visita se puede marcar qué tareas se tocaron ese día, sin afectar el estado de facturación.

---

## Vistas principales

### Dashboard
Vista de inicio. Muestra:
- Próximas visitas planificadas
- Trabajos activos (en curso)
- Trabajos listos para facturar (sin cobrar)
- Acceso rápido a crear trabajo o agendar visita

### Lista de clientes
- Nombre, teléfono, dirección
- Cantidad de trabajos activos
- Total histórico facturado (a futuro)

### Vista de trabajo (pantalla principal)
La pantalla más importante de la app. Concentra todo:
- Header con cliente, dirección, presupuesto, estado y fechas
- Barra de progreso basada en tareas completadas
- Lista de tareas a facturar (con checkbox y precio)
- Lista de visitas (realizadas y planificadas)
- Notas del trabajo
- Botón "Generar factura" cuando está listo

### Agenda / calendario
- Vista semanal de visitas planificadas
- Permite ver de un vistazo qué hay para hoy o esta semana

---

## Cruces de datos que generan valor

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

- **Presupuesto previo**: crear un documento de presupuesto para enviarle al cliente antes de arrancar. Con su aprobación, se convierte en trabajo con las tareas ya cargadas.
- **Fotos en visitas**: adjuntar fotos del antes/después como respaldo y para mostrarle al cliente el trabajo hecho.
- **Múltiples trabajadores**: asignar visitas a distintas personas del equipo.
- **Notificaciones**: recordatorio de visita planificada para el día siguiente.
- **Exportación PDF**: generar la factura o presupuesto en PDF para compartir por WhatsApp.

---

## Lo que queda afuera (por ahora)

- Gestión de múltiples trabajadores
- Control de stock de materiales
- Integración con sistemas de facturación electrónica
- App móvil nativa (arranca como web)
