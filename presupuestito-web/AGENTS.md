<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->

## Regla: TODO.md

El archivo `TODO.md` en la raíz del proyecto es la lista de tareas e ideas
del usuario. Cuando el usuario pida "procesar el TODO", "ver las tareas
pendientes", o "qué falta", leer ese archivo y mostrar el resumen de
prioridades.

**Formato de ítems:**
```
- [ ] Descripción de la tarea
- [ ] (P1) Descripción urgente
- [ ] (P2) Descripción importante
- [ ] (P3) Descripción normal
```

Prioridades: P1 = urgente, P2 = importante, P3 = normal.

**Flujo al mostrar tareas pendientes:**
1. Leer `TODO.md` desde la raíz del proyecto (`/home/francisco/Software/presupuestito/TODO.md`)
2. Listar los ítems del Backlog ordenados por prioridad (P1 primero)
3. Mostrar: cantidad total, cuántas por prioridad
4. Si el usuario dice "procesar" o "arrancar", empezar por P1

Cuando un íterm se complete, moverlo a la sección "Sprint X - Completado"
y marcar `[x]`.

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

## Regla: Commit después de cada tarea

Después de completar CADA tarea (sub-tarea de un plan, ítem del TODO,
o cualquier cambio de código), **SIN EXCEPCIONES**, debés hacer un commit
git con un mensaje descriptivo del cambio.

**Flujo obligatorio:**
1. Completar la tarea
2. `git add` de los archivos modificados
3. `git commit -m "mensaje descriptivo"`
4. Recién ahí pasar a la siguiente tarea

**NUNCA** acumular cambios de múltiples tareas en un solo commit.
**NUNCA** dejar archivos sin commitear al finalizar una tarea.

Formato del mensaje: `<tipo>: <descripción corta>`
Ejemplos:
- `feat: crear formulario de nuevo trabajo`
- `fix: corregir field names en client-list`
- `refactor: migrar PDF de react-pdf a jspdf`
- `chore: eliminar código muerto (proyectos, presupuestos)`
