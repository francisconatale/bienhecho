# Quickstart Validation Guide

Este quickstart valida que el pipeline de interpretación de chat cumple con los límites de la API y el workflow determinista sin superar los límites de tokens.

## Prerequisitos
- Proyecto Next.js configurado.
- Variables de entorno: `GEMINI_API_KEY` (o similar) y las llaves de Supabase.

## Test Scenario 1: Initial Parsing & Token Limit Check
1. Ejecutar el endpoint de prueba enviando el input: `"Necesito cargar 2 cocas"`.
2. Verificar que la respuesta de la API sea un estado de workflow modificado, con el intent detectado y ningún item en la `clarificationQueue`.
3. **CRÍTICO**: Verificar en los logs del servidor el `usageMetadata` del LLM (tokens consumidos). Debe ser ~40 tokens de input y ~15 de output.

## Test Scenario 2: Clarification Queue Workflow
1. Enviar el input incompleto: `"Cargar fanta"`.
2. Verificar que la API retorne `phase: PENDING` y la `clarificationQueue` contenga el campo `quantity` o `q` faltante.
3. Enviar el follow-up: `"Son 3"`, junto con el contexto del item pendiente.
4. Verificar que la API resuelva la tarea y devuelva la tarea lista para insertar en Supabase (`phase: READY`).

## Ejecución Manual (cURL)
```bash
# Validar parsing inicial
curl -X POST http://localhost:3000/api/chat-parser \
  -H "Content-Type: application/json" \
  -d '{"input": "cargar 2 cocas"}'

# Validar clarification (simulando estado anterior)
curl -X POST http://localhost:3000/api/chat-parser \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Son 3", 
    "pending": {"taskId": "t1", "field": "q", "description": "Fanta"}
  }'
```
