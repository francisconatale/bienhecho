# Fluid Design System - Decisiones y Principios (Híbrido)

Este documento fusiona los **Principios de UX/UI** (el *por qué* y *qué*) con las **Decisiones de Implementación Técnica** (el *cómo*). Es la única fuente de verdad para el comportamiento y aspecto de la interfaz.

---

## 1. Interacción, Feedback y Continuidad de Estado

> **Principio (Contextual Feedback & State Continuity):**
> El feedback debe aparecer donde ocurre la acción. Los componentes deben evolucionar a través de estados predecibles (Idle → Loading → Success/Error) en lugar de ser reemplazados bruscamente o lanzar notificaciones globales descontextualizadas (Toasts).
> **Recognition over Recall:** Minimizar la carga cognitiva; mostrar opciones claras en lugar de hacer que el usuario memorice.

### 🛠️ Implementación
*   **Inline Loading (Estados de Carga en Controles):**
    *   Toda interacción asíncrona (guardar, enviar, alternar) debe mostrar carga *in-situ*. No bloquear toda la pantalla.
    *   **Botones:** Usar la prop `isLoading={boolean}`. Esto deshabilita el botón, muestra un spinner y cambia el texto (ej. "Procesando...").
    *   **Toggles / Checkboxes:** Mostrar un mini-spinner en el componente hasta que el servidor confirme el cambio.
*   **Active Scale (Feedback físico al presionar):**
    *   Todo botón interactivo debe dar feedback visual inmediato al toque.
    *   **CSS:** `transform: scale(0.96);`
*   **Hit Padding (Área Táctil Invisible):**
    *   Botones pequeños (cerrar, ajustes) necesitan áreas táctiles expandidas.
    *   **Valor:** `8px` extra por lado. Un ícono de 24x24px debe tener un "hitbox" de 40x40px.
*   **Manejo de Errores (Error Prevention & Easy Recovery):**
    *   Prevenir acciones inválidas deshabilitando botones si faltan datos.
    *   Errores de validación deben aparecer **debajo o al lado** del campo afectado, nunca en un Toast global.
    *   Preferir la opción de "Deshacer" para acciones destructivas si es viable, antes que modales de confirmación excesivos.

---

## 2. Animación y Movimiento

> **Principio (Purposeful Motion):**
> La animación debe comunicar estado, jerarquía, relaciones espaciales o causa/efecto. No debe existir solo por decoración ni bloquear la interacción del usuario. Si el estado cambia, preservar la identidad espacial del elemento.

### 🛠️ Implementación
*   **Spring Base (Rebote rápido para micro-interacciones):**
    *   Usado para retornos de estados `active` o hover. Evita la sensación robótica.
    *   **CSS:** `transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)`
*   **Momentum Spring (Inercia al soltar):**
    *   Usado para paneles deslizables o elementos de arrastre al ser soltados.
    *   **CSS:** `transition: transform 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)`
*   **Reduced Motion (A11y):**
    *   Si el usuario tiene `prefers-reduced-motion: reduce`, todas las animaciones Spring deben ser reemplazadas por un sutil cambio de opacidad (fade de `0.2s`) sin movimiento espacial.

---

## 3. Materiales, Layout y Jerarquía

> **Principio (Visual Hierarchy & Progressive Disclosure):**
> El peso visual debe reflejar la importancia semántica (tamaño, espacio, contraste). Mostrar la complejidad mínima necesaria por defecto, revelando opciones secundarias solo a demanda. Agrupar la información relacionada.

### 🛠️ Implementación
*   **Layout y Espaciado:**
    *   Usar un sistema definido (4, 8, 12, 16, 24, 32, 48, 64). Nada de valores arbitrarios.
    *   El diseño debe ser intencionalmente responsive (Desktop, Tablet, Mobile), no depender de saltos de línea (wrapping) accidentales.
*   **Material Principal (Thick / Estructuras Base):**
    *   Para navbars y modales grandes. Legibilidad ante todo, con un toque orgánico translúcido.
    *   **Fondo:** `rgba(255, 255, 255, 0.92)`
    *   **Desenfoque:** `backdrop-filter: blur(8px)`
    *   **Borde:** `1px solid rgba(228, 228, 231, 0.6)`
    *   **Sombra:** `0 4px 16px rgba(0, 0, 0, 0.08)`
*   **Material Secundario (Thin / Elementos Flotantes):**
    *   Para tooltips, chips, menús desplegables.
    *   **Fondo:** `rgba(255, 255, 255, 0.92)`
    *   **Desenfoque:** `backdrop-filter: blur(4px)`
    *   **Borde:** `1px solid rgba(228, 228, 231, 0.8)`
    *   **Sombra:** `0 2px 6px rgba(0, 0, 0, 0.05)`

---

## 4. Tipografía Óptica

> **Principio (Readability):**
> La jerarquía debe comunicarse consistentemente. No depender exclusivamente del peso o color para dar significado. La interfaz debe soportar aumento de texto sin romperse.

### 🛠️ Implementación (Escala Compacta)
*   **Familia Principal:** `Inter`, `system-ui`, `sans-serif`
*   **Display (Títulos gigantes):** `size: 1.75rem` | `leading: 1.2` | `tracking: -0.02em` | `weight: 600`
*   **Heading (Secciones):** `size: 1.125rem` | `leading: 1.2` | `tracking: -0.01em` | `weight: 600`
*   **Body (Párrafos):** `size: 0.875rem` | `leading: 1.4` | `tracking: 0em` | `weight: 400`
*   **Caption (Metadatos):** `size: 0.75rem` | `leading: 1.3` | `tracking: 0.02em` | `weight: 500`

---

## 5. Formularios y Entrada de Datos

> **Principio:**
> Prevenir errores antes de que sucedan. Todo campo requiere contexto visible (label). El tipo de dato esperado debe coincidir con el teclado mostrado al usuario. 

### 🛠️ Implementación
*   **Labels y Placeholders:** Todo input debe tener una etiqueta visible. Nunca usar el placeholder como única etiqueta, ya que desaparece al escribir.
*   **Keyboard Avoidance (Prevención de Teclado Móvil):**
    *   Al abrir el teclado en móviles, la UI debe reaccionar. El campo enfocado JAMÁS debe quedar ocluido.
    *   **Técnica:** Usar `scroll-padding-bottom` o forzar foco con `element.scrollIntoView({ behavior: 'smooth', block: 'center' })`.
*   **Teclado Apropiado (Input Types):**
    *   Usar `type="email"`, `type="tel"`, `type="number"`, `inputMode="numeric"`, etc., para invocar el teclado móvil correcto.
*   **Validación:**
    *   Validar agresivamente solo después del primer submit o en `onBlur`. Mantener siempre intacto el input válido del usuario.

---

## 6. Pilares de Accesibilidad (A11y)

*   **Color No Es Suficiente:** Los errores necesitan texto o íconos, no solo bordes rojos. Los estados (Pendiente, Aprobado) deben leerse claros.
*   **Teclado Absoluto (Keyboard Accessibility):** Toda la app debe ser navegable con `Tab`. El estado `:focus-visible` siempre debe existir. Flujo lógico (Header → Content → Form → Action).
*   **Nombres Semánticos (Aria):** Botones con solo íconos (ej: "X" para cerrar) deben tener un `aria-label="Cerrar modal"`.
*   **Semántica HTML:** Usar `<button>`, `<a>`, `<dialog>` reales. Evitar los `<div onClick>`.
*   **Reflow:** La UI debe sobrevivir y apilarse lógicamente si el usuario acerca el zoom en pantallas chicas. Sin scroll horizontal innecesario.
