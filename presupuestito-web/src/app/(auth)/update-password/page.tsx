import type { Metadata } from "next";
import { UpdatePasswordForm } from "./update-password-form";

export const metadata: Metadata = {
  title: "Actualizar Contraseña",
  description: "Cambiala tu contraseña de Bien Hecho",
};

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
