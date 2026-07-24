import type { Metadata } from "next";
import { EditarPerfilContent } from "./perfil-content";

export const metadata: Metadata = {
  title: "Editar Perfil",
  description: "Modificá los datos de tu cuenta personal y empresa",
};

export default function EditarPerfilPage() {
  return <EditarPerfilContent />;
}
