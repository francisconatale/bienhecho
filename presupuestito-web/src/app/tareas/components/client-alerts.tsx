import { useState, useEffect } from "react";
import { AlertCircle, Clock } from "lucide-react";
import { useClientAlerts } from "../hooks/use-client-alerts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function ClientAlerts() {
  const [mounted, setMounted] = useState(false);
  const { alerts } = useClientAlerts();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[72px] rounded-2xl bg-surface/10 border border-outline-variant/5 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <section className="transition-all w-full flex flex-col">
        <h2 className="text-[10px] md:text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">
          Alertas
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center min-h-[100px] bg-surface/40 backdrop-blur-xl rounded-xl border border-outline-variant/10 text-center p-6">
          <p className="text-sm font-medium text-on-surface-variant/60">Todo al día. No hay alertas.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="transition-all w-full flex flex-col">
      <h2 className="text-[10px] md:text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">
        Alertas
      </h2>
      <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center gap-3 p-3.5 rounded-xl bg-surface/60 backdrop-blur-xl shadow-sm transition-all hover:bg-surface/80 border ${
            alert.tipo === "borrador"
              ? "border-amber-500/20"
              : "border-red-500/20"
          }`}
        >
          <div
            className={`p-2 rounded-[12px] shadow-inner ${
              alert.tipo === "borrador"
                ? "bg-amber-500/10 text-amber-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {alert.tipo === "borrador" ? (
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Clock className="w-5 h-5" aria-hidden="true" />
            )}
          </div>
          <p className="text-[13px] leading-tight font-medium text-on-surface flex-1">
            {alert.mensaje}
          </p>
        </div>
      ))}
      </div>
    </section>
  );
}
