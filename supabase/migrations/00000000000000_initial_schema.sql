-- Supabase Database Schema para "Bien Hecho"
-- Basado en database_relations.md

-- ==========================================
-- 1. EXTENSIONES Y TIPOS (ENUMS)
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE public.job_status AS ENUM ('borrador', 'presupuestado', 'pagado');
CREATE TYPE public.task_priority AS ENUM ('alta', 'media', 'baja');
CREATE TYPE public.visit_status AS ENUM ('planificada', 'realizada', 'cancelada');
CREATE TYPE public.transaccion_tipo AS ENUM ('cargo', 'abono');
CREATE TYPE public.transaccion_origen AS ENUM ('automático', 'manual');

-- ==========================================
-- 2. TABLAS (MÓDULOS)
-- ==========================================

-- Tabla: clientes
CREATE TABLE public.clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    email TEXT,
    direccion TEXT NOT NULL,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla: trabajos
CREATE TABLE public.trabajos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
    titulo TEXT NOT NULL,
    direccion TEXT NOT NULL,
    descripcion TEXT,
    presupuesto DECIMAL(10,2) NOT NULL DEFAULT 0,
    estado public.job_status NOT NULL DEFAULT 'borrador',
    fecha_inicio DATE,
    fecha_fin_estimada DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla: tareas
CREATE TABLE public.tareas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trabajo_id UUID REFERENCES public.trabajos(id) ON DELETE CASCADE NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2),
    completada BOOLEAN NOT NULL DEFAULT false,
    prioridad public.task_priority,
    fecha_vencimiento DATE,
    orden INTEGER NOT NULL DEFAULT 0
);

-- Tabla: task_photos
CREATE TABLE public.task_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tarea_id UUID REFERENCES public.tareas(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    descripcion TEXT,
    orden INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla: visitas
CREATE TABLE public.visitas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trabajo_id UUID REFERENCES public.trabajos(id) ON DELETE CASCADE NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME,
    notas TEXT,
    estado public.visit_status NOT NULL DEFAULT 'planificada',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla Intermedia: visita_tareas
CREATE TABLE public.visita_tareas (
    visita_id UUID REFERENCES public.visitas(id) ON DELETE CASCADE,
    tarea_id UUID REFERENCES public.tareas(id) ON DELETE CASCADE,
    nota_progreso TEXT,
    PRIMARY KEY (visita_id, tarea_id)
);

-- Tabla: materiales
CREATE TABLE public.materiales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trabajo_id UUID REFERENCES public.trabajos(id) ON DELETE CASCADE NOT NULL,
    nombre_material TEXT NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    comprado BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla: cobros
CREATE TABLE public.cobros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trabajo_id UUID REFERENCES public.trabajos(id) ON DELETE CASCADE NOT NULL,
    monto_cobrado DECIMAL(10,2) NOT NULL,
    fecha_cobro DATE NOT NULL,
    forma_pago TEXT,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla: transacciones (Cuenta Corriente)
CREATE TABLE public.transacciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
    tipo public.transaccion_tipo NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    concepto TEXT NOT NULL,
    fecha DATE NOT NULL,
    referencia_trabajo_id UUID REFERENCES public.trabajos(id) ON DELETE SET NULL,
    referencia_cobro_id UUID REFERENCES public.cobros(id) ON DELETE SET NULL,
    origen public.transaccion_origen NOT NULL DEFAULT 'automático',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================
-- 3. TRIGGERS DE LOGICA DE NEGOCIO
-- ==========================================

-- Trigger A: Actualizar presupuesto del trabajo (suma de precios de tareas)
CREATE OR REPLACE FUNCTION update_trabajo_presupuesto()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE trabajos
        SET presupuesto = (
            SELECT COALESCE(SUM(precio), 0)
            FROM tareas
            WHERE trabajo_id = OLD.trabajo_id
        )
        WHERE id = OLD.trabajo_id;
        RETURN OLD;
    ELSE
        UPDATE trabajos
        SET presupuesto = (
            SELECT COALESCE(SUM(precio), 0)
            FROM tareas
            WHERE trabajo_id = NEW.trabajo_id
        )
        WHERE id = NEW.trabajo_id;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_tarea_change_update_presupuesto
AFTER INSERT OR UPDATE OF precio OR DELETE ON tareas
FOR EACH ROW EXECUTE FUNCTION update_trabajo_presupuesto();


-- Trigger B: Transacción de "cargo" cuando Trabajo pasa a 'presupuestado'
CREATE OR REPLACE FUNCTION emitir_transaccion_presupuesto()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.estado = 'borrador' AND NEW.estado = 'presupuestado' THEN
        INSERT INTO transacciones (cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, origen)
        VALUES (
            NEW.cliente_id, 
            'cargo', 
            NEW.presupuesto, 
            'Emisión de presupuesto: ' || NEW.titulo, 
            CURRENT_DATE, 
            NEW.id, 
            'automático'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_trabajo_estado_presupuestado
AFTER UPDATE OF estado ON trabajos
FOR EACH ROW EXECUTE FUNCTION emitir_transaccion_presupuesto();


-- Trigger C: Transacción de "abono" cuando se registra un Cobro
CREATE OR REPLACE FUNCTION emitir_transaccion_cobro()
RETURNS TRIGGER AS $$
DECLARE
    v_cliente_id UUID;
    v_trabajo_titulo TEXT;
BEGIN
    SELECT cliente_id, titulo INTO v_cliente_id, v_trabajo_titulo 
    FROM trabajos WHERE id = NEW.trabajo_id;

    INSERT INTO transacciones (cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_cobro_id, origen)
    VALUES (
        v_cliente_id, 
        'abono', 
        NEW.monto_cobrado, 
        'Cobro registrado: ' || v_trabajo_titulo, 
        NEW.fecha_cobro, 
        NEW.trabajo_id, 
        NEW.id, 
        'automático'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_cobro_insert
AFTER INSERT ON cobros
FOR EACH ROW EXECUTE FUNCTION emitir_transaccion_cobro();


-- Trigger D: Auto-pasar a "pagado" si Saldo <= 0
CREATE OR REPLACE FUNCTION check_trabajo_pagado()
RETURNS TRIGGER AS $$
DECLARE
    v_total_cobrado DECIMAL(10,2);
    v_presupuesto DECIMAL(10,2);
    v_total_materiales DECIMAL(10,2);
    v_estado public.job_status;
BEGIN
    SELECT presupuesto, estado INTO v_presupuesto, v_estado 
    FROM trabajos WHERE id = NEW.trabajo_id;

    IF v_estado = 'presupuestado' THEN
        SELECT COALESCE(SUM(monto_cobrado), 0) INTO v_total_cobrado
        FROM cobros WHERE trabajo_id = NEW.trabajo_id;

        SELECT COALESCE(SUM(subtotal), 0) INTO v_total_materiales
        FROM materiales WHERE trabajo_id = NEW.trabajo_id;

        IF v_total_cobrado >= (v_presupuesto + v_total_materiales) THEN
            UPDATE trabajos SET estado = 'pagado' WHERE id = NEW.trabajo_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_cobro_insert_check_pagado
AFTER INSERT OR UPDATE ON cobros
FOR EACH ROW EXECUTE FUNCTION check_trabajo_pagado();

-- ==========================================
-- 4. SEGURIDAD (RLS)
-- ==========================================
-- Políticas temporales para desarrollo (Permiten todo sin login)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trabajos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE visita_tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE cobros ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for development" ON clientes FOR ALL USING (true);
CREATE POLICY "Enable all for development" ON trabajos FOR ALL USING (true);
CREATE POLICY "Enable all for development" ON tareas FOR ALL USING (true);
CREATE POLICY "Enable all for development" ON visitas FOR ALL USING (true);
CREATE POLICY "Enable all for development" ON visita_tareas FOR ALL USING (true);
CREATE POLICY "Enable all for development" ON task_photos FOR ALL USING (true);
CREATE POLICY "Enable all for development" ON materiales FOR ALL USING (true);
CREATE POLICY "Enable all for development" ON cobros FOR ALL USING (true);
CREATE POLICY "Enable all for development" ON transacciones FOR ALL USING (true);
