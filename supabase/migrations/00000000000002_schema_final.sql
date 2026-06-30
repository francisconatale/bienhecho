-- =============================================================================
-- PRESUPUESTITO — SCHEMA COMPLETO Y DEFINITIVO
-- Versión: 2026-06-29
--
-- Este archivo reemplaza todas las migraciones anteriores.
-- Incluye:
--   1. Extensiones y tipos (ENUMs)
--   2. Tablas con user_id (multi-tenancy desde el inicio)
--   3. Índices de performance
--   4. Triggers de lógica de negocio (con user_id correcto)
--   5. RLS habilitado + políticas de producción
--   6. Storage bucket "task-photos"
--
-- Instrucciones: pegar completo en el SQL Editor de Supabase y ejecutar.
-- =============================================================================


-- =============================================================================
-- 1. EXTENSIONES Y TIPOS (ENUMs)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE public.job_status AS ENUM ('borrador', 'presupuestado', 'pagado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.task_priority AS ENUM ('alta', 'media', 'baja');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.visit_status AS ENUM ('planificada', 'realizada', 'cancelada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.transaccion_tipo AS ENUM ('cargo', 'abono');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.transaccion_origen AS ENUM ('automático', 'manual');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================================
-- 2. TABLAS (con user_id desde el origen)
-- =============================================================================

-- ── clientes ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.clientes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES auth.users(id),
    nombre      TEXT NOT NULL,
    telefono    TEXT,
    email       TEXT,
    direccion   TEXT NOT NULL,
    notas       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── trabajos ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.trabajos (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES auth.users(id),
    cliente_id          UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    titulo              TEXT NOT NULL,
    direccion           TEXT NOT NULL,
    descripcion         TEXT,
    presupuesto         DECIMAL(10,2) NOT NULL DEFAULT 0,
    estado              public.job_status NOT NULL DEFAULT 'borrador',
    fecha_inicio        DATE,
    fecha_fin_estimada  DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── tareas ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tareas (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id           UUID NOT NULL REFERENCES auth.users(id),
    trabajo_id        UUID NOT NULL REFERENCES public.trabajos(id) ON DELETE CASCADE,
    descripcion       TEXT NOT NULL,
    precio            DECIMAL(10,2),
    completada        BOOLEAN NOT NULL DEFAULT false,
    prioridad         public.task_priority,
    fecha_vencimiento DATE,
    orden             INTEGER NOT NULL DEFAULT 0
);

-- ── task_photos ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.task_photos (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES auth.users(id),
    tarea_id    UUID NOT NULL REFERENCES public.tareas(id) ON DELETE CASCADE,
    url         TEXT NOT NULL,
    descripcion TEXT,
    orden       INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── visitas ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.visitas (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES auth.users(id),
    trabajo_id  UUID NOT NULL REFERENCES public.trabajos(id) ON DELETE CASCADE,
    fecha       DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin    TIME,
    notas       TEXT,
    estado      public.visit_status NOT NULL DEFAULT 'planificada',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── visita_tareas (junction) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.visita_tareas (
    visita_id      UUID REFERENCES public.visitas(id) ON DELETE CASCADE,
    tarea_id       UUID REFERENCES public.tareas(id) ON DELETE CASCADE,
    nota_progreso  TEXT,
    PRIMARY KEY (visita_id, tarea_id)
);

-- ── materiales ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.materiales (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID NOT NULL REFERENCES auth.users(id),
    trabajo_id       UUID NOT NULL REFERENCES public.trabajos(id) ON DELETE CASCADE,
    nombre_material  TEXT NOT NULL,
    cantidad         DECIMAL(10,2) NOT NULL,
    precio_unitario  DECIMAL(10,2) NOT NULL,
    subtotal         DECIMAL(10,2) NOT NULL,
    comprado         BOOLEAN NOT NULL DEFAULT false,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── cobros ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cobros (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID NOT NULL REFERENCES auth.users(id),
    trabajo_id     UUID NOT NULL REFERENCES public.trabajos(id) ON DELETE CASCADE,
    monto_cobrado  DECIMAL(10,2) NOT NULL,
    fecha_cobro    DATE NOT NULL,
    forma_pago     TEXT,
    notas          TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── transacciones (cuenta corriente) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transacciones (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id               UUID NOT NULL REFERENCES auth.users(id),
    cliente_id            UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    tipo                  public.transaccion_tipo NOT NULL,
    monto                 DECIMAL(10,2) NOT NULL,
    concepto              TEXT NOT NULL,
    fecha                 DATE NOT NULL,
    referencia_trabajo_id UUID REFERENCES public.trabajos(id) ON DELETE SET NULL,
    referencia_cobro_id   UUID REFERENCES public.cobros(id) ON DELETE SET NULL,
    origen                public.transaccion_origen NOT NULL DEFAULT 'automático',
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── perfiles ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.perfiles (
    id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre     TEXT,
    email      TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- =============================================================================
-- 3. ÍNDICES DE PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_clientes_user_id              ON public.clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_trabajos_user_id              ON public.trabajos(user_id);
CREATE INDEX IF NOT EXISTS idx_trabajos_cliente_id           ON public.trabajos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_tareas_user_id                ON public.tareas(user_id);
CREATE INDEX IF NOT EXISTS idx_tareas_trabajo_id             ON public.tareas(trabajo_id);
CREATE INDEX IF NOT EXISTS idx_task_photos_user_id           ON public.task_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_task_photos_tarea_id          ON public.task_photos(tarea_id);
CREATE INDEX IF NOT EXISTS idx_visitas_user_id               ON public.visitas(user_id);
CREATE INDEX IF NOT EXISTS idx_visitas_trabajo_id            ON public.visitas(trabajo_id);
CREATE INDEX IF NOT EXISTS idx_materiales_user_id            ON public.materiales(user_id);
CREATE INDEX IF NOT EXISTS idx_materiales_trabajo_id         ON public.materiales(trabajo_id);
CREATE INDEX IF NOT EXISTS idx_cobros_user_id                ON public.cobros(user_id);
CREATE INDEX IF NOT EXISTS idx_cobros_trabajo_id             ON public.cobros(trabajo_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_user_id         ON public.transacciones(user_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_cliente_id      ON public.transacciones(cliente_id);


-- =============================================================================
-- 4. TRIGGERS DE LÓGICA DE NEGOCIO
-- =============================================================================

-- ── Trigger A: Recalcular presupuesto del trabajo al cambiar precio de tarea ──
CREATE OR REPLACE FUNCTION update_trabajo_presupuesto()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE public.trabajos
        SET presupuesto = COALESCE((
            SELECT SUM(precio) FROM public.tareas
            WHERE trabajo_id = OLD.trabajo_id
        ), 0)
        WHERE id = OLD.trabajo_id;
        RETURN OLD;
    ELSE
        UPDATE public.trabajos
        SET presupuesto = COALESCE((
            SELECT SUM(precio) FROM public.tareas
            WHERE trabajo_id = NEW.trabajo_id
        ), 0)
        WHERE id = NEW.trabajo_id;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_tarea_change_update_presupuesto ON public.tareas;
CREATE TRIGGER on_tarea_change_update_presupuesto
AFTER INSERT OR UPDATE OF precio OR DELETE ON public.tareas
FOR EACH ROW EXECUTE FUNCTION update_trabajo_presupuesto();


-- ── Trigger B: Crear transacción "cargo" al emitir presupuesto ────────────────
-- IMPORTANTE: incluye user_id para respetar RLS en transacciones.
CREATE OR REPLACE FUNCTION emitir_transaccion_presupuesto()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.estado = 'borrador' AND NEW.estado = 'presupuestado' THEN
        INSERT INTO public.transacciones
            (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, origen)
        VALUES
            (NEW.user_id, NEW.cliente_id, 'cargo', NEW.presupuesto,
             'Emisión de presupuesto: ' || NEW.titulo, CURRENT_DATE, NEW.id, 'automático');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_trabajo_estado_presupuestado ON public.trabajos;
CREATE TRIGGER on_trabajo_estado_presupuestado
AFTER UPDATE OF estado ON public.trabajos
FOR EACH ROW EXECUTE FUNCTION emitir_transaccion_presupuesto();


-- ── Trigger C: Crear transacción "abono" al registrar un cobro ────────────────
-- IMPORTANTE: incluye user_id para respetar RLS en transacciones.
CREATE OR REPLACE FUNCTION emitir_transaccion_cobro()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_cobro_insert ON public.cobros;
CREATE TRIGGER on_cobro_insert
AFTER INSERT ON public.cobros
FOR EACH ROW EXECUTE FUNCTION emitir_transaccion_cobro();


-- ── Trigger D: Auto-marcar trabajo como "pagado" si saldo cubierto ────────────
CREATE OR REPLACE FUNCTION check_trabajo_pagado()
RETURNS TRIGGER AS $$
DECLARE
    v_total_cobrado    DECIMAL(10,2);
    v_presupuesto      DECIMAL(10,2);
    v_total_materiales DECIMAL(10,2);
    v_estado           public.job_status;
BEGIN
    SELECT presupuesto, estado
    INTO v_presupuesto, v_estado
    FROM public.trabajos WHERE id = NEW.trabajo_id;

    IF v_estado = 'presupuestado' THEN
        SELECT COALESCE(SUM(monto_cobrado), 0) INTO v_total_cobrado
        FROM public.cobros WHERE trabajo_id = NEW.trabajo_id;

        SELECT COALESCE(SUM(subtotal), 0) INTO v_total_materiales
        FROM public.materiales WHERE trabajo_id = NEW.trabajo_id;

        IF v_total_cobrado >= (v_presupuesto + v_total_materiales) THEN
            UPDATE public.trabajos SET estado = 'pagado' WHERE id = NEW.trabajo_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_cobro_insert_check_pagado ON public.cobros;
CREATE TRIGGER on_cobro_insert_check_pagado
AFTER INSERT OR UPDATE ON public.cobros
FOR EACH ROW EXECUTE FUNCTION check_trabajo_pagado();

-- ── Trigger E: Auto-crear perfil al registrar usuario ─────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.perfiles (id, nombre, email)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.clientes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trabajos       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tareas         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_photos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visita_tareas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiales     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cobros         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacciones  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles       ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas previas (dev o duplicadas)
DROP POLICY IF EXISTS "Enable all for development"           ON public.clientes;
DROP POLICY IF EXISTS "Enable all for development"           ON public.trabajos;
DROP POLICY IF EXISTS "Enable all for development"           ON public.tareas;
DROP POLICY IF EXISTS "Enable all for development"           ON public.task_photos;
DROP POLICY IF EXISTS "Enable all for development"           ON public.visitas;
DROP POLICY IF EXISTS "Enable all for development"           ON public.visita_tareas;
DROP POLICY IF EXISTS "Enable all for development"           ON public.materiales;
DROP POLICY IF EXISTS "Enable all for development"           ON public.cobros;
DROP POLICY IF EXISTS "Enable all for development"           ON public.transacciones;
DROP POLICY IF EXISTS "usuarios_sus_clientes"                ON public.clientes;
DROP POLICY IF EXISTS "usuarios_sus_trabajos"                ON public.trabajos;
DROP POLICY IF EXISTS "usuarios_sus_tareas"                  ON public.tareas;
DROP POLICY IF EXISTS "usuarios_sus_photos"                  ON public.task_photos;
DROP POLICY IF EXISTS "usuarios_sus_visitas"                 ON public.visitas;
DROP POLICY IF EXISTS "usuarios_visita_tareas"               ON public.visita_tareas;
DROP POLICY IF EXISTS "usuarios_sus_materiales"              ON public.materiales;
DROP POLICY IF EXISTS "usuarios_sus_cobros"                  ON public.cobros;
DROP POLICY IF EXISTS "usuarios_sus_transacciones"           ON public.transacciones;
DROP POLICY IF EXISTS "Users manage their own clientes"      ON public.clientes;
DROP POLICY IF EXISTS "Users manage their own trabajos"      ON public.trabajos;
DROP POLICY IF EXISTS "Users manage their own tareas"        ON public.tareas;
DROP POLICY IF EXISTS "Users manage their own task_photos"   ON public.task_photos;
DROP POLICY IF EXISTS "Users manage their own visitas"       ON public.visitas;
DROP POLICY IF EXISTS "Users manage their own visita_tareas" ON public.visita_tareas;
DROP POLICY IF EXISTS "Users manage their own materiales"    ON public.materiales;
DROP POLICY IF EXISTS "Users manage their own cobros"        ON public.cobros;
DROP POLICY IF EXISTS "Users manage their own transacciones" ON public.transacciones;

-- Crear políticas definitivas de producción
CREATE POLICY "Users manage their own clientes"
    ON public.clientes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage their own trabajos"
    ON public.trabajos FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage their own tareas"
    ON public.tareas FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage their own task_photos"
    ON public.task_photos FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage their own visitas"
    ON public.visitas FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage their own materiales"
    ON public.materiales FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage their own cobros"
    ON public.cobros FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage their own transacciones"
    ON public.transacciones FOR ALL USING (auth.uid() = user_id);

-- visita_tareas: tabla junction sin user_id → acceso vía visitas
CREATE POLICY "Users manage their own visita_tareas"
    ON public.visita_tareas FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.visitas
            WHERE visitas.id = visita_id
            AND visitas.user_id = auth.uid()
        )
    );

-- perfiles: cada usuario puede leer y modificar solo el suyo
CREATE POLICY "Users manage their own profile"
    ON public.perfiles FOR ALL USING (auth.uid() = id);


-- =============================================================================
-- 6. STORAGE — bucket "task-photos"
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('task-photos', 'task-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Usuarios pueden subir fotos"            ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias fotos"  ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus fotos"   ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden borrar sus fotos"       ON storage.objects;

CREATE POLICY "Usuarios pueden subir fotos"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'task-photos' AND auth.uid() = owner);

CREATE POLICY "Usuarios pueden ver sus propias fotos"
    ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'task-photos' AND auth.uid() = owner);

CREATE POLICY "Usuarios pueden actualizar sus fotos"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'task-photos' AND auth.uid() = owner);

CREATE POLICY "Usuarios pueden borrar sus fotos"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'task-photos' AND auth.uid() = owner);
