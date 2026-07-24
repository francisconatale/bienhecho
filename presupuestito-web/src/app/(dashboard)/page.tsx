import type { Metadata } from "next";
import { DashboardContent } from "./dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Vista general de tus trabajos, clientes y actividad reciente",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
