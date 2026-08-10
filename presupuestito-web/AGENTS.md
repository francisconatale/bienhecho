<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/011-persistir-totales-cobros/plan.md

Design artifacts (Phase 1) available at:
- specs/011-persistir-totales-cobros/research.md (Phase 0)
- specs/011-persistir-totales-cobros/data-model.md (Phase 1)
- specs/011-persistir-totales-cobros/quickstart.md (Phase 1)
<!-- SPECKIT END -->

## Regla: TODO.md

El archivo `TODO.md` en la raíz del proyecto es la lista de tareas e ideas
del usuario. Cuando el usuario pida "procesar el TODO" o "ver las tareas
pendientes", leer ese archivo y trabajar sobre los ítems del Backlog.

**Formato de ítems:**
```
- [ ] Descripción de la tarea
- [ ] (Prioridad alta) Descripción urgente
```

Cuando un íterm se complete, moverlo a la sección "Completados" y marcar `[x]`.

**NUNCA** borrar ítems completados sin que el usuario lo pida.

## Regla: database_relations.md

Antes de implementar CUALQUIER cambio en el frontend que toque datos
del backend (CRUD, consultas, joins, estados, flujos), DEBES:

1. Leer `database_relations.md` en la raíz del proyecto.
2. Respetar estrictamente la estructura, nombres de campos,
   tipos, relaciones y reglas de negocio definidas ahí.
3. Si el cambio implica modificar la base de datos, primero
   actualizar `database_relations.md` y luego aplicar la migración.

**NUNCA** inferir nombres de tablas, campos o relaciones de memoria.
**SIEMPRE** consultar el archivo.

## Regla: Frontend y Decisiones de Diseño

**Condición de activación:** Cuando se trabaje en frontend — diseño, UI/UX, layouts, componentes o estilos.

**Acción:** Leer `DESIGN_MEMORY.md` en la raíz del proyecto antes de implementar cualquier cambio visual. Es la única fuente de verdad de estilos, tokens, patrones y decisiones de diseño. No inferir estilos de memoria.

Al terminar una sesión donde se tomó una decisión de diseño relevante, agregar una entrada al log de `DESIGN_MEMORY.md`.

## Regla: Design Lab Route
Cuando se use la skill `design-lab` en Next.js, los archivos del lab deben quedar accesibles en `/design-lab` (ej: `src/app/design-lab/page.tsx`), **NUNCA** en `__design_lab`.

## Regla: Edición In-Place (Stripe-like)
Para la edición de detalles de entidades principales (cabeceras de Trabajo, Cliente, etc.), **evitar** formularios modales o componentes pesados.
- **Patrón**: modo read-only por defecto con ícono de lápiz en hover. Al editar, los campos se transforman en `inputs` in-place con border-bottom sutil, manteniendo la misma disposición y espaciado.

## Regla: Commits al Finalizar Tareas
Al dar por finalizada la asistencia en una tarea, preguntar explícitamente si el usuario desea un commit.
No commitear automáticamente. Si aprueba, seguir Conventional Commits describiendo el trabajo realizado.

## Regla: Auto-Commit en Flujo Spec Kit
En el flujo speckit (specify → plan → tasks → implement), los hooks ejecutan auto-commits con `chore(save): auto-save after <step>`. Son automáticos, no preguntar por ellos.

## Regla: Cursor en Campos Read-Only
En elementos `<span>`, `<p>`, `<div>` que muestran datos sin interacción, agregar `cursor-default select-none`.

```tsx
// ✅ Correcto
<span className="text-sm font-semibold text-on-surface cursor-default select-none">
  {client.telefono}
</span>
```

Elementos interactivos (`<button>`, `<a>`, `<div onClick>`) usan `cursor-pointer`.

## Regla: Documentación Post-Implement (.specify)
Al finalizar la etapa `implement` del flujo `.specify`, actualizar las secciones relevantes en `/home/francisco/Software/bien-hecho/index.html` antes de dar la tarea por terminada.

## Regla: Subtablas para Enumerados (Enums) en Documentación
Al documentar modelos de datos (en `database_relations.md` o `index.html`), cuando un campo represente un conjunto de valores limitados:
1. Declarar su tipo como `enum`.
2. Crear una subtabla dedicada con cada valor y su descripción semántica.
