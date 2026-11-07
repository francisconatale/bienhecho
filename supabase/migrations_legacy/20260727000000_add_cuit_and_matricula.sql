-- Add cuit and matricula columns to perfiles table
ALTER TABLE perfiles 
  ADD COLUMN IF NOT EXISTS cuit TEXT,
  ADD COLUMN IF NOT EXISTS matricula TEXT;
