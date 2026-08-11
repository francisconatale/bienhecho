-- ============================================================================
-- BASELINE — estado actual de la base (2026-08-11)
-- Proyecto: presupuestito (presupuestito-web)
--
-- CONGELA el esquema actual de public + storage como UNA sola migración.
-- Reemplaza a los archivos legacy movidos a supabase/migrations_legacy/.
-- De aquí en más SOLO se agregan migraciones nuevas por encima (forward-only).
-- Idempotente: CREATE EXTENSION/BUCKET/POLICY con IF NOT EXISTS / DROP previo.
-- Generado con: pg_dump --schema=public --schema-only desde la BD local.
-- ============================================================================

-- Extensiones usadas por objetos public (presentes por defecto en Supabase;
-- se aseguran acá para reproducibilidad).
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================ STORAGE ============================
-- Buckets task-photos y company-logos + sus políticas de RLS.

-- task-photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-photos', 'task-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Usuarios pueden subir fotos" ON storage.objects;
CREATE POLICY "Usuarios pueden subir fotos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'task-photos' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Usuarios pueden ver sus propias fotos" ON storage.objects;
CREATE POLICY "Usuarios pueden ver sus propias fotos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'task-photos' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Usuarios pueden actualizar sus fotos" ON storage.objects;
CREATE POLICY "Usuarios pueden actualizar sus fotos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'task-photos' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Usuarios pueden borrar sus fotos" ON storage.objects;
CREATE POLICY "Usuarios pueden borrar sus fotos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'task-photos' AND auth.uid() = owner);

-- company-logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('company-logos', 'company-logos', true, 2097152, ARRAY['image/png', 'image/jpeg', 'image/jpg']::text[])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'company-logos');

DROP POLICY IF EXISTS "Users can upload their own logo" ON storage.objects;
CREATE POLICY "Users can upload their own logo" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'company-logos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update their own logo" ON storage.objects;
CREATE POLICY "Users can update their own logo" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'company-logos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete their own logo" ON storage.objects;
CREATE POLICY "Users can delete their own logo" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'company-logos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ==================== ESQUEMA PUBLIC (pg_dump) ====================SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA IF NOT EXISTS public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: job_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.job_status AS ENUM (
    'borrador',
    'presupuestado',
    'pagado'
);


ALTER TYPE public.job_status OWNER TO postgres;

--
-- Name: task_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.task_priority AS ENUM (
    'alta',
    'media',
    'baja'
);


ALTER TYPE public.task_priority OWNER TO postgres;

--
-- Name: transaccion_origen; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transaccion_origen AS ENUM (
    'automático',
    'manual'
);


ALTER TYPE public.transaccion_origen OWNER TO postgres;

--
-- Name: transaccion_tipo; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transaccion_tipo AS ENUM (
    'cargo',
    'abono'
);


ALTER TYPE public.transaccion_tipo OWNER TO postgres;

--
-- Name: visit_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.visit_status AS ENUM (
    'planificada',
    'realizada',
    'cancelada'
);


ALTER TYPE public.visit_status OWNER TO postgres;

--
-- Name: emitir_transaccion_cobro(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.emitir_transaccion_cobro() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_cliente_id      UUID;
    v_trabajo_titulo  TEXT;
    v_user_id         UUID;
BEGIN
    SELECT cliente_id, titulo, user_id
    INTO v_cliente_id, v_trabajo_titulo, v_user_id
    FROM public.trabajos WHERE id = NEW.trabajo_id;

    INSERT INTO public.transacciones
        (user_id, cliente_id, tipo, monto, concepto, fecha,
         referencia_trabajo_id, referencia_cobro_id, origen)
    VALUES
        (v_user_id, v_cliente_id, 'abono', NEW.monto_cobrado,
         'Cobro registrado: ' || v_trabajo_titulo, NEW.fecha_cobro,
         NEW.trabajo_id, NEW.id, 'automático');

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.emitir_transaccion_cobro() OWNER TO postgres;

--
-- Name: emitir_transaccion_presupuesto(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.emitir_transaccion_presupuesto() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    t_record RECORD;
    m_record RECORD;
BEGIN
    IF OLD.estado = 'borrador' AND NEW.estado = 'presupuestado' THEN
        -- Insertar transacciones por cada tarea
        FOR t_record IN SELECT * FROM public.tareas WHERE trabajo_id = NEW.id LOOP
            IF COALESCE(t_record.precio, 0) > 0 THEN
                INSERT INTO public.transacciones
                    (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_tarea_id, origen)
                VALUES
                    (NEW.user_id, NEW.cliente_id, 'cargo', t_record.precio,
                     'Tarea (Presupuesto): ' || t_record.descripcion, CURRENT_DATE, NEW.id, t_record.id, 'automático');
            END IF;
        END LOOP;

        -- Insertar transacciones por cada material
        FOR m_record IN SELECT * FROM public.materiales WHERE trabajo_id = NEW.id LOOP
            IF COALESCE(m_record.subtotal, 0) > 0 THEN
                INSERT INTO public.transacciones
                    (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_material_id, origen)
                VALUES
                    (NEW.user_id, NEW.cliente_id, 'cargo', m_record.subtotal,
                     'Material (Presupuesto): ' || m_record.nombre_material, CURRENT_DATE, NEW.id, m_record.id, 'automático');
            END IF;
        END LOOP;
        
        -- Nota: No insertamos el monto total genérico. Las tareas y materiales sumarán el total exacto.
        -- Los trabajos legacy ya pasaron por este trigger y tienen su registro anterior,
        -- por lo tanto no volverán a evaluarse en OLD.estado = 'borrador' AND NEW.estado = 'presupuestado'.
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.emitir_transaccion_presupuesto() OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.perfiles (id, nombre, email)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: on_material_change_update_transaccion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.on_material_change_update_transaccion() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_estado public.job_status;
    v_user_id UUID;
    v_cliente_id UUID;
    v_diferencia DECIMAL(10,2);
BEGIN
    IF TG_OP = 'DELETE' THEN
        SELECT estado, user_id, cliente_id INTO v_estado, v_user_id, v_cliente_id 
        FROM public.trabajos WHERE id = OLD.trabajo_id;
        
        IF v_estado = 'presupuestado' THEN
            DELETE FROM public.transacciones WHERE referencia_material_id = OLD.id;
            
            IF NOT FOUND AND COALESCE(OLD.subtotal, 0) > 0 THEN
                INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, origen)
                VALUES (v_user_id, v_cliente_id, 'abono', OLD.subtotal, 'Descuento por eliminación de material: ' || OLD.nombre_material, CURRENT_DATE, OLD.trabajo_id, 'automático');
            END IF;
        END IF;
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' THEN
        SELECT estado, user_id, cliente_id INTO v_estado, v_user_id, v_cliente_id 
        FROM public.trabajos WHERE id = NEW.trabajo_id;
        
        IF v_estado = 'presupuestado' AND COALESCE(NEW.subtotal, 0) > 0 THEN
            INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_material_id, origen)
            VALUES (v_user_id, v_cliente_id, 'cargo', NEW.subtotal, 'Material agregado: ' || NEW.nombre_material, CURRENT_DATE, NEW.trabajo_id, NEW.id, 'automático');
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.subtotal IS DISTINCT FROM NEW.subtotal THEN
            SELECT estado, user_id, cliente_id INTO v_estado, v_user_id, v_cliente_id 
            FROM public.trabajos WHERE id = NEW.trabajo_id;
            
            IF v_estado = 'presupuestado' THEN
                v_diferencia := COALESCE(NEW.subtotal, 0) - COALESCE(OLD.subtotal, 0);
                IF v_diferencia > 0 THEN
                    INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_material_id, origen)
                    VALUES (v_user_id, v_cliente_id, 'cargo', v_diferencia, 'Ajuste material (aumento): ' || NEW.nombre_material, CURRENT_DATE, NEW.trabajo_id, NEW.id, 'automático');
                ELSIF v_diferencia < 0 THEN
                    INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_material_id, origen)
                    VALUES (v_user_id, v_cliente_id, 'abono', ABS(v_diferencia), 'Ajuste material (rebaja): ' || NEW.nombre_material, CURRENT_DATE, NEW.trabajo_id, NEW.id, 'automático');
                END IF;
            END IF;
        END IF;
        RETURN NEW;
    END IF;
END;
$$;


ALTER FUNCTION public.on_material_change_update_transaccion() OWNER TO postgres;

--
-- Name: on_tarea_change_update_transaccion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.on_tarea_change_update_transaccion() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_estado public.job_status;
    v_user_id UUID;
    v_cliente_id UUID;
    v_diferencia DECIMAL(10,2);
BEGIN
    IF TG_OP = 'DELETE' THEN
        SELECT estado, user_id, cliente_id INTO v_estado, v_user_id, v_cliente_id 
        FROM public.trabajos WHERE id = OLD.trabajo_id;
        
        IF v_estado = 'presupuestado' THEN
            -- Se eliminan las transacciones generadas por esta tarea
            DELETE FROM public.transacciones WHERE referencia_tarea_id = OLD.id;
            
            -- Si la tarea fue agregada ANTES de este sistema (legacy job sin transacciones por item), 
            -- borrar la transaccion individual no hará nada. Por lo tanto debemos hacer un abono compensatorio.
            -- Determinamos si había transacciones:
            IF NOT FOUND AND COALESCE(OLD.precio, 0) > 0 THEN
                INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, origen)
                VALUES (v_user_id, v_cliente_id, 'abono', OLD.precio, 'Descuento por eliminación de tarea: ' || OLD.descripcion, CURRENT_DATE, OLD.trabajo_id, 'automático');
            END IF;
        END IF;
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' THEN
        SELECT estado, user_id, cliente_id INTO v_estado, v_user_id, v_cliente_id 
        FROM public.trabajos WHERE id = NEW.trabajo_id;
        
        IF v_estado = 'presupuestado' AND COALESCE(NEW.precio, 0) > 0 THEN
            INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_tarea_id, origen)
            VALUES (v_user_id, v_cliente_id, 'cargo', NEW.precio, 'Tarea agregada: ' || NEW.descripcion, CURRENT_DATE, NEW.trabajo_id, NEW.id, 'automático');
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.precio IS DISTINCT FROM NEW.precio THEN
            SELECT estado, user_id, cliente_id INTO v_estado, v_user_id, v_cliente_id 
            FROM public.trabajos WHERE id = NEW.trabajo_id;
            
            IF v_estado = 'presupuestado' THEN
                v_diferencia := COALESCE(NEW.precio, 0) - COALESCE(OLD.precio, 0);
                IF v_diferencia > 0 THEN
                    INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_tarea_id, origen)
                    VALUES (v_user_id, v_cliente_id, 'cargo', v_diferencia, 'Ajuste tarea (aumento): ' || NEW.descripcion, CURRENT_DATE, NEW.trabajo_id, NEW.id, 'automático');
                ELSIF v_diferencia < 0 THEN
                    INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_tarea_id, origen)
                    VALUES (v_user_id, v_cliente_id, 'abono', ABS(v_diferencia), 'Ajuste tarea (rebaja): ' || NEW.descripcion, CURRENT_DATE, NEW.trabajo_id, NEW.id, 'automático');
                END IF;
            END IF;
        END IF;
        RETURN NEW;
    END IF;
END;
$$;


ALTER FUNCTION public.on_tarea_change_update_transaccion() OWNER TO postgres;

--
-- Name: recalcular_trabajo_totales(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.recalcular_trabajo_totales() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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


ALTER FUNCTION public.recalcular_trabajo_totales() OWNER TO postgres;

--
-- Name: revertir_abono_cobro_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.revertir_abono_cobro_delete() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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


ALTER FUNCTION public.revertir_abono_cobro_delete() OWNER TO postgres;

--
-- Name: sync_abono_cobro_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sync_abono_cobro_update() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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


ALTER FUNCTION public.sync_abono_cobro_update() OWNER TO postgres;

--
-- Name: sync_material_subtotal(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sync_material_subtotal() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  NEW.subtotal := NEW.cantidad * NEW.precio_unitario;
  return NEW;
end;
$$;


ALTER FUNCTION public.sync_material_subtotal() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    nombre text NOT NULL,
    telefono text,
    email text,
    direccion text NOT NULL,
    notas text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- Name: cobros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cobros (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    trabajo_id uuid,
    monto_cobrado numeric(10,2) NOT NULL,
    fecha_cobro date NOT NULL,
    forma_pago text,
    notas text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid
);


ALTER TABLE public.cobros OWNER TO postgres;

--
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'IN_PROGRESS'::text NOT NULL,
    user_id uuid NOT NULL,
    cliente_id uuid,
    trabajo_id uuid
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- Name: materiales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materiales (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    trabajo_id uuid NOT NULL,
    nombre_material text NOT NULL,
    cantidad numeric(10,2) NOT NULL,
    precio_unitario numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    comprado boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid
);


ALTER TABLE public.materiales OWNER TO postgres;

--
-- Name: pending_steps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pending_steps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    task_id uuid NOT NULL,
    step_type text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pending_steps OWNER TO postgres;

--
-- Name: perfiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfiles (
    id uuid NOT NULL,
    nombre text NOT NULL,
    rubro text,
    created_at timestamp with time zone DEFAULT now(),
    direccion text,
    logo_path text,
    cuit text,
    matricula text
);


ALTER TABLE public.perfiles OWNER TO postgres;

--
-- Name: tareas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tareas (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    trabajo_id uuid NOT NULL,
    descripcion text NOT NULL,
    precio numeric(10,2),
    completada boolean DEFAULT false NOT NULL,
    prioridad public.task_priority,
    fecha_vencimiento date,
    orden integer DEFAULT 0 NOT NULL,
    user_id uuid,
    cantidad numeric DEFAULT 1,
    precio_unitario numeric
);


ALTER TABLE public.tareas OWNER TO postgres;

--
-- Name: task_photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_photos (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    tarea_id uuid NOT NULL,
    url text NOT NULL,
    descripcion text,
    orden integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid
);


ALTER TABLE public.task_photos OWNER TO postgres;

--
-- Name: tasks_snapshot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks_snapshot (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    description text NOT NULL,
    quantity numeric,
    status text DEFAULT 'PENDING'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    precio numeric
);


ALTER TABLE public.tasks_snapshot OWNER TO postgres;

--
-- Name: trabajos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trabajos (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    cliente_id uuid NOT NULL,
    titulo text NOT NULL,
    direccion text NOT NULL,
    descripcion text,
    presupuesto numeric(10,2) DEFAULT 0 NOT NULL,
    estado public.job_status DEFAULT 'borrador'::public.job_status NOT NULL,
    fecha_inicio date,
    fecha_fin_estimada date,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid,
    total_estimado numeric(10,2) DEFAULT 0 NOT NULL,
    total_cobrado numeric(10,2) DEFAULT 0 NOT NULL,
    saldo_pendiente numeric(10,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public.trabajos OWNER TO postgres;

--
-- Name: transacciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transacciones (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    cliente_id uuid NOT NULL,
    tipo public.transaccion_tipo NOT NULL,
    monto numeric(10,2) NOT NULL,
    concepto text NOT NULL,
    fecha date NOT NULL,
    referencia_trabajo_id uuid,
    referencia_cobro_id uuid,
    origen public.transaccion_origen DEFAULT 'automático'::public.transaccion_origen NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid,
    referencia_tarea_id uuid,
    referencia_material_id uuid
);


ALTER TABLE public.transacciones OWNER TO postgres;

--
-- Name: visita_tareas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visita_tareas (
    visita_id uuid NOT NULL,
    tarea_id uuid NOT NULL,
    nota_progreso text
);


ALTER TABLE public.visita_tareas OWNER TO postgres;

--
-- Name: visitas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visitas (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    trabajo_id uuid NOT NULL,
    fecha date NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone,
    notas text,
    estado public.visit_status DEFAULT 'planificada'::public.visit_status NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid
);


ALTER TABLE public.visitas OWNER TO postgres;

--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- Name: cobros cobros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cobros
    ADD CONSTRAINT cobros_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: materiales materiales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materiales
    ADD CONSTRAINT materiales_pkey PRIMARY KEY (id);


--
-- Name: pending_steps pending_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_steps
    ADD CONSTRAINT pending_steps_pkey PRIMARY KEY (id);


--
-- Name: perfiles perfiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles
    ADD CONSTRAINT perfiles_pkey PRIMARY KEY (id);


--
-- Name: tareas tareas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_pkey PRIMARY KEY (id);


--
-- Name: task_photos task_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_photos
    ADD CONSTRAINT task_photos_pkey PRIMARY KEY (id);


--
-- Name: tasks_snapshot tasks_snapshot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks_snapshot
    ADD CONSTRAINT tasks_snapshot_pkey PRIMARY KEY (id);


--
-- Name: trabajos trabajos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trabajos
    ADD CONSTRAINT trabajos_pkey PRIMARY KEY (id);


--
-- Name: transacciones transacciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacciones
    ADD CONSTRAINT transacciones_pkey PRIMARY KEY (id);


--
-- Name: visita_tareas visita_tareas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visita_tareas
    ADD CONSTRAINT visita_tareas_pkey PRIMARY KEY (visita_id, tarea_id);


--
-- Name: visitas visitas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitas
    ADD CONSTRAINT visitas_pkey PRIMARY KEY (id);


--
-- Name: idx_clientes_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clientes_user_id ON public.clientes USING btree (user_id);


--
-- Name: idx_cobros_trabajo_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cobros_trabajo_id ON public.cobros USING btree (trabajo_id);


--
-- Name: idx_cobros_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cobros_user_id ON public.cobros USING btree (user_id);


--
-- Name: idx_conversations_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_conversations_cliente_id ON public.conversations USING btree (cliente_id);


--
-- Name: idx_conversations_trabajo_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_conversations_trabajo_id ON public.conversations USING btree (trabajo_id);


--
-- Name: idx_conversations_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_conversations_user_id ON public.conversations USING btree (user_id);


--
-- Name: idx_materiales_trabajo_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_materiales_trabajo_id ON public.materiales USING btree (trabajo_id);


--
-- Name: idx_materiales_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_materiales_user_id ON public.materiales USING btree (user_id);


--
-- Name: idx_pending_steps_conversation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pending_steps_conversation_id ON public.pending_steps USING btree (conversation_id);


--
-- Name: idx_pending_steps_task_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pending_steps_task_id ON public.pending_steps USING btree (task_id);


--
-- Name: idx_tareas_trabajo_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tareas_trabajo_id ON public.tareas USING btree (trabajo_id);


--
-- Name: idx_tareas_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tareas_user_id ON public.tareas USING btree (user_id);


--
-- Name: idx_task_photos_tarea_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_photos_tarea_id ON public.task_photos USING btree (tarea_id);


--
-- Name: idx_task_photos_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_photos_user_id ON public.task_photos USING btree (user_id);


--
-- Name: idx_tasks_snapshot_conversation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_snapshot_conversation_id ON public.tasks_snapshot USING btree (conversation_id);


--
-- Name: idx_trabajos_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trabajos_cliente_id ON public.trabajos USING btree (cliente_id);


--
-- Name: idx_trabajos_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trabajos_user_id ON public.trabajos USING btree (user_id);


--
-- Name: idx_transacciones_cliente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transacciones_cliente_id ON public.transacciones USING btree (cliente_id);


--
-- Name: idx_transacciones_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transacciones_user_id ON public.transacciones USING btree (user_id);


--
-- Name: idx_visitas_trabajo_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_visitas_trabajo_id ON public.visitas USING btree (trabajo_id);


--
-- Name: idx_visitas_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_visitas_user_id ON public.visitas USING btree (user_id);


--
-- Name: cobros on_cobro_change_recalcular; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_cobro_change_recalcular AFTER INSERT OR DELETE OR UPDATE OF monto_cobrado ON public.cobros FOR EACH ROW EXECUTE FUNCTION public.recalcular_trabajo_totales();


--
-- Name: cobros on_cobro_delete_revert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_cobro_delete_revert AFTER DELETE ON public.cobros FOR EACH ROW EXECUTE FUNCTION public.revertir_abono_cobro_delete();


--
-- Name: cobros on_cobro_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_cobro_insert AFTER INSERT ON public.cobros FOR EACH ROW EXECUTE FUNCTION public.emitir_transaccion_cobro();


--
-- Name: cobros on_cobro_update_sync_abono; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_cobro_update_sync_abono AFTER UPDATE OF monto_cobrado, fecha_cobro ON public.cobros FOR EACH ROW EXECUTE FUNCTION public.sync_abono_cobro_update();


--
-- Name: materiales on_material_change_recalcular; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_material_change_recalcular AFTER INSERT OR DELETE OR UPDATE OF cantidad, precio_unitario, subtotal ON public.materiales FOR EACH ROW EXECUTE FUNCTION public.recalcular_trabajo_totales();


--
-- Name: materiales on_material_change_update_transaccion_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_material_change_update_transaccion_trigger AFTER INSERT OR DELETE OR UPDATE OF subtotal ON public.materiales FOR EACH ROW EXECUTE FUNCTION public.on_material_change_update_transaccion();


--
-- Name: materiales on_material_subtotal_sync; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_material_subtotal_sync BEFORE INSERT OR UPDATE OF cantidad, precio_unitario ON public.materiales FOR EACH ROW EXECUTE FUNCTION public.sync_material_subtotal();


--
-- Name: tareas on_tarea_change_recalcular; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_tarea_change_recalcular AFTER INSERT OR DELETE OR UPDATE OF precio, cantidad, precio_unitario ON public.tareas FOR EACH ROW EXECUTE FUNCTION public.recalcular_trabajo_totales();


--
-- Name: tareas on_tarea_change_update_transaccion_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_tarea_change_update_transaccion_trigger AFTER INSERT OR DELETE OR UPDATE OF precio ON public.tareas FOR EACH ROW EXECUTE FUNCTION public.on_tarea_change_update_transaccion();


--
-- Name: trabajos on_trabajo_estado_presupuestado; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_trabajo_estado_presupuestado AFTER UPDATE OF estado ON public.trabajos FOR EACH ROW EXECUTE FUNCTION public.emitir_transaccion_presupuesto();


--
-- Name: clientes clientes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: cobros cobros_trabajo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cobros
    ADD CONSTRAINT cobros_trabajo_id_fkey FOREIGN KEY (trabajo_id) REFERENCES public.trabajos(id) ON DELETE SET NULL;


--
-- Name: cobros cobros_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cobros
    ADD CONSTRAINT cobros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: conversations conversations_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;


--
-- Name: conversations conversations_trabajo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_trabajo_id_fkey FOREIGN KEY (trabajo_id) REFERENCES public.trabajos(id) ON DELETE SET NULL;


--
-- Name: conversations conversations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: materiales materiales_trabajo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materiales
    ADD CONSTRAINT materiales_trabajo_id_fkey FOREIGN KEY (trabajo_id) REFERENCES public.trabajos(id) ON DELETE CASCADE;


--
-- Name: materiales materiales_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materiales
    ADD CONSTRAINT materiales_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: pending_steps pending_steps_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_steps
    ADD CONSTRAINT pending_steps_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: pending_steps pending_steps_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_steps
    ADD CONSTRAINT pending_steps_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks_snapshot(id) ON DELETE CASCADE;


--
-- Name: perfiles perfiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles
    ADD CONSTRAINT perfiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tareas tareas_trabajo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_trabajo_id_fkey FOREIGN KEY (trabajo_id) REFERENCES public.trabajos(id) ON DELETE CASCADE;


--
-- Name: tareas tareas_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: task_photos task_photos_tarea_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_photos
    ADD CONSTRAINT task_photos_tarea_id_fkey FOREIGN KEY (tarea_id) REFERENCES public.tareas(id) ON DELETE CASCADE;


--
-- Name: task_photos task_photos_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_photos
    ADD CONSTRAINT task_photos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tasks_snapshot tasks_snapshot_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks_snapshot
    ADD CONSTRAINT tasks_snapshot_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: trabajos trabajos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trabajos
    ADD CONSTRAINT trabajos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: trabajos trabajos_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trabajos
    ADD CONSTRAINT trabajos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: transacciones transacciones_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacciones
    ADD CONSTRAINT transacciones_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: transacciones transacciones_referencia_cobro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacciones
    ADD CONSTRAINT transacciones_referencia_cobro_id_fkey FOREIGN KEY (referencia_cobro_id) REFERENCES public.cobros(id) ON DELETE SET NULL;


--
-- Name: transacciones transacciones_referencia_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacciones
    ADD CONSTRAINT transacciones_referencia_material_id_fkey FOREIGN KEY (referencia_material_id) REFERENCES public.materiales(id) ON DELETE SET NULL;


--
-- Name: transacciones transacciones_referencia_tarea_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacciones
    ADD CONSTRAINT transacciones_referencia_tarea_id_fkey FOREIGN KEY (referencia_tarea_id) REFERENCES public.tareas(id) ON DELETE SET NULL;


--
-- Name: transacciones transacciones_referencia_trabajo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacciones
    ADD CONSTRAINT transacciones_referencia_trabajo_id_fkey FOREIGN KEY (referencia_trabajo_id) REFERENCES public.trabajos(id) ON DELETE CASCADE;


--
-- Name: transacciones transacciones_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacciones
    ADD CONSTRAINT transacciones_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: visita_tareas visita_tareas_tarea_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visita_tareas
    ADD CONSTRAINT visita_tareas_tarea_id_fkey FOREIGN KEY (tarea_id) REFERENCES public.tareas(id) ON DELETE CASCADE;


--
-- Name: visita_tareas visita_tareas_visita_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visita_tareas
    ADD CONSTRAINT visita_tareas_visita_id_fkey FOREIGN KEY (visita_id) REFERENCES public.visitas(id) ON DELETE CASCADE;


--
-- Name: visitas visitas_trabajo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitas
    ADD CONSTRAINT visitas_trabajo_id_fkey FOREIGN KEY (trabajo_id) REFERENCES public.trabajos(id) ON DELETE CASCADE;


--
-- Name: visitas visitas_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitas
    ADD CONSTRAINT visitas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: clientes Users manage their own clientes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users manage their own clientes" ON public.clientes USING ((auth.uid() = user_id));


--
-- Name: cobros Users manage their own cobros; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users manage their own cobros" ON public.cobros USING ((auth.uid() = user_id));


--
-- Name: materiales Users manage their own materiales; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users manage their own materiales" ON public.materiales USING ((auth.uid() = user_id));


--
-- Name: perfiles Users manage their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users manage their own profile" ON public.perfiles USING ((auth.uid() = id));


--
-- Name: tareas Users manage their own tareas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users manage their own tareas" ON public.tareas USING ((auth.uid() = user_id));


--
-- Name: task_photos Users manage their own task_photos; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users manage their own task_photos" ON public.task_photos USING ((auth.uid() = user_id));


--
-- Name: trabajos Users manage their own trabajos; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users manage their own trabajos" ON public.trabajos USING ((auth.uid() = user_id));


--
-- Name: transacciones Users manage their own transacciones; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users manage their own transacciones" ON public.transacciones USING ((auth.uid() = user_id));


--
-- Name: visita_tareas Users manage their own visita_tareas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users manage their own visita_tareas" ON public.visita_tareas USING ((EXISTS ( SELECT 1
   FROM public.visitas
  WHERE ((visitas.id = visita_tareas.visita_id) AND (visitas.user_id = auth.uid())))));


--
-- Name: visitas Users manage their own visitas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users manage their own visitas" ON public.visitas USING ((auth.uid() = user_id));


--
-- Name: clientes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

--
-- Name: cobros; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.cobros ENABLE ROW LEVEL SECURITY;

--
-- Name: conversations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

--
-- Name: materiales; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.materiales ENABLE ROW LEVEL SECURITY;

--
-- Name: pending_steps; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.pending_steps ENABLE ROW LEVEL SECURITY;

--
-- Name: perfiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

--
-- Name: tareas; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tareas ENABLE ROW LEVEL SECURITY;

--
-- Name: task_photos; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.task_photos ENABLE ROW LEVEL SECURITY;

--
-- Name: tasks_snapshot; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tasks_snapshot ENABLE ROW LEVEL SECURITY;

--
-- Name: trabajos; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trabajos ENABLE ROW LEVEL SECURITY;

--
-- Name: transacciones; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.transacciones ENABLE ROW LEVEL SECURITY;

--
-- Name: perfiles usuarios_su_perfil; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY usuarios_su_perfil ON public.perfiles USING ((id = auth.uid()));


--
-- Name: conversations usuarios_sus_conversaciones; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY usuarios_sus_conversaciones ON public.conversations USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: pending_steps usuarios_sus_pending_steps; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY usuarios_sus_pending_steps ON public.pending_steps USING ((EXISTS ( SELECT 1
   FROM public.conversations
  WHERE ((conversations.id = pending_steps.conversation_id) AND (conversations.user_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.conversations
  WHERE ((conversations.id = pending_steps.conversation_id) AND (conversations.user_id = auth.uid())))));


--
-- Name: tasks_snapshot usuarios_sus_tasks_snapshot; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY usuarios_sus_tasks_snapshot ON public.tasks_snapshot USING ((EXISTS ( SELECT 1
   FROM public.conversations
  WHERE ((conversations.id = tasks_snapshot.conversation_id) AND (conversations.user_id = auth.uid()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.conversations
  WHERE ((conversations.id = tasks_snapshot.conversation_id) AND (conversations.user_id = auth.uid())))));


--
-- Name: visita_tareas; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.visita_tareas ENABLE ROW LEVEL SECURITY;

--
-- Name: visitas; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.visitas ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: FUNCTION emitir_transaccion_cobro(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.emitir_transaccion_cobro() TO anon;
GRANT ALL ON FUNCTION public.emitir_transaccion_cobro() TO authenticated;
GRANT ALL ON FUNCTION public.emitir_transaccion_cobro() TO service_role;


--
-- Name: FUNCTION emitir_transaccion_presupuesto(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.emitir_transaccion_presupuesto() TO anon;
GRANT ALL ON FUNCTION public.emitir_transaccion_presupuesto() TO authenticated;
GRANT ALL ON FUNCTION public.emitir_transaccion_presupuesto() TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION on_material_change_update_transaccion(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.on_material_change_update_transaccion() TO anon;
GRANT ALL ON FUNCTION public.on_material_change_update_transaccion() TO authenticated;
GRANT ALL ON FUNCTION public.on_material_change_update_transaccion() TO service_role;


--
-- Name: FUNCTION on_tarea_change_update_transaccion(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.on_tarea_change_update_transaccion() TO anon;
GRANT ALL ON FUNCTION public.on_tarea_change_update_transaccion() TO authenticated;
GRANT ALL ON FUNCTION public.on_tarea_change_update_transaccion() TO service_role;


--
-- Name: FUNCTION recalcular_trabajo_totales(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.recalcular_trabajo_totales() TO anon;
GRANT ALL ON FUNCTION public.recalcular_trabajo_totales() TO authenticated;
GRANT ALL ON FUNCTION public.recalcular_trabajo_totales() TO service_role;


--
-- Name: FUNCTION revertir_abono_cobro_delete(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.revertir_abono_cobro_delete() TO anon;
GRANT ALL ON FUNCTION public.revertir_abono_cobro_delete() TO authenticated;
GRANT ALL ON FUNCTION public.revertir_abono_cobro_delete() TO service_role;


--
-- Name: FUNCTION sync_abono_cobro_update(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.sync_abono_cobro_update() TO anon;
GRANT ALL ON FUNCTION public.sync_abono_cobro_update() TO authenticated;
GRANT ALL ON FUNCTION public.sync_abono_cobro_update() TO service_role;


--
-- Name: FUNCTION sync_material_subtotal(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.sync_material_subtotal() TO anon;
GRANT ALL ON FUNCTION public.sync_material_subtotal() TO authenticated;
GRANT ALL ON FUNCTION public.sync_material_subtotal() TO service_role;


--
-- Name: TABLE clientes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.clientes TO anon;
GRANT ALL ON TABLE public.clientes TO authenticated;
GRANT ALL ON TABLE public.clientes TO service_role;


--
-- Name: TABLE cobros; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cobros TO anon;
GRANT ALL ON TABLE public.cobros TO authenticated;
GRANT ALL ON TABLE public.cobros TO service_role;


--
-- Name: TABLE conversations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.conversations TO anon;
GRANT ALL ON TABLE public.conversations TO authenticated;
GRANT ALL ON TABLE public.conversations TO service_role;


--
-- Name: TABLE materiales; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.materiales TO anon;
GRANT ALL ON TABLE public.materiales TO authenticated;
GRANT ALL ON TABLE public.materiales TO service_role;


--
-- Name: TABLE pending_steps; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pending_steps TO anon;
GRANT ALL ON TABLE public.pending_steps TO authenticated;
GRANT ALL ON TABLE public.pending_steps TO service_role;


--
-- Name: TABLE perfiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.perfiles TO anon;
GRANT ALL ON TABLE public.perfiles TO authenticated;
GRANT ALL ON TABLE public.perfiles TO service_role;


--
-- Name: TABLE tareas; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tareas TO anon;
GRANT ALL ON TABLE public.tareas TO authenticated;
GRANT ALL ON TABLE public.tareas TO service_role;


--
-- Name: TABLE task_photos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.task_photos TO anon;
GRANT ALL ON TABLE public.task_photos TO authenticated;
GRANT ALL ON TABLE public.task_photos TO service_role;


--
-- Name: TABLE tasks_snapshot; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tasks_snapshot TO anon;
GRANT ALL ON TABLE public.tasks_snapshot TO authenticated;
GRANT ALL ON TABLE public.tasks_snapshot TO service_role;


--
-- Name: TABLE trabajos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trabajos TO anon;
GRANT ALL ON TABLE public.trabajos TO authenticated;
GRANT ALL ON TABLE public.trabajos TO service_role;


--
-- Name: TABLE transacciones; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transacciones TO anon;
GRANT ALL ON TABLE public.transacciones TO authenticated;
GRANT ALL ON TABLE public.transacciones TO service_role;


--
-- Name: TABLE visita_tareas; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.visita_tareas TO anon;
GRANT ALL ON TABLE public.visita_tareas TO authenticated;
GRANT ALL ON TABLE public.visita_tareas TO service_role;


--
-- Name: TABLE visitas; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.visitas TO anon;
GRANT ALL ON TABLE public.visitas TO authenticated;
GRANT ALL ON TABLE public.visitas TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- PostgreSQL database dump complete
-- fin del dump
