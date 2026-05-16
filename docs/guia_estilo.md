# GUÍA DE ESTILO Y DISEÑO (iOS HIG Edition)

Esta guía define la identidad visual de **Presupuestito**, adaptada a los estándares de **Apple Human Interface Guidelines (HIG)** para ofrecer una experiencia nativa y fluida en dispositivos móviles.

## 1. CONCEPTO VISUAL
El diseño combina la **robustez laboral** con la **limpieza de iOS**. Priorizamos la legibilidad, el uso de áreas seguras (Safe Areas) y la interactividad táctil clara.

## 2. PALETA DE COLORES (Design Tokens)

Mantenemos los colores de marca, adaptados para soportar **Modo Claro y Oscuro**.

| Token | Color | HEX (Light) | HEX (Dark) | Uso |
| :--- | :--- | :--- | :--- | :--- |
| `color-primary` | Azul Cobalto | `#00236F` | `#3B82F6` | Tint color principal, botones, navegación. |
| `color-accent` | Amarillo Seguridad | `#FFC329` | `#F59E0B` | Alertas, llamadas de atención. |
| `color-success` | Esmeralda | `#10B981` | `#34D399` | Estados aceptados, éxitos. |
| `color-bg` | System Background | `#FAF8FF` | `#1A1B21` | Fondo principal (Nativo iOS). |
| `color-secondary-bg` | Grouped Background | `#F2F2F7` | `#1C1C1E` | Fondos de listas y agrupaciones. |
| `color-text` | Label Color | `#1A1B21` | `#FFFFFF` | Texto principal. |

## 3. TIPOGRAFÍA
Utilizamos la tipografía nativa del sistema para garantizar el soporte de **Dynamic Type**.

- **Fuente**: `SF Pro` (System Font).
- **Escala**:
    - **Large Title**: 34pt, Bold (Uso en cabeceras principales).
    - **Headline**: 17pt, Semibold (Títulos de celdas).
    - **Body**: 17pt, Regular (Texto estándar).
    - **Footnote**: 13pt, Regular (Datos secundarios).

## 4. PATRONES DE NAVEGACIÓN (HIG)

- **Tab Bar**: Navegación principal en la base con 3 secciones: `Dashboard`, `Clientes`, `Ajustes`.
- **Navigation Bar**: Cabeceras con títulos grandes (Large Titles) que se colapsan al hacer scroll.
- **Sheets (Hojas)**: Para la creación de nuevos presupuestos o edición de items, utilizamos modales tipo "Sheet" que no cubren toda la pantalla.
- **Grouped Lists**: Los datos se presentan en tarjetas redondeadas con márgenes laterales (`inset grouped list style`).

## 5. ICONOGRAFÍA Y ELEMENTOS
- **SF Symbols**: Usar exclusivamente iconos de la librería SF Symbols (ej. `doc.text.fill`, `person.2.fill`, `plus.circle.fill`).
- **Bordes**: Radio de curvatura nativo de iOS (10px a 12px) para botones y tarjetas.
- **Haptics**: Implementar feedback háptico en acciones críticas (confirmar envío de presupuesto, borrar item).

## 6. ESTILO DE PDF (Manteniendo la Marca)
El PDF exportado debe ser un "documento de oficina digital":
- Encabezado con `color-primary`.
- Uso de `Inter` (como alternativa a SF Pro para documentos).
- Estructura de tabla limpia, optimizada para impresión A4.
