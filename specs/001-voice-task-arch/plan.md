# Implementation Plan: Arquitectura de Interpretación de Tareas por Chat

**Branch**: `001-voice-task-arch` | **Date**: 2026-08-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-voice-task-arch/spec.md`

## Summary

Implementar una arquitectura de procesamiento de tareas por chat usando Gemini/Gemma, separando la interpretación de lenguaje natural del control de flujo del backend. Se espera alta optimización de tokens para mantener un throughput de 10 tareas por minuto bajo los límites gratuitos de la API, e integración con Supabase.

## Technical Context

**Language/Version**: TypeScript, Next.js (App Router)

**Primary Dependencies**: Vercel AI SDK (o cliente directo Gemini API), Zustand, Zod

**Storage**: Supabase

**Testing**: Vitest (NEEDS CLARIFICATION: Se asumirá Vitest/Jest ya que no hay uno especificado globalmente)

**Target Platform**: Web App (Browser)

**Project Type**: Next.js Fullstack Web App

**Performance Goals**: Max 165 tokens per task (55 per request * 3 requests). Up to 10 tasks per minute, 4800 tasks per day. Max 30 RPM limit on the LLM API.

**Constraints**: El JSON debe ser ultra minimalista para no superar ~55 tokens por petición. Límite de 3 intentos para clarificaciones.

**Scale/Scope**: Limitado al tier gratuito de la API, orientado a pequeños comercios (ej: Kioskito) para procesar ventas/inventario.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Frontend Guidelines (GEMINI.md)**: Se respetará el uso de Server Actions / API Routes de Next.js para el backend y Zustand/Custom Hooks para el frontend. No hay violaciones a las reglas arquitectónicas.

## Project Structure

### Documentation (this feature)

```text
specs/001-voice-task-arch/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── app/
│   └── api/
│       └── chat-parser/
│           └── route.ts       # Backend workflow & LLM integration
├── hooks/
│   └── use-chat-tasks.ts      # Custom hook para manejar el estado del chat
├── components/
│   └── chat/
│       ├── chat-interface.tsx
│       └── task-status.tsx
└── lib/
    ├── supabase/
    └── parser/
        └── prompt-templates.ts
```

**Structure Decision**: El proyecto sigue la estructura definida en `GEMINI.md` usando Next.js App Router. El backend (control de flujo y LLM) residirá en API routes (o server actions) mientras que la UI y estado de la conversación se manejará con hooks y Zustand.
