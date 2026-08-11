# Research: Arquitectura de Tareas por Chat

## 1. Testing Framework (NEEDS CLARIFICATION)
- **Decision**: Usar `Vitest`.
- **Rationale**: Es muy rápido, compatible de forma nativa con TypeScript y muy fácil de integrar en el ecosistema actual (a menudo preferido junto a Vite/Next.js moderno por sobre Jest). 
- **Alternatives considered**: Jest (más pesado, requiere más configuración para TS).

## 2. LLM Integration & Token Optimization
- **Decision**: Usar la API REST directa de Gemini / Google Generative AI SDK, enviando un system prompt altamente optimizado.
- **Rationale**: El requerimiento de usar ~40 tokens para prompt y ~15 para respuesta requiere control absoluto sobre el payload. Usar frameworks como LangChain añadiría overhead innecesario.
- **Alternatives considered**: Vercel AI SDK (bueno para streaming, pero podría agregar wrappers que sumen tokens; requerirá testeo cuidadoso si se usa `generateObject`).

## 3. State Management (Supabase vs In-Memory)
- **Decision**: El estado transaccional (cola de clarificaciones y tareas temporales) se mantiene en el frontend (Zustand) y se pasa el contexto estrictamente necesario al backend en cada petición. Una vez que la tarea pasa a estado `READY`, se guarda en Supabase.
- **Rationale**: El backend de Next.js es stateless. Para evitar persistir estados intermedios incompletos en la DB y gastar latencia, el frontend orquesta la cola y la API actúa como un pipeline puro determinista.
- **Alternatives considered**: Guardar estados "PENDING" en Supabase. Se descartó por latencia innecesaria y R/W ops.
