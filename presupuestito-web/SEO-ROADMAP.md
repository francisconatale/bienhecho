# SEO Roadmap — Presupuestito

Guía completa de todo lo implementado, para qué sirve cada cosa y cómo testearlo.

---

## 1. Metadata Base

**Archivo:** `src/app/layout.tsx`

```ts
metadataBase: new URL("https://presupuestito.vercel.app"),
```

**Para qué sirve:** Le dice a Next.js la URL base del sitio. Sin esto, las imágenes de Open Graph (`og:image`) y las URLs canónicas no se resuelven correctamente. Cuando alguien comparte tu link en WhatsApp/Twitter, el crawler necesita una URL completa (ej: `https://presupuestito.vercel.app/og-image.png`), no una ruta relativa (`/og-image.png`).

**Cómo testear:**
- View Source en la homepage → buscá `<meta property="og:url"` → debería mostrar la URL completa

---

## 2. Title Template

**Archivo:** `src/app/layout.tsx`

```ts
title: {
  default: "Presupuestito — CRM para freelancers",
  template: "%s | Presupuestito",
},
```

**Para qué sirve:** Define el formato del título de todas las páginas. Cada página solo pone su nombre (`"Trabajos"`) y el layout agrega `" | Presupuestito"` automáticamente. Esto:
- Evita inconsistencias (si alguien olvida el prefijo)
- Facilita cambios de branding (cambiar una vez en el layout)
- Mantiene el formato consistente

**Cómo testear:**
- Abrí cada página → la pestaña del browser debería mostrar `"Trabajos | Presupuestito"`, `"Clientes | Presupuestito"`, etc.

---

## 3. Open Graph (OG) Tags

**Archivo:** `src/app/layout.tsx`

```ts
openGraph: {
  type: "website",
  locale: "es_AR",
  siteName: "Presupuestito",
  title: "Presupuestito — CRM para freelancers",
  description: "Gestioná tus trabajos, clientes y presupuestos en un solo lugar.",
  images: [{ url: "/og-image.png", width: 1200, height: 630 }],
},
```

**Para qué sirve:** Controla cómo se ve tu link cuando lo compartís en redes sociales (WhatsApp, Twitter, Facebook, LinkedIn). Sin esto, la preview es genérica o no aparece.

**Cómo testear:**
- **WhatsApp**: compartí la URL en un chat → debería verse la imagen, título y descripción
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/ → pegá la URL → scrolleá hasta "Link Preview"
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator

---

## 4. Twitter Card Tags

**Archivo:** `src/app/layout.tsx`

```ts
twitter: {
  card: "summary_large_image",
  title: "Presupuestito — CRM para freelancers",
  description: "Gestioná tus trabajos, clientes y presupuestos en un solo lugar.",
  images: ["/og-image.png"],
},
```

**Para qué sirve:** Controla cómo se ve tu link cuando lo compartís en Twitter/X. `summary_large_image` muestra una imagen grande con título y descripción debajo.

**Cómo testear:**
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator

---

## 5. Favicon y Apple Touch Icon

**Archivos:**
- `public/favicon.ico` — icono para browsers de escritorio
- `public/icon.svg` — icono SVG (alternativa moderna)
- `public/apple-touch-icon.png` — icono para iPhone/iPad (agregar a pantalla de inicio)
- `public/icon-192x192.png` — icono PWA para Android
- `public/icon-512x512.png` — icono PWA grande para Android

**Configurado en:** `src/app/layout.tsx`

```ts
icons: {
  icon: "/icon.svg",
  apple: "/apple-touch-icon.png",
},
```

**Para qué sirve:**
- `favicon.ico`: el ícono que ves en la pestaña del browser
- `apple-touch-icon.png`: el ícono que aparece cuando agregás la app a la pantalla de inicio en iPhone
- Iconos PWA (192/512): necesarios para que Android instale tu app como PWA

**Cómo testear:**
- Abrí la app en Chrome → la pestaña debería mostrar el icono verde con "P"
- En iPhone: Safari > Share > Add to Home Screen → debería usar `apple-touch-icon.png`

---

## 6. robots.txt

**Archivo:** `src/app/robots.ts` (genera `/robots.txt`)

```ts
rules: [
  {
    userAgent: "*",
    allow: "/",
    disallow: ["/(auth)/", "/(dashboard)/"],
  },
],
sitemap: "https://presupuestito.vercel.app/sitemap.xml",
```

**Para qué sirve:** Le dice a los crawlers (Google, Bing, etc.) qué páginas pueden rastrear y cuáles no.
- `allow: "/"` — permite todas las páginas públicas
- `disallow: ["/(auth)/", "/(dashboard)/"]` — bloquea login, register, dashboard (contenido privado)
- `sitemap` — le dice a Google dónde encontrar el sitemap

**Cómo testear:**
- Visitá `https://presupuestito.vercel.app/robots.txt` → debería mostrar las reglas

---

## 7. Sitemap XML

**Archivo:** `src/app/sitemap.ts` (genera `/sitemap.xml`)

```ts
return [
  { url: baseUrl, priority: 1, changeFrequency: "monthly" },
  { url: `${baseUrl}/login`, priority: 0.3 },
  { url: `${baseUrl}/register`, priority: 0.3 },
];
```

**Para qué sirve:** Le dice a Google qué páginas existen y cuán importantes son. Sin un sitemap, Google depende de encontrar los links por rastreo, lo cual puede tardar o fallar.

**Cómo testear:**
- Visitá `https://presupuestito.vercel.app/sitemap.xml` → debería listar las 3 páginas

---

## 8. Noindex en Auth y Dashboard

**Archivos:**
- `src/app/(auth)/layout.tsx`
- `src/app/(dashboard)/layout.tsx`

```ts
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};
```

**Para qué sirve:** Doble protección junto con robots.txt.
- `index: false` — le dice a Google que no indexe estas páginas
- `follow: true` — permite que los links pasen link equity aunque la página no se indexe

**Por qué doble protección:** Google puede ignorar robots.txt si encuentra los links en otros sitios (redes sociales, emails). El meta tag `noindex` es más confiable.

**Cómo testear:**
- Andá a `/login` → View Source → buscá `<meta name="robots"` → debería decir `noindex`

---

## 9. Server + Client Split

**Archivos:** Todos los `page.tsx` + `*-content.tsx`

**Para qué sirve:** En Next.js App Router, no podés exportar `metadata` desde un componente client (`"use client"`). La solución es:
- **Server component** (`page.tsx`): exporta `metadata`, renderiza el client component
- **Client component** (`*-content.tsx`): maneja estado, hooks, interacción

**Esto es necesario para que cada página tenga su propio título y descripción en la pestaña del browser.**

---

## 10. PWA Manifest

**Archivo:** `src/app/manifest.ts` (genera `/manifest.webmanifest`)

```ts
{
  name: "Presupuestito — CRM para freelancers",
  short_name: "Presupuestito",
  icons: [
    { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    { src: "/icon-192x192.png", sizes: "192x192", purpose: "maskable" },
    { src: "/icon-512x512.png", sizes: "512x512", purpose: "maskable" },
  ],
}
```

**Para qué sirve:** Permite instalar tu app como PWA (Progressive Web App). Cuando el usuario visita tu sitio en Android, puede "instalarlo" como una app nativa.

**Cómo testear:**
- En Chrome desktop: F12 → Application → Manifest → debería mostrar los iconos
- En Android: Chrome → menú → "Install app" debería aparecer

---

## Roadmap de testing

### Paso 1: Deploy
1. Hacé push del código a GitHub
2. Vercel hace deploy automático
3. Esperá ~2 minutos

### Paso 2: Verificar archivos generados
| URL | Qué debería mostrar |
|-----|---------------------|
| `/robots.txt` | Reglas de crawl |
| `/sitemap.xml` | Lista de páginas |
| `/manifest.webmanifest` | Configuración PWA |
| `/favicon.ico` | Icono verde con "P" |

### Paso 3: Google Search Console
1. Andá a https://search.google.com/search-console
2. Ya tenés la verificación configurada
3. Submit el sitemap: Configuration > Sitemaps > Add > `https://presupuestito.vercel.app/sitemap.xml`
4. Esperá 24-48 horas para ver datos

### Paso 4: Social Sharing
1. Compartí `https://presupuestito.vercel.app` en WhatsApp
2. Debería verse: imagen + título + descripción
3. Si no se ve, usá https://developers.facebook.com/tools/debug/ para forzar el cache

### Paso 5: PageSpeed
1. Andá a https://pagespeed.web.dev/
2. Pegá tu URL
3. Objetivo: score ≥90 en Performance, Accessibility, SEO

### Paso 6: Mobile
1. Chrome DevTools → device toggle → elegí iPhone 14
2. Verificá que no hay scroll horizontal
3. Los botones son fácilmente tocables

---

## Archivos modificados (resumen)

| Archivo | Qué hace |
|---------|----------|
| `src/app/layout.tsx` | MetadataBase, title template, OG, Twitter, icons |
| `src/app/robots.ts` | Reglas de crawl para Google |
| `src/app/sitemap.ts` | Sitemap XML |
| `src/app/manifest.ts` | PWA manifest con iconos |
| `src/app/(auth)/layout.tsx` | noindex para páginas de auth |
| `src/app/(dashboard)/layout.tsx` | noindex para dashboard |
| `src/app/(auth)/**/page.tsx` | Metadata específica por página |
| `src/app/(dashboard)/**/page.tsx` | Metadata específica por página |
| `public/favicon.ico` | Icono para browsers |
| `public/apple-touch-icon.png` | Icono para iOS |
| `public/icon.svg` | Icono SVG |
| `public/icon-192x192.png` | Icono PWA Android |
| `public/icon-512x512.png` | Icono PWA Android grande |
