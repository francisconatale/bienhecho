import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description: "Accedé a tu cuenta de Bien Hecho",
};

export default function LoginPage() {
  return <LoginForm />;
}
