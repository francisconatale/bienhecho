-- Clarificar también el precio unitario de cada tarea del chat.
-- Una tarea queda completa cuando tiene `quantity` y `precio` definidos.

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS precio NUMERIC;
