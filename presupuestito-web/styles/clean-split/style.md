# Estilo Visual: Clean Split (Panel Dividido Limpio)

Este documento define las bases del estilo **Clean Split**, un enfoque de diseño enmarcado dentro de una estética **Moderno, Minimalista y Premium (estilo SaaS B2B o "Apple-esque")**.

Este estilo está pensado para transmitir profesionalismo, confianza y facilidad de uso, características fundamentales para aplicaciones de gestión donde la claridad y reducción de la carga cognitiva son primordiales.

---

## 1. Arquitectura "Split Pane" (Panel Dividido en Desktop)

La estructura principal del diseño separa las responsabilidades en dos áreas distintas:

*   **El lado de la marca (Branding/Emotional):** Un área amplia (generalmente el 45% del ancho) dedicada a la propuesta de valor y conexión emocional. Utiliza gradientes suaves y elegantes (ej. de `primary-container` a `surface-variant`) sin ser invasivos. Aquí se aloja el logo, un título de impacto y el eslogan.
*   **El lado funcional (Action/Form):** Un espacio completamente limpio y libre de distracciones, con fondo sólido (`bg-surface`). Enfocado al 100% en la conversión y usabilidad (ej. iniciar sesión, registrarse, o interactuar con un formulario).

---

## 2. Jerarquía Tipográfica Editorial

El estilo hace un uso intensivo del contraste tipográfico para guiar el ojo del usuario:

*   **Etiquetas de Inputs (Labels):** Utilizan un estilo de "micro-tipografía". Son pequeñas, en mayúsculas, con fuente en negrita y un espaciado entre letras amplio (`text-xs font-bold uppercase tracking-wider text-on-surface-variant`). Al ser estructurales, no compiten visualmente con los datos ingresados por el usuario.
*   **Títulos Principales (Headings):** Son grandes, gruesos y con un espaciado entre letras reducido (`tracking-tight`). Esto otorga un peso visual contundente y moderno, una tendencia común en interfaces de alto nivel (como Stripe o Linear).

---

## 3. Superficies y Geometría Orgánica

En lugar de delimitar espacios con líneas duras, el diseño se apoya en sutiles cambios de elevación y formas orgánicas:

*   **Inputs y Cajas Funcionales:** No son cajas blancas con bordes oscuros o de alto contraste. Utilizan un fondo con un ligerísimo tinte (`bg-surface-container-low`) combinado con un borde casi imperceptible (`border-outline-variant/30`).
*   **Radios de Borde (Border Radius):** Se emplean radios amplios en elementos interactivos (`rounded-xl` para inputs y botones, `rounded-[2rem]` para modales o contenedores grandes). Esto asemeja la web a las interfaces nativas modernas (iOS o Material You), generando una sensación más táctil y amigable.

---

## 4. Experiencia "Mobile-First" Fluida

El diseño no se limita a "encoger" la versión de escritorio, sino que reestructura la jerarquía visual de forma nativa para el uso con una mano:

*   Se abandona el split de dos columnas por una única columna vertical y limpia.
*   El gradiente identificatorio de la marca pasa a ser un acento en la parte superior (detrás del logo y el título principal), desvaneciéndose sutilmente hacia abajo.
*   Este flujo visual guía el ojo del usuario de arriba hacia abajo de forma natural, finalizando siempre en el botón principal de llamada a la acción (Call to Action) ubicado al final del recorrido.

---

## 5. Micro-interacciones (Motion & Feedback)

Las animaciones se utilizan de forma pragmática para brindar feedback visual de calidad, nunca como meros adornos:

*   **Focos Suaves (Focus States):** Al interactuar con un input, en lugar de generar un borde tosco y rústico, aparece un "anillo" difuminado y suave (`focus:ring-2 focus:ring-primary/20`), manteniendo la elegancia.
*   **Botones Vivos:** Acciones clave (como un botón de enviar) incorporan iconografía dinámica. Por ejemplo, una flecha que se desliza sutilmente a la derecha al pasar el mouse (`group-hover:translate-x-1`), invitando subconscientemente al usuario a "avanzar".

---

> **Filosofía Resumen:** "Callado pero Seguro". Es un diseño que rechaza el uso de colores chillones y sombras toscas de gran tamaño. En su lugar, se apoya fuertemente en el espacio en blanco (whitespace), las cuidadas proporciones tipográficas y los bajos contrastes en las fronteras de los elementos para sentirse premium, confiable y enfocado en la productividad del usuario.
