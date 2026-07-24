import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bien Hecho — Gestión para tus trabajos",
    short_name: "Bien Hecho",
    description:
      "Gestioná tus trabajos, clientes y presupuestos en un solo lugar.",
    start_url: "/",
    display: "standalone",
    background_color: "#E8F2EB",
    theme_color: "#3D8B6E",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
