-- 2026-08-11: Fix snapshot clientes.saldo_cuenta_corriente.
-- Bug: el trigger solo disparaba en UPDATE OF saldo_pendiente, cliente_id.
-- Al pasar un trabajo de 'borrador' a 'presupuestado'/'pagado' solo cambia
-- `estado`, por lo que el snapshot del cliente nunca se recalculaba y quedaba
-- desactualizado. Se agrega `estado` al disparador + backfill correctivo.

DROP TRIGGER IF EXISTS on_trabajo_recalcular_cliente_saldo ON public.trabajos;
CREATE TRIGGER on_trabajo_recalcular_cliente_saldo
AFTER INSERT OR DELETE OR UPDATE OF saldo_pendiente, cliente_id, estado ON public.trabajos
FOR EACH ROW EXECUTE FUNCTION public.recalcular_cliente_saldo();

-- Backfill: corregir snapshots que quedaron desactualizados
UPDATE public.clientes c
SET saldo_cuenta_corriente = coalesce((
  select sum(t.saldo_pendiente)
  from public.trabajos t
  where t.cliente_id = c.id
    and t.estado <> 'borrador'
), 0);
