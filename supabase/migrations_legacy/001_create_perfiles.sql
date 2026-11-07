-- Create perfiles table for user profiles
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  rubro TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

-- Policy: users can only access their own profile
CREATE POLICY "usuarios_su_perfil" ON perfiles
  FOR ALL USING (id = auth.uid());
