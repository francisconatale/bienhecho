import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Presupuestito",
    short_name: "Presupuestito",
    description: "Gestor de presupuestos digital",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f4f0",
    theme_color: "#3D8B6E",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
