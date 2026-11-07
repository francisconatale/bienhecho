# Migraciones de base de datos — Runbook

Proceso para llevar el esquema de Supabase de forma ordenada. Este documento es la
**fuente de verdad** del flujo de migraciones; si un cambio de esquema no está
acá, no se hace.

## Estado reconciliado (2026-08-11)

Antes todo se aplicaba "on the fly" (dumps + SQL editor sueltos). Se normalizó así:

| Artefacto | Rol |
|---|---|
| `supabase/migrations/` | **Única fuente de verdad.** Solo contiene el baseline + migraciones nuevas (forward-only). |
| `supabase/migrations/20260811120000_baseline.sql` | Congela el esquema actual de `public` + storage (idempotente, validado de cero). |
| `supabase/migrations_legacy/` | Histórico ya absorbido por el baseline. **No se toca, no se aplica.** |
| `schema.sql` (raíz) | Dump de **solo lectura** (referencia/backup). No es fuente de verdad. |
| `supabase/config.toml` | Config del CLI local (puertos 55421/55422/55423/55424/55427). |

Entornos:
- **Local (dev):** stack Docker `supabase_*_presupuestito` (API `http://127.0.0.1:55421`, Studio `http://127.0.0.1:55423`).
- **Producción:** proyecto remoto `qxvphqwzgmeiipestjga` (linked vía `supabase link`).

## Comandos base

Todos se corren desde la raíz del proyecto.

```bash
# Levantar/verificar el stack local
npx supabase start
npx supabase status

# Estado de migraciones (local o linked)
npx supabase migration list --local
npx supabase migration list

# Aplicar pendientes al linked (remote) o al local
npx supabase db push --linked
npx supabase db push --local

# Reconstruir la BD local desde las migraciones (DESTRUYE datos locales)
npx supabase db reset

# Vincular producción (una vez)
npx supabase link --project-ref qxvphqwzgmeiipestjga
```

## Ciclo de una migración (dev → prod)

1. **Documentar primero:** si toca estructura de datos, actualizar
   `docs/database_relations.md` (regla de `AGENTS.md`).
2. **Crear el archivo** `supabase/migrations/YYYYMMDDHHMMSS_descripcion.sql`.
   - Nombre con timestamp UTC para orden estable: `20260811150000_add_x.sql`.
   - **Idempotente siempre que sea posible:** `ADD COLUMN IF NOT EXISTS`,
     `CREATE OR REPLACE FUNCTION`, `DROP ... IF EXISTS`, `ON CONFLICT`.
   - Sin data destructiva; si hay backfill, que sea UPDATEs dirigidos.
3. **Probar en local:** `npx supabase db push --local` (o `db reset` para
   reconstrucción limpia). Verificar con las queries de la sección "Verificación".
4. **Commit** del archivo de migración SOLO (sin mezclar con otros cambios).
5. **Deploy a producción:** `npx supabase db push --linked`.
   - `db push` aplica solo las pendientes y registra la versión en
     `supabase_migrations.schema_migrations` de prod.
6. **Verificar en prod** con las queries de abajo.

## Reglas de oro

1. **Nunca** pasar archivos `.sql` por el pipe de PowerShell:
   `Get-Content | docker exec` **corrompe el UTF-8** (`á` → `??`) y rompe
   strings como `'automático'` contra los enums. Siempre: `psql -f`,
   Supabase SQL Editor, o el CLI (`db push`).
2. **Nunca** editar la BD de prod directo en el SQL Editor. Si un fix manual
   es inevitable, convertir ese SQL en una migración de inmediato.
3. **Forward-only:** las migraciones aplicadas no se editan ni se borran.
   Para revertir, se escribe una migración nueva.
4. **`schema.sql` y `migrations_legacy/`** no se regeneran salvo necesidad
   explícita; el baseline + migraciones son lo único que construye bases.
5. Todo cambio de esquema requiere una migración; los triggers/funciones
   también viven en migraciones (nunca solo en el SQL editor).

## Verificación post-migración

```sql
-- 1) Columnas/estado de totales (0 filas esperado)
SELECT t.id, t.titulo, t.total_estimado, t.total_cobrado, t.saldo_pendiente
FROM public.trabajos t
WHERE t.total_estimado <> (COALESCE((SELECT SUM(precio)   FROM public.tareas     WHERE trabajo_id=t.id),0)
                         + COALESCE((SELECT SUM(subtotal) FROM public.materiales WHERE trabajo_id=t.id),0))
   OR t.saldo_pendiente <> (COALESCE((SELECT SUM(precio)   FROM public.tareas     WHERE trabajo_id=t.id),0)
                          + COALESCE((SELECT SUM(subtotal) FROM public.materiales WHERE trabajo_id=t.id),0)
                          - COALESCE((SELECT SUM(monto_cobrado) FROM public.cobros WHERE trabajo_id=t.id),0));

-- 2) Triggers esperados (10)
SELECT tgname FROM pg_trigger
WHERE NOT tgisinternal
  AND tgrelid IN ('public.trabajos'::regclass,'public.cobros'::regclass,
                  'public.tareas'::regclass,'public.materiales'::regclass)
ORDER BY 1;

-- 3) Buckets
SELECT id, name FROM storage.buckets ORDER BY 1;
```

## Deploy inicial a producción (baseline)

Existen dos caminos; elegir según si producción ya tiene datos reales:

### A) Producción sin datos (o descartable) — recomiendo si aún no se lanza
```bash
npx supabase link --project-ref qxvphqwzgmeiipestjga
npx supabase db reset --linked   # DESTRUYE y reconstruye prod desde migrations
npx supabase migration list      # todo applied
```

### B) Producción con datos que no se pueden perder
No se puede aplicar el baseline completo (las tablas ya existen). Se aplica el
puente **aditivo e idempotente** y se siembra el historial:

1. Aplicar `supabase/apply_cuenta_corriente_produccion.sql` en el SQL Editor
   de prod (pegar el contenido del archivo, nunca por consola de Windows).
2. Marcar el baseline como aplicado para que `db push` no lo re-intente:
   ```sql
   INSERT INTO supabase_migrations.schema_migrations (version, name)
   VALUES ('20260811120000', 'baseline_estado_actual')
   ON CONFLICT (version) DO NOTHING;
   ```
   (si la tabla `supabase_migrations.schema_migrations` no existe, crearla:
   `CREATE TABLE supabase_migrations.schema_migrations(version text primary key, statements text[], name text);`)
3. Correr las queries de verificación.
4. De ahí en más: `npx supabase db push --linked` para cada migración nueva.

## Troubleshooting

- **`invalid input value for enum ... "autom??tico"`** → encoding roto por
  consola de Windows. Re-aplicar el SQL desde archivo vía `psql -f` o SQL editor.
- **`schema "public" already exists`** → el dump usa `CREATE SCHEMA` sin
  `IF NOT EXISTS`; en el baseline ya está corregido.
- **`SET ROLE "supabase_admin"` denegado** → dumps con `--no-owner` para
  entornos sin el rol.
- **`db push` aplica todo desde cero** → si prod es dump-based, seguir el
  camino B (siembra de `schema_migrations`).
