# Research: Navegación "Volver" Unificada

## Decision 1: Query params como mecanismo único

**Decision**: Usar query params (`from`, `clienteId`, `jobId`) como el único mecanismo para navegación de regreso.

**Rationale**:
- Ya es el patrón dominante en el codebase (trabajo-detail, materiales, pagos, tarea)
- Sobrevive a refresh de página (sessionStorage no)
- Es sharable y debuggeable via URL
- Next.js lo soporta nativamente con `useSearchParams`

**Alternatives considered**:
- `sessionStorage`: No sobrevive a refresh, no es sharable, más propenso a bugs
- `router.back()`: No funciona con deep links ni tabs nuevas
- State global (Zustand): Over-engineering para un caso de uso lineal
- Breadcrumb visual: Fuera de scope per spec

## Decision 2: Valores de `from` como segmentos de ruta reales

**Decision**: `from=/trabajos`, `from=/clientes` (con `/` incluido).

**Rationale**:
- Permite construir el href de vuelta directamente: `router.push(from || '/trabajos')`
- Elimina el switch/case condicional en cada página
- Consistente con la estructura real del router

**Alternatives considered**:
- Strings descriptivos (`"clientes"`, `"trabajo"`): Requieren mapeo condicional en cada página
- Enum tipado: Más complejidad innecesaria para 2-3 valores

## Decision 3: Propagación de contexto en URL

**Decision**: Los parámetros de estado (`clienteId`, `jobId`) se propagan como query params adicionales en la URL, no en un estado global.

**Rationale**:
- La spec establece esto explícitamente
- Es el patrón existente y funciona correctamente
- Permite deep linking con contexto preservado

**Implementation detail**: Cada página que construye un link a un detalle DEBE incluir `from` más los params de contexto relevantes. Se crea una función helper `buildBackHref` que centraliza la lógica.

## Decision 4: Helper centralizado `buildBackHref`

**Decision**: Crear un util function `buildBackHref(searchParams, fallback)` que:
1. Lee `from` de los searchParams
2. Si existe, retorna `from` (con clientes/jobId si están presentes)
3. Si no, retorna el fallback (`/trabajos`)

**Rationale**:
- Elimina duplicación de lógica en 5+ archivos
- Un solo punto de cambio si la lógica evoluciona
- Más limpio que copiar la misma condición en cada archivo

**Alternatives considered**:
- Mantener lógica inline en cada archivo: Más duplicación, más propenso a inconsistencias
- Custom hook `useBackHref`: Innecesario — un helper simple es suficiente
