-- Snapshot de cuenta corriente por cliente: clientes.saldo_cuenta_corriente
-- = SUM(trabajos.saldo_pendiente) de sus trabajos con estado <> 'borrador'.
-- Mantenido por trigger; el frontend solo lo lee (carga instantánea del saldo).

ALTER TABLE public.clientes
    ADD COLUMN IF NOT EXISTS saldo_cuenta_corriente numeric(10,2) NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.recalcular_cliente_saldo()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
AS $$
declare
  v_cliente_id uuid;
begin
  if TG_OP = 'DELETE' then
    v_cliente_id := OLD.cliente_id;
  else
    v_cliente_id := NEW.cliente_id;
  end if;

  update public.clientes c
  set saldo_cuenta_corriente = coalesce((
    select sum(t.saldo_pendiente)
    from public.trabajos t
    where t.cliente_id = c.id
      and t.estado <> 'borrador'
  ), 0)
  where c.id = v_cliente_id;

  if TG_OP = 'UPDATE' and OLD.cliente_id is distinct from NEW.cliente_id then
    update public.clientes c
    set saldo_cuenta_corriente = coalesce((
      select sum(t.saldo_pendiente)
      from public.trabajos t
      where t.cliente_id = c.id
        and t.estado <> 'borrador'
    ), 0)
    where c.id = OLD.cliente_id;
  end if;

  return coalesce(NEW, OLD);
end;
$$;

ALTER FUNCTION public.recalcular_cliente_saldo() OWNER TO postgres;

DROP TRIGGER IF EXISTS on_trabajo_recalcular_cliente_saldo ON public.trabajos;
CREATE TRIGGER on_trabajo_recalcular_cliente_saldo
AFTER INSERT OR DELETE OR UPDATE OF saldo_pendiente, cliente_id ON public.trabajos
FOR EACH ROW EXECUTE FUNCTION public.recalcular_cliente_saldo();

-- Backfill inicial
UPDATE public.clientes c
SET saldo_cuenta_corriente = coalesce((
  select sum(t.saldo_pendiente)
  from public.trabajos t
  where t.cliente_id = c.id
    and t.estado <> 'borrador'
), 0);
