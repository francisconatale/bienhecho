# Jerarquía visual y densidad

## Problema

Cuando se diseña sin un sistema de escala definido, cada elemento tiende a pedir espacio "por las dudas". El resultado es una pantalla donde todo compite al mismo volumen visual: títulos, datos secundarios, acciones principales y metadata aparecen con tamaños y pesos similares. El usuario no sabe dónde mirar primero.

El síntoma más claro es cuando un dato secundario (como una dirección) ocupa el mismo espacio visual que la acción o número principal de la pantalla.

---

## Objetivo

Lograr que la importancia de cada elemento se comunique visualmente antes de que el usuario lo lea. El tamaño, el peso tipográfico y el espacio en blanco deben reflejar la jerarquía de la información, no ser decisiones arbitrarias.

---

## Resolución

### 1. Definir el elemento más importante de la pantalla

Antes de diseñar, identificar UNA sola acción o dato principal. Todo lo demás existe para apoyarlo. Si no se puede identificar, la arquitectura de información tiene un problema previo al diseño.

### 2. Asignar espacio proporcional a la importancia

- **Elemento principal** → tipografía grande, peso 500, espacio propio
- **Datos de soporte** → tipografía media, peso 400, agrupados
- **Metadata secundaria** → tipografía pequeña (12–13px), color muted, formato compacto (chips, inline)

> Si dos elementos tienen el mismo tamaño visual, estás comunicando que son igual de importantes.

### 3. Reducir el aire a la mitad como test

Si se puede comprimir todo a la mitad del espacio sin perder información, hay aire desperdiciado. El espacio en blanco es válido cuando separa **secciones**, no cuando infla elementos individuales.

### 4. Revisar padding y tamaño de cards

Un padding de 24px en una card de datos secundarios es aire desperdiciado. El mismo padding entre bloques principales es estructura. Reducir los paddings internos de elementos secundarios a 10–14px libera protagonismo para lo que importa.

---

## Regla de bolsillo

**¿Dos elementos tienen el mismo tamaño? Estás diciendo que son igual de importantes.**

Buscá los elementos que deberían ser secundarios pero están al mismo "volumen" que los principales, y achicalos. Ese ajuste solo resuelve el 80% de los problemas de jerarquía.
