<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->

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
