import { useQuery } from "@tanstack/react-query";
import { alertsService_getDashboardAlerts } from "@/actions/alerts.actions";

export interface ClientAlert {
  id: string;
  jobId: string;
  clienteNombre: string;
  mensaje: string;
  tipo: "borrador" | "demorado";
}

export function useClientAlerts(initialData?: { alerts?: ClientAlert[] }) {
  const { data: alerts = [], isLoading } = useQuery({ 
    queryKey: ["dashboardAlerts"], 
    queryFn: alertsService_getDashboardAlerts,
    initialData: initialData?.alerts,
  });

  return { alerts, isLoading };
}
