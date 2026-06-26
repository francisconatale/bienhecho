<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
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

## Regla: DESIGN_MEMORY.md

Antes de implementar CUALQUIER cambio de frontend (componentes, páginas,
estilos, layouts), DEBES:

1. Leer `DESIGN_MEMORY.md` en la raíz del proyecto.
2. Respetar los patrones, componentes del sistema, tokens de color,
   reglas de spacing y decisiones de diseño documentadas ahí.
3. Para el design system completo, leer `design-system/MASTER.md`.
4. Para reglas de spacing y densidad, leer `src/SPACING-GUIDELINES.md`.

Al terminar una sesión de desarrollo donde se tomó alguna decisión
de diseño relevante, **agregar una entrada en el log cronológico**
de `DESIGN_MEMORY.md` con fecha y descripción de la decisión.

**Antipatrón principal a evitar:** "Mobile-Stretched en Desktop".
Ver sección específica en `DESIGN_MEMORY.md` y `design-system/MASTER.md`.
