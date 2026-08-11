# Fluid Design System - Decisiones Definidas

Este documento guarda las decisiones concretas que ya han sido definidas para el sistema de diseño.

---

## 0. Principios Fundamentales

**01. Contextual Feedback**  
*Show feedback where the action happens.* Privilegiar los cambios de estado locales (ej. un botón que carga) antes de recurrir a notificaciones globales transitorias (Toasts).

**02. Recognition over Recall**  
*Make information recognizable instead of memorable.* Minimizar la carga de memoria del usuario manteniendo visibles las opciones y acciones.

**03. Progressive Disclosure**  
*Reveal complexity only when necessary.* Mostrar solo la información esencial de entrada, revelando opciones avanzadas solo cuando el usuario lo solicita.

**04. One Primary Action**  
*Give every context a clear next action.* Cada pantalla o modal debe tener una acción principal evidente; el resto deben estar visualmente rebajadas a secundarias.

**05. Visibility of System Status**  
*Always communicate what the system is doing.* Mantener al usuario informado mediante feedback visual oportuno (como el *Inline Loading*).

**06. State Continuity**  
*Prefer evolving components over replacing them.* Evitar saltos bruscos en pantalla. Es mejor que un componente mute o se expanda (ej. un input que se vuelve un formulario) en lugar de recargar pantallas enteras.

**07. Error Prevention**  
*Prevent mistakes before explaining them.* Diseñar para prevenir problemas (ej. deshabilitar el guardado si falta un campo) es mejor que mostrar un excelente mensaje de error después.

**08. Easy Recovery**  
*Make mistakes reversible whenever possible.* Facilitar la opción "Deshacer" (Undo) y permitir salidas fáciles.

**09. Reduce Cognitive Load**  
*Let the interface do the thinking it can.* Limpiar ruidos visuales, usar alineaciones perfectas y simplificar los textos para que la pantalla se sienta "ligera" de procesar.

**10. Visual Hierarchy**  
*Visual weight should reflect importance.* Lo más importante (el dato crítico, la acción final) debe tener más peso, tamaño o contraste.

**11. Consistency**  
*Similar things should behave similarly.* Mantener convenciones internas estrictas (ej. todos los botones secundarios tienen el mismo estilo) y respetar las expectativas de la plataforma nativa.

**12. Proximity**  
*Related information belongs together.* Agrupar visualmente (mediante márgenes internos y externos) aquellos elementos que se relacionan semántica o funcionalmente.

**13. Progressive Complexity**  
*Simple by default, powerful when needed.* El flujo por defecto debe resolver el 80% de los casos con el menor esfuerzo; el 20% restante se relega a menús avanzados.

**14. Direct Manipulation**  
*Let users interact with the thing they want to change.* Favorecer la edición "in-place" (editar haciendo clic en el mismo texto) antes que forzar la navegación a pantallas de "Edición".

**15. Mobile-first Interaction**  
*Optimize for touch, reachability and keyboard behavior.* Diseñar con áreas de toque amplias (`hit-padding`), poner acciones clave al alcance del pulgar, y evitar que el teclado tape el trabajo (`Keyboard avoidance`).

---

## 1. Interacción y Comportamiento

### Estados de Carga en Controles (Inline Loading)
- **Regla**: Toda interacción que procese datos asincrónicamente (guardar, enviar, o alternar un estado como un checkbox/toggle), a excepción de abrir modales, debe indicar la carga *in-situ*. No se debe bloquear la UI de la pantalla entera.
  - **En Botones**: El botón se bloquea mostrando un spinner y/o texto "Procesando..." hasta el `onSuccess`.
  - **En Toggles / Checkboxes**: El control pasa a un estado de "procesando" (ej. un mini-spinner adentro del checkbox) al hacer clic, y solo se marca como seleccionado/activo cuando el servidor confirma el cambio.
- **Implementación en React (Controles)**:
  - **Props requeridas**: `isLoading={boolean}` para deshabilitar interacciones repetidas y mostrar el spinner visual.

### Hit Padding (Área Táctil Invisible)
- **Regla**: Los botones interactivos pequeños (como íconos de cerrar o ajustes) deben tener un área táctil invisible expandida para evitar toques fallidos en pantallas táctiles.
- **Valor Definido**: `8px` extra en cada lado. (Por ejemplo, un botón visual de 24x24px tendrá un área cliqueable de 40x40px).

### Feedback al Presionar (Active Scale)
- **Regla**: Los botones interactivos deben dar feedback físico instantáneo reduciendo ligeramente su tamaño al ser presionados.
- **Valor Definido**: `transform: scale(0.96)`.

---

## 2. Animación y Movimiento

### Spring Base (Rebote rápido)
- **Regla**: Para evitar sensaciones robóticas, el retorno del estado `active` o los cambios de posición estáticos usarán un efecto de rebote controlado y fluido.
- **Valor Definido (CSS)**: `transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)`.

### Momentum Spring (Inercia al soltar)
- **Regla**: Las animaciones físicas derivadas de soltar un arrastre (ej. deslizar un panel) deben resolver la inercia remanente con un rebote elegante pero firme.
- **Valor Definido (CSS)**: `transition: transform 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)` (Rebote Suave).

---

## 3. Materiales y Profundidad (Vidrio)

### Material Principal / Thick (Estilo Sutil)
- **Regla**: Para estructuras principales (navbars, modales grandes) se usará un material conservador que no distraiga la lectura. Actúa casi como una superficie sólida (muy legible), pero con un leve toque orgánico al dejar pasar luz.
- **Fondo (Background)**: `rgba(255, 255, 255, 0.92)`.
- **Desenfoque (Blur)**: `blur(8px)`.
- **Borde**: `1px solid rgba(228, 228, 231, 0.6)` (Gris muy sutil).
- **Elevación (Sombra Principal)**: `0 4px 16px rgba(0, 0, 0, 0.08)`.

### Material Secundario / Thin (Casi Sólido)
- **Regla**: Para elementos flotantes pequeños (tooltips, chips) se mantendrá la consistencia extrema con el material principal, priorizando legibilidad sobre transparencia espectacular.
- **Fondo (Background)**: `rgba(255, 255, 255, 0.92)`.
- **Desenfoque (Blur)**: `blur(4px)`.
- **Borde**: `1px solid rgba(228, 228, 231, 0.8)`.
- **Elevación (Sombra Base)**: `0 2px 6px rgba(0, 0, 0, 0.05)`.

---

## 4. Formularios y Entrada de Datos

### Keyboard Avoidance (Prevención de Teclado Móvil)
- **Regla**: Cuando se abre el teclado en dispositivos móviles, la interfaz DEBE reposicionar o hacer scroll automáticamente para que el campo enfocado (input, textarea) se mantenga visible y no quede ocluido.
- **Contexto de uso**: Cualquier flujo de rellenado de datos, creación de entidades o formularios. Nunca se debe tapar ni el campo que se está escribiendo ni su botón de acción más cercano.
- **Implementación sugerida**: Usar propiedades CSS como `scroll-padding-bottom` y métodos nativos como `element.scrollIntoView({ behavior: 'smooth', block: 'center' })` durante los eventos de foco.

---

## 5. Tipografía Óptica (Escala y Espaciado)

### Escala Elegida: Compacta (Datos densos y Productividad)
- **Familia Principal**: `Inter`, `system-ui`, `sans-serif`.
- **Text Display** (Hero / Títulos gigantes)
  - **Size**: `1.75rem`
  - **Line-height**: `1.2` (Apretado)
  - **Letter-spacing**: `-0.02em` (Tracking negativo)
  - **Font-weight**: `600`
- **Text Heading** (Títulos de sección)
  - **Size**: `1.125rem`
  - **Line-height**: `1.2`
  - **Letter-spacing**: `-0.01em`
  - **Font-weight**: `600`
- **Text Body** (Párrafos)
  - **Size**: `0.875rem`
  - **Line-height**: `1.4`
  - **Letter-spacing**: `0em` (Neutro)
  - **Font-weight**: `400`
- **Text Caption** (Metadatos diminutos)
  - **Size**: `0.75rem`
  - **Line-height**: `1.3`
  - **Letter-spacing**: `0.02em` (Tracking positivo para mayor legibilidad)
  - **Font-weight**: `500`

---

## 6. Accesibilidad (A11y)

### Los 8 Pilares de Accesibilidad

**01. Perceivable**
- *Never rely on color alone*: No depender exclusivamente del color para indicar estados o errores.
- *Maintain sufficient contrast*: Asegurar que el texto contraste bien con su fondo (incluyendo el *Material Thin*).
- *Support text scaling*: Preservar la integridad visual si el usuario aumenta el tamaño de fuente del sistema.
- *Respect prefers-reduced-transparency*: Si el OS pide reducir transparencias, reemplazar el efecto de vidrio (`blur`) por colores sólidos y opacos.

**02. Keyboard**
- *Every interaction must be keyboard accessible*: Toda la app debe poder usarse con `Tab` y `Enter/Space`.
- *Never remove focus without replacement*: Al cerrar un modal, devolver el foco lógicamente.
- *Maintain logical focus order*: El flujo de navegación debe tener sentido (arriba-abajo, izquierda-derecha).
- *Keep focus visible*: Nunca ocultar los anillos nativos de `:focus-visible`.

**03. Touch**
- *Provide sufficiently large interaction targets*: Usar nuestro estándar de `8px` de **Hit Padding** extra.
- *Do not rely exclusively on complex gestures*: Todo gesto (ej. swipe) debe tener su equivalente en botón visible.
- *Keep important actions reachable*: Las acciones primarias en móvil deben estar al alcance del pulgar.

**04. Motion**
- *Respect prefers-reduced-motion*: Si el usuario tiene desactivadas las animaciones, reemplazar todos los **Springs** por transiciones suaves de opacidad (`fade` de 0.2s).
- *Motion must communicate, not decorate*: El movimiento debe guiar al ojo, no marearlo por estética.

**05. Forms**
- *Every input has a visible label*: Siempre debe haber etiquetas claras para cada campo.
- *Errors identify the affected field*: Marcar visualmente el input defectuoso.
- *Errors explain how to recover*: Textos de error útiles y accionables.
- *Never rely on placeholders as labels*: Los placeholders desaparecen, no sirven como etiqueta primaria.

**06. Semantics**
- *Prefer native HTML elements*: Usar `<button>` y `<a>` reales; huir de los `div onClick` salvo necesidad extrema.
- *Use ARIA only when necessary*: El HTML semántico nativo es infinitamente superior a parches ARIA.
- *Every interactive element has an accessible name*: Botones de solo iconos (como la "X") deben tener `aria-label`.

**07. Feedback**
- *Communicate state changes contextually*: Respaldado por nuestra regla de *Inline Loading*.
- *Make dynamic changes accessible to assistive technology*: Usar regiones *live* para notificar a lectores de pantalla cuando pasa algo drástico asíncronamente.

**08. Consistency**
- *Similar components behave consistently*: Previsibilidad absoluta en toda la arquitectura de UI.
- *Navigation and interaction patterns remain predictable*: Evitar mover elementos ancla (como acciones primarias) mágicamente entre pantallas.
