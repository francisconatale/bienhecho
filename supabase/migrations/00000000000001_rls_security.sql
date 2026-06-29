-- RLS Security: Multi-tenancy policies
-- Reemplaza las políticas temporales "Enable all for development"
-- con políticas que verifican auth.uid() = user_id

-- ==========================================
-- 1. GARANTIZAR COLUMNA user_id (safe IF NOT EXISTS)
-- ==========================================
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid();
ALTER TABLE public.trabajos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid();
ALTER TABLE public.tareas ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid();
ALTER TABLE public.task_photos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid();
ALTER TABLE public.visitas ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid();
ALTER TABLE public.materiales ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid();
ALTER TABLE public.cobros ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid();
ALTER TABLE public.transacciones ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid();
-- visita_tareas: junction table, no user_id column — RLS via subquery

-- ==========================================
-- 2. ELIMINAR POLÍTICAS TEMPORALES DE DESARROLLO
-- ==========================================
DROP POLICY IF EXISTS "Enable all for development" ON public.clientes;
DROP POLICY IF EXISTS "Enable all for development" ON public.trabajos;
DROP POLICY IF EXISTS "Enable all for development" ON public.tareas;
DROP POLICY IF EXISTS "Enable all for development" ON public.visitas;
DROP POLICY IF EXISTS "Enable all for development" ON public.visita_tareas;
DROP POLICY IF EXISTS "Enable all for development" ON public.task_photos;
DROP POLICY IF EXISTS "Enable all for development" ON public.materiales;
DROP POLICY IF EXISTS "Enable all for development" ON public.cobros;
DROP POLICY IF EXISTS "Enable all for development" ON public.transacciones;

-- ==========================================
-- 3. CREAR POLÍTICAS RLS POR TABLA
-- ==========================================

-- clientes
CREATE POLICY "Users manage their own clientes" ON public.clientes
    FOR ALL USING (auth.uid() = user_id);

-- trabajos
CREATE POLICY "Users manage their own trabajos" ON public.trabajos
    FOR ALL USING (auth.uid() = user_id);

-- tareas
CREATE POLICY "Users manage their own tareas" ON public.tareas
    FOR ALL USING (auth.uid() = user_id);

-- task_photos
CREATE POLICY "Users manage their own task_photos" ON public.task_photos
    FOR ALL USING (auth.uid() = user_id);

-- visitas
CREATE POLICY "Users manage their own visitas" ON public.visitas
    FOR ALL USING (auth.uid() = user_id);

-- materiales
CREATE POLICY "Users manage their own materiales" ON public.materiales
    FOR ALL USING (auth.uid() = user_id);

-- cobros
CREATE POLICY "Users manage their own cobros" ON public.cobros
    FOR ALL USING (auth.uid() = user_id);

-- transacciones
CREATE POLICY "Users manage their own transacciones" ON public.transacciones
    FOR ALL USING (auth.uid() = user_id);

-- visita_tareas: junction table without user_id — uses subquery through visitas
CREATE POLICY "Users manage their own visita_tareas" ON public.visita_tareas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.visitas
            WHERE visitas.id = visita_id
            AND visitas.user_id = auth.uid()
        )
    );
