-- Persistir totales de cuentas a cobrar en trabajos
-- total_estimado, total_cobrado, saldo_pendiente mantenidos por triggers.
-- El frontend lee estas columnas, nunca las escribe.

-- 1. Columnas nuevas
alter table public.trabajos
  add column if not exists total_estimado numeric(10,2) not null default 0,
  add column if not exists total_cobrado  numeric(10,2) not null default 0,
  add column if not exists saldo_pendiente numeric(10,2) not null default 0;

-- 2. Drops de obsoletos (lógica absorbida en recalcular_trabajo_totales)
drop trigger if exists on_tarea_change_update_presupuesto on public.tareas;
drop trigger if exists on_cobro_insert_check_pagado on public.cobros;
drop function if exists public.update_trabajo_presupuesto();
drop function if exists public.check_trabajo_pagado();

-- 3. Funciones

-- Recalcula presupuesto, total_estimado, total_cobrado, saldo_pendiente
-- y auto-pasa a pagado cuando un trabajo presupuestado queda con saldo <= 0.
create or replace function public.recalcular_trabajo_totales()
returns trigger
language plpgsql
security definer
as $$
declare
  v_id uuid;
  v_presupuesto numeric(10,2);
  v_materiales numeric(10,2);
  v_cobrado numeric(10,2);
  v_estado public.job_status;
begin
  v_id := case when TG_OP = 'DELETE' then OLD.trabajo_id else NEW.trabajo_id end;
  if v_id is null then
    return coalesce(NEW, OLD);
  end if;

  select coalesce(sum(precio), 0) into v_presupuesto from public.tareas where trabajo_id = v_id;
  select coalesce(sum(subtotal), 0) into v_materiales from public.materiales where trabajo_id = v_id;
  select coalesce(sum(monto_cobrado), 0) into v_cobrado from public.cobros where trabajo_id = v_id;

  select estado into v_estado from public.trabajos where id = v_id;

  update public.trabajos set
    presupuesto = v_presupuesto,
    total_estimado = v_presupuesto + v_materiales,
    total_cobrado = v_cobrado,
    saldo_pendiente = (v_presupuesto + v_materiales) - v_cobrado,
    estado = case
      when v_estado = 'presupuestado'
       and (v_presupuesto + v_materiales) - v_cobrado <= 0
      then 'pagado'
      else estado
    end
  where id = v_id;

  return coalesce(NEW, OLD);
end;
$$;

-- La BD es autoridad del subtotal: cantidad x precio_unitario.
create or replace function public.sync_material_subtotal()
returns trigger
language plpgsql
as $$
begin
  NEW.subtotal := NEW.cantidad * NEW.precio_unitario;
  return NEW;
end;
$$;

-- Al actualizar un cobro, ajusta el abono automático de cuenta corriente.
create or replace function public.sync_abono_cobro_update()
returns trigger
language plpgsql
security definer
as $$
declare
  v_titulo text;
begin
  select titulo into v_titulo from public.trabajos where id = NEW.trabajo_id;
  update public.transacciones set
    monto = NEW.monto_cobrado,
    fecha = NEW.fecha_cobro,
    concepto = 'Cobro registrado: ' || coalesce(v_titulo, '')
  where referencia_cobro_id = NEW.id
    and tipo = 'abono'
    and origen = 'automático';
  return NEW;
end;
$$;

-- Al borrar un cobro, inserta un cargo de anulación (auditoría).
-- NOTA: referencia_cobro_id va NULL porque el cobro ya no existe al correr
-- el AFTER DELETE y la FK transacciones.referencia_cobro_id -> cobros.id
-- (ON DELETE SET NULL) haría fallar el insert referenciándolo. El abono
-- original se conserva como rastro; el saldo neto queda en cero.
create or replace function public.revertir_abono_cobro_delete()
returns trigger
language plpgsql
security definer
as $$
declare
  v_cliente_id uuid;
  v_titulo text;
begin
  select cliente_id, titulo into v_cliente_id, v_titulo
  from public.trabajos where id = OLD.trabajo_id;
  if v_cliente_id is null then
    return OLD;
  end if;

  insert into public.transacciones
    (user_id, cliente_id, tipo, monto, concepto, fecha,
     referencia_trabajo_id, origen)
  values
    (OLD.user_id, v_cliente_id, 'cargo', OLD.monto_cobrado,
     'Anulación de cobro: ' || v_titulo, current_date,
     OLD.trabajo_id, 'automático');
  return OLD;
end;
$$;

-- 4. Triggers

-- Transacciones de cuenta corriente (existentes en el dump, se aseguran acá)
create or replace trigger on_cobro_insert
after insert on public.cobros
for each row execute function public.emitir_transaccion_cobro();

create or replace trigger on_trabajo_estado_presupuestado
after update of estado on public.trabajos
for each row execute function public.emitir_transaccion_presupuesto();

-- Recálculo de totales
create or replace trigger on_tarea_change_recalcular
after insert or delete or update of precio, cantidad, precio_unitario on public.tareas
for each row execute function public.recalcular_trabajo_totales();

create or replace trigger on_material_subtotal_sync
before insert or update of cantidad, precio_unitario on public.materiales
for each row execute function public.sync_material_subtotal();

create or replace trigger on_material_change_recalcular
after insert or delete or update of cantidad, precio_unitario, subtotal on public.materiales
for each row execute function public.recalcular_trabajo_totales();

create or replace trigger on_cobro_change_recalcular
after insert or delete or update of monto_cobrado on public.cobros
for each row execute function public.recalcular_trabajo_totales();

-- Sincronización de cuenta corriente al editar/borrar un cobro
create or replace trigger on_cobro_update_sync_abono
after update of monto_cobrado, fecha_cobro on public.cobros
for each row execute function public.sync_abono_cobro_update();

create or replace trigger on_cobro_delete_revert
after delete on public.cobros
for each row execute function public.revertir_abono_cobro_delete();

-- 5. Backfill (UPDATE directo; no dispara los triggers de recálculo)
update public.trabajos t set
  presupuesto = coalesce((select sum(precio) from public.tareas where trabajo_id = t.id), 0),
  total_estimado = coalesce((select sum(precio) from public.tareas where trabajo_id = t.id), 0)
                 + coalesce((select sum(subtotal) from public.materiales where trabajo_id = t.id), 0),
  total_cobrado = coalesce((select sum(monto_cobrado) from public.cobros where trabajo_id = t.id), 0),
  saldo_pendiente = coalesce((select sum(precio) from public.tareas where trabajo_id = t.id), 0)
                  + coalesce((select sum(subtotal) from public.materiales where trabajo_id = t.id), 0)
                  - coalesce((select sum(monto_cobrado) from public.cobros where trabajo_id = t.id), 0);
