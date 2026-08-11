# Migraciones legacy (archivadas)

Estas migraciones quedaron absorbidas por el baseline
`supabase/migrations/20260811120000_baseline.sql` (2026-08-11).

**No se aplican ni se modifican.** Se conservan solo como histórico.
El CLI (`db push` / `db reset`) solo lee `supabase/migrations/`.

Incluyen:

- La historia completa del esquema de la app (001 → cuenta corriente):
  multi-tenancy, RLS, storage buckets, `total_estimado/total_cobrado/saldo_pendiente`
  y los triggers de cuenta corriente.
- La historia del chat (rama `gemini`): `20260808052324_initial_schema.sql`
  (snapshot del esquema al 2026-08-08) y las migraciones forward del agente
  (`conversations`, `pending_steps`, `tasks_snapshot` + RLS).

Migraciones activas (forward-only, idempotentes):

- `20260811120000_baseline.sql` — estado completo de la BD (fuente de verdad
  para builds limpios vía `db reset`).
- `20260811150000_tablas_agente.sql` — aditivo: `pg_net` + tablas del chat
  (no-op si ya existen, por eso sirve también para producción).
