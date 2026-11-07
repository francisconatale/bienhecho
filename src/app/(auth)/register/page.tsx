import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Crear Cuenta",
  description: "Registrate gratis en Bien Hecho y empezá a gestionar tus trabajos",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
