import { AlertCircle, Clock } from "lucide-react";
import { useClientAlerts } from "../hooks/use-client-alerts";

export function ClientAlerts() {
  const { alerts } = useClientAlerts();

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-center gap-3 p-4 rounded-2xl bg-surface/30 border border-outline-variant/10 backdrop-blur-xl"
        >
          <div
            className={`p-2 rounded-full ${
              alert.tipo === "borrador"
                ? "bg-amber-500/10 text-amber-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {alert.tipo === "borrador" ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Clock className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface">
              {alert.mensaje}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
