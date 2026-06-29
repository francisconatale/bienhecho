# Presupuestito — Features de Valor Agregado

> **Objetivo:** Propuestas de features para todo el rubro de trabajadores,
> organización y gestión de negocios de servicios/construcción en LATAM.
>
> **Estado:** ✅ Investigadas — análisis de factibilidad + benchmarking con
> Jobber, Housecall Pro, ServiceTitan, FieldCamp.

---

## Estado de la DB actual

- **Sin persistencia real** — Todo vive en Zustand (in-memory). Fotos son la excepción (IndexedDB).
- **Sin backend** — App 100% client-side.
- **PDF con jspdf + jspdf-autotable** ya funcionando.
- **Sin gráficos, analytics, ni integraciones.**
- **Hooks existentes:** `usePayments` (saldo pendiente), `useMaterials` (subtotales), progress bar (completado %).

---

## ⚡ QUICK WINS (1-2 días, sin nuevas dependencias)

### 1. Clonar Trabajo ✅ Investigada
- **Qué:** Duplicar un trabajo existente como plantilla.
- **Por qué:** Trabajos recurrentes repiten las mismas tareas.
- **Implementación:** Botón "Clonar" → copia titulo, dirección, tareas → crea trabajo nuevo en `presupuesto`.
- **Archivos:** `src/lib/store.ts` + botón en trabajo detail.

### 2. Auto-cambiar Estado a "Listo para Facturar" ✅ Investigada
- **Qué:** Cuando todas las tareas completadas, transición automática `en_curso` → `listo_para_facturar`.
- **Implementación:** `useEffect` que detecte 100% completado y sugiera el cambio.
- **Archivos:** `src/app/trabajos/components/trabajo-detail.tsx`.

### 3. Aging de Cuentas a Cobrar ✅ Investigada
- **Qué:** Clasificar saldos por antigüedad (30/60/90+ días).
- **Implementación:** Extender `usePayments` con cálculo de días desde `fecha_cobro`.
- **Archivos:** `src/app/trabajos/[id]/hooks/use-payments.ts`.

### 4. Rentabilidad por Trabajo ✅ Investigada
- **Qué:** Margen = `totalCobrado - (presupuesto + materiales)`.
- **Implementación:** Ya tienes todos los datos en hooks existentes.
- **Archivos:** `src/app/trabajos/[id]/hooks/use-payments.ts`.

### 5. Histórico Financiero por Cliente ✅ Investigada
- **Qué:** Total facturado + total cobrado + saldo pendiente por cliente.
- **Implementación:** Extender `client-list.tsx` que ya suma presupuesto por cliente.
- **Archivos:** `src/app/clientes/components/client-list.tsx`.

### 6. Recordatorios de Cobro ✅ Investigada
- **Qué:** Trabajos `facturado` sin cobros, ordenados por antigüedad.
- **Implementación:** Sección en dashboard.
- **Archivos:** Nuevo componente en `src/app/(dashboard)/components/`.

---

## 🟡 FEATURES MEDIAS (3-5 días, 0-1 dependencia nueva)

### 7. Exportar Visitas a Calendario (ICS) ✅ Investigada
- **Qué:** Generar archivo `.ics` descargable.
- **Implementación:** ICS es texto plano, no necesita librería. Generar string manualmente.
- **Archivos:** Nuevo `src/lib/ics-export.ts`.

### 8. Dashboard con Gráficos ✅ Investigada
- **Qué:** Ingresos mensuales, trabajos por estado, ticket promedio.
- **Implementación:** Instalar `recharts` o `chart.js`.
- **Dependencia:** `recharts` (~150kb).

### 9. Comparar Presupuesto vs Real ✅ Investigada
- **Qué:** Presupuesto original vs materiales reales + horas estimadas.
- **Implementación:** Extender `usePayments` con horas de visitas.
- **Archivos:** `src/app/trabajos/[id]/hooks/use-payments.ts`.

### 10. Firma Digital del Cliente ✅ Investigada
- **Qué:** Canvas para firma, guardar como imagen en IndexedDB.
- **Implementación:** Canvas API nativa, misma lógica que `photo-storage.ts`.
- **Archivos:** Nuevo `src/lib/firma-storage.ts`.

### 11. Garantías de Obra ✅ Investigada
- **Qué:** Link de garantía (ej: 6 meses) a cada trabajo con alerta de expiración.
- **Por qué:** Electricistas y plomeros ofrecen garantía de trabajo. Sin tracking, se pierden llamadas de garantía.
- **Implementación:** Nuevo campo `garantia_hasta` en `trabajos` + alerta en dashboard cuando esté por vencer.
- **Archivos:** Extender `database_relations.md`, types, store, nuevo componente de alertas.

### 12. Documentos por Cliente (Bóveda) ✅ Investigada
- **Qué:** Subir fotos de pólizas, constancias, contratos firmados, recibos.
- **Por qué:** En LATAM, tener documentación digital da confianza y profesionalismo.
- **Implementación:** Extender `photo-storage.ts` (IndexedDB) para documentos adjuntos a clientes, no solo tareas.
- **Archivos:** Nuevo `src/lib/doc-storage.ts`, componente de upload en cliente detail.

### 13. Tracking de Materiales Cotizado vs Real ✅ Investigada
- **Qué:** Comparar materiales presupuestados vs realmente usados.
- **Por qué:** Encontrar "filtraciones" de margen — cuándo se gastó de más.
- **Implementación:** Nueva tabla `materiales_cotizados` o campo `cantidad_estimada` en `materiales`.
- **Archivos:** Extender types, store, UI de materiales.

### 14. Checklists por Tipo de Oficio ✅ Investigada
- **Qué:** Plantillas de checklist pre-armadas (eléctrico, plomería, construcción). Items obligatorios.
- **Por qué:** ServiceTitan y Housecall Pro ofrecen esto. En LATAM no existe.
- **Implementación:** Nueva tabla `checklist_templates` + `checklist_items` + UI de verificación en trabajo.
- **Archivos:** Nuevo módulo `src/app/trabajos/[id]/checklist/`.

### 15. "5 Números" Dashboard ✅ Investigada
- **Qué:** 1 pantalla con las 5 métricas que importan:
  1. Dinero cobrado este mes
  2. Pendiente de cobro (aging)
  3. Trabajos completados este mes
  4. Margen promedio
  5. Tasa de cierre (presupuestos → trabajos pagados)
- **Implementación:** Combinar datos existentes + gráficos simples.
- **Archivos:** `src/app/page.tsx` (reemplazar dashboard actual).

---

## 🔴 FEATURES LARGAS (1-2+ semanas, requieren infraestructura)

### 16. WhatsApp Integration ✅ Investigada
- **Qué:** Enviar presupuesto/factura por WhatsApp con un tap.
- **Por qué:** Canal #1 en LATAM. Ningún competidor lo ofrece nativamente.
- **Alternativa sin backend:** Link `wa.me/?text=...` con resumen del presupuesto.
- **Full feature:** Requiere WhatsApp Business API + backend.

### 17. Facturación Electrónica Fiscal ✅ Investigada
- **Qué:** CFDI (México), factura electrónica (Colombia), DTTE (Chile), NF-e (Brasil).
- **Por qué:** Legalmente obligatorio en muchos países LATAM. Ningún competidor lo maneja.
- **Bloqueador:** Requiere integración con PAC (Proveedor Autorizado de Certificación) por país.

### 18. Modo Offline First ✅ Investigada
- **Qué:** App funciona 100% sin internet, sincroniza al reconectar.
- **Por qué:** Trabajadores en campo con mala señal.
- **Bloqueador:** Service worker + persistir TODOS los datos en IndexedDB + resolver conflictos.

### 19. Portal de Cliente ✅ Investigada
- **Qué:** Vista pública donde el cliente ve sus trabajos y aprueba presupuestos.
- **Bloqueador:** Auth multi-tenant, API backend, base de datos real.

### 20. Gestión de Trabajadores/Equipo ✅ Investigada
- **Qué:** Asignar múltiples trabajadores a un trabajo, ver carga de cada uno.
- **Bloqueador:** Nueva tabla `trabajadores` + `trabajo_trabajadores` + UI de asignación.

### 21. Gestión de Comisiones ✅ Investigada
- **Qué:** Calcular comisión por trabajo cuando se paga a técnicos por porcentaje.
- **Bloqueador:** Requiere tabla de trabajadores + lógica de cálculo.

### 22. Optimización de Rutas ✅ Investigada
- **Qué:** Optimizar el orden de visitas por día para reducir tiempo de traslado.
- **Bloqueador:** API de Google Maps Directions + algoritmo de optimización.

### 23. Agenda con Drag & Drop ✅ Investigada
- **Qué:** Reordenar visitas arrastrando en el calendario semanal.
- **Bloqueador:** Librería de DnD (dnd-kit) + lógica de conflictos de horario.

### 24. Inventario de Materiales ✅ Investigada
- **Qué:** Stock reutilizable, alertas de stock bajo, precios históricos por proveedor.
- **Bloqueador:** Nueva tabla `inventario` + lógica de deducción automática.

### 25. Trabajos Recurrentes/Mantenimiento ✅ Investigada
- **Qué:** Trabajos que se repiten (mantenimiento mensual de A/C, limpieza trimestral).
- **Bloqueador:** Tabla `trabajos_recurrentes` + generación automática de trabajos periódicos.

### 26. Reportes Tributarios ✅ Investigada
- **Qué:** Resumen anual de ingresos, IVA, retenciones.
- **Bloqueador:** Lógica tributaria específica por país + formato contable.

### 27. Tracking de Referidos ✅ Investigada
- **Qué:** Quién referenció a cada cliente (el boca a boca es #1 en LATAM).
- **Implementación:** Campo `referido_por` en `clientes` + métricas de referidos.
- **Archivos:** Extender type `Client`, UI de cliente.

### 28. Fotos Antes/Después Obligatorias ✅ Investigada
- **Qué:** Captura obligatoria de fotos al inicio y final de cada trabajo.
- **Por qué:** Prueba de trabajo completado, resolución de disputas.
- **Implementación:** Extender `task_photos` a nivel de trabajo con obligatoriedad configurable.

---

## Matriz de Prioridad Final

| # | Feature | Esfuerzo | Impacto | Dependencias | Prioridad |
|---|---------|----------|---------|--------------|-----------|
| 1 | Clonar trabajo | ⚡ | 🔥 | Ninguna | **P0** |
| 2 | Auto-cambiar estado | ⚡ | 🔥 | Ninguna | **P0** |
| 3 | Aging cobros | ⚡ | 🔥 | Ninguna | **P0** |
| 4 | Rentabilidad | ⚡ | 🔥 | Ninguna | **P0** |
| 5 | Histórico por cliente | ⚡ | 🔥 | Ninguna | **P0** |
| 6 | Recordatorios cobro | ⚡ | 🔥 | Ninguna | **P0** |
| 7 | ICS Calendar | 🟡 | 🔥 | Ninguna | **P1** |
| 8 | Dashboard gráficos | 🟡 | 🔥 | recharts | **P1** |
| 9 | Presupuesto vs real | 🟡 | 🟡 | Ninguna | **P1** |
| 10 | Firma digital | 🟡 | 🟡 | Canvas API | **P1** |
| 11 | Garantías de obra | 🟡 | 🔥 | Ninguna | **P1** |
| 12 | Documentos por cliente | 🟡 | 🔥 | IndexedDB | **P1** |
| 13 | Materiales cotizado vs real | 🟡 | 🟡 | Ninguna | **P2** |
| 14 | Checklists por oficio | 🟡 | 🔥 | Ninguna | **P2** |
| 15 | "5 Números" Dashboard | 🟡 | 🔥 | recharts | **P2** |
| 16 | WhatsApp link | 🔴 | 🔥 | Ninguna (link wa.me) | **P2** |
| 17 | Facturación electrónica | 🔴 | 🔴 | PAC por país | **P3** |
| 18 | Modo offline | 🔴 | 🔴 | Arquitectura nueva | **P3** |
| 19 | Portal cliente | 🔴 | 🔴 | Full stack | **P3** |
| 20 | Gestión de equipo | 🔴 | 🟡 | Nuevas tablas | **P3** |
| 21 | Comisiones | 🔴 | 🟡 | Tabla trabajadores | **P3** |
| 22 | Optimización de rutas | 🔴 | 🟡 | Google Maps API | **P3** |
| 23 | Agenda DnD | 🔴 | 🟡 | dnd-kit | **P3** |
| 24 | Inventario | 🔴 | 🟡 | Nuevas tablas | **P3** |
| 25 | Trabajos recurrentes | 🔴 | 🟡 | Nuevas tablas | **P3** |
| 26 | Reportes tributarios | 🔴 | 🟡 | Lógica fiscal | **P3** |
| 27 | Tracking referidos | ⚡ | 🟡 | Ninguna | **P2** |
| 28 | Fotos antes/después | 🟡 | 🔥 | IndexedDB | **P2** |

---

## Roadmap Sugerido

### Fase 1 — Quick Wins (1 semana)
> Solo frontend, sin dependencias nuevas, sin backend.
> features #1-6: Clonar, auto-estado, aging, rentabilidad, histórico, recordatorios.

### Fase 2 — Core LATAM (2 semanas)
> 1 dependencia nueva (recharts) + features que diferencian en LATAM.
> features #7, #8, #11, #12, #16 (link wa.me): ICS, gráficos, garantías, docs, WhatsApp link.

### Fase 3 — Profesionalización (3 semanas)
> Checklists, materiales cotizado vs real, firma, dashboard "5 números", referidos, fotos antes/después.
> features #9, #10, #13, #14, #15, #27, #28.

### Fase 4 — Escalamiento (1+ mes)
> Requiere backend o cambios arquitectónicos significativos.
> features #17-26: Offline, facturación electrónica, portal, equipo, inventario, recurrentes.

---

## Benchmarking Competitivo

| Dimensión | Jobber | Housecall Pro | ServiceTitan | **Presupuestito** |
|-----------|--------|---------------|--------------|-------------------|
| Audiencia | Pequeño negocio | Equipos crecientes | Mid-market | **Solo trabajador LATAM** |
| Precio | $39-249/mes | $79-199/mes | Caro (custom) | **Gratis + affordable** |
| Idioma | EN + ES | Solo EN | Solo EN | **Español nativo** |
| Offline | Limitado | No | Limitado | **Full offline-first** |
| Facturación | Estándar | Estándar | Compleja | **Electrónica fiscal** |
| Comunicación | Email/SMS | Email/SMS | Email/SMS | **WhatsApp-first** |
| Seguridad | Básico | Checklists | Digital forms | **Bitácora LATAM** |
| Inventario | Básico | Price book | Enterprise | **Cotizado vs real** |
| Reporting | Básico | Revenue | Enterprise | **5 números simples** |

---

*Última actualización: 2026-06-26*
