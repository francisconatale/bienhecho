-- Consolidar numero_matricula en matricula
-- Copiar datos de numero_matricula a matricula donde matricula esté vacío
UPDATE perfiles 
SET matricula = numero_matricula 
WHERE matricula IS NULL AND numero_matricula IS NOT NULL;

-- Eliminar columna redundante numero_matricula
ALTER TABLE perfiles DROP COLUMN IF EXISTS numero_matricula;