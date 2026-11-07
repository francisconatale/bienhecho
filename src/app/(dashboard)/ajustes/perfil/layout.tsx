import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bien Hecho - Editar Perfil",
  description: "Modificá los datos de tu cuenta personal y empresa",
};

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
