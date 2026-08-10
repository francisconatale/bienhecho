-- RPC: get_smart_suggestions
-- Trabajos con tareas críticas (prioridad alta/media, sin completar) que NO tienen
-- una visita futura (hoy o después) ni cancelada. Ordenados por cantidad de tareas
-- "alta" y luego por total de tareas críticas.
--
-- security invoker + RLS: el resultado queda filtrado por user_id del usuario autenticado.

create or replace function get_smart_suggestions()
returns table (
  job_id uuid,
  job_title text,
  client_name text,
  critical_tasks_count bigint,
  high_priority_count bigint,
  critical_tasks jsonb
)
language sql
security invoker
as $$
  select
    j.id,
    j.titulo,
    coalesce(c.nombre, 'Cliente Desconocido'),
    count(t.id),
    count(*) filter (where t.prioridad = 'alta'),
    jsonb_agg(
      jsonb_build_object(
        'id', t.id,
        'trabajo_id', t.trabajo_id,
        'descripcion', t.descripcion,
        'cantidad', t.cantidad,
        'precio', t.precio,
        'precio_unitario', t.precio_unitario,
        'completada', t.completada,
        'prioridad', t.prioridad,
        'fecha_vencimiento', t.fecha_vencimiento,
        'orden', t.orden
      ) order by case when t.prioridad = 'alta' then 0 else 1 end, t.orden
    )
  from tareas t
  join trabajos j on j.id = t.trabajo_id
  left join clientes c on c.id = j.cliente_id
  where t.completada = false
    and (t.prioridad = 'alta' or t.prioridad = 'media')
    and not exists (
      select 1
      from visitas v
      where v.trabajo_id = j.id
        and v.fecha >= current_date
        and v.estado <> 'cancelada'
    )
  group by j.id, j.titulo, c.nombre
  order by count(*) filter (where t.prioridad = 'alta') desc, count(t.id) desc;
$$;
