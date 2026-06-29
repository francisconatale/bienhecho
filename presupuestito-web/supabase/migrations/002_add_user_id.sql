-- Add user_id column to all tables for single-tenancy
-- Note: Run this AFTER creating auth users and perfiles table

-- clientes
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON clientes(user_id);

-- trabajos
ALTER TABLE trabajos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_trabajos_user_id ON trabajos(user_id);

-- tareas
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_tareas_user_id ON tareas(user_id);

-- visitas
ALTER TABLE visitas ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_visitas_user_id ON visitas(user_id);

-- cobros
ALTER TABLE cobros ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_cobros_user_id ON cobros(user_id);

-- materiales
ALTER TABLE materiales ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_materiales_user_id ON materiales(user_id);

-- task_photos
ALTER TABLE task_photos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_task_photos_user_id ON task_photos(user_id);

-- transacciones
ALTER TABLE transacciones ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_transacciones_user_id ON transacciones(user_id);

-- Note: visita_tareas does NOT need user_id (it's a pivot table)
-- Access is controlled via visitas.user_id
