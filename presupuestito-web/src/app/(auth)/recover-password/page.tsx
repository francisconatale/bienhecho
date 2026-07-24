import type { Metadata } from "next";
import { RecoverPasswordForm } from "./recover-password-form";

export const metadata: Metadata = {
  title: "Recuperar Contraseña",
  description: "Restablecé tu contraseña de Bien Hecho",
};

export default function RecoverPasswordPage() {
  return <RecoverPasswordForm />;
}
