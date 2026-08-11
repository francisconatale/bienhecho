# Research: Desglose de Transacciones por Trabajo

## Contexto Técnico
La aplicación utiliza Next.js (App Router), Tailwind CSS v4 con variables de MD3, y PostgreSQL (mediante Supabase) con consultas a través del cliente oficial de Supabase. 

## Decisions & Rationale

### 1. Data Fetching
- **Decision**: Crear una función en `src/actions/transactions.actions.ts` y usar `useQuery` para consultar la tabla `transacciones`.
- **Rationale**: Mantiene el patrón de server actions / servicios existente y se integra con TanStack Query (que ya se usa en `use-payments.ts` y `use-trabajo-detail.ts`).
- **Alternatives considered**: Consultar directamente en el frontend (rechazado por patrón arquitectónico).

### 2. Integración en la UI
- **Decision**: Reemplazar o extender el componente actual `PaymentsDashboard` (en `src/app/(dashboard)/trabajos/[id]/components/payments-dashboard.tsx`).
- **Rationale**: El usuario ya va a esa sección para ver los cobros y el saldo. Es el lugar lógico para listar toda la cuenta corriente del trabajo.
- **Alternatives considered**: Crear una pestaña nueva (rechazado porque dividiría innecesariamente el estado financiero del trabajo).

### 3. Representación Visual de Transacciones
- **Decision**: Usar una lista vertical (timeline). Los cargos (deuda) sumarán al saldo con color neutro o rojo sutil, los abonos (pagos) restarán con color verde (primary).
- **Rationale**: Sigue los principios de UI de "Bien Hecho" (claridad y simplicidad).
- **Alternatives considered**: Tabla (rechazado, no es mobile-friendly para MVP).
