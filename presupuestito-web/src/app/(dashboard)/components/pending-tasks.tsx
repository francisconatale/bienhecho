"use client";

import { useDataStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function PendingTasks() {
  const { jobs, clients, tasks } = useDataStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const pendingTasks = tasks
    .filter((t) => !t.completada)
    .map((t) => {
      const job = jobs.find((j) => j.id === t.trabajo_id);
      const client = job ? clients.find((c) => c.id === job.cliente_id) : null;
      return { ...t, job, client };
    })
    .filter((t) => t.job)
    .sort((a, b) => {
      const estadoOrder: Record<string, number> = {
        presupuestado: 0,
        en_curso: 1,
        listo_para_facturar: 2,
        facturado: 3,
        cobrado: 4,
      };
      return (estadoOrder[a.job?.estado ?? ""] ?? 5) - (estadoOrder[b.job?.estado ?? ""] ?? 5);
    });

  const totalPending = pendingTasks.length;
  const totalWithPrice = pendingTasks.filter((t) => t.precio !== null).length;
  const totalEstimado = pendingTasks.reduce((sum, t) => sum + (t.precio ?? 0), 0);

  return (
    <section className="px-5 md:px-8 lg:px-12 md:mt-12 transition-all">
      <div className="flex items-center justify-between mb-3 md:mb-5 px-1">
        <div className="flex items-center gap-3">
          <h3 className="text-xs md:text-sm font-bold text-on-surface-variant uppercase tracking-widest">
            Tareas Pendientes
          </h3>
          {totalPending > 0 && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              {totalPending}
            </span>
          )}
        </div>
        {totalEstimado > 0 && (
          <span className="text-xs font-bold text-on-surface-variant">
            ${totalEstimado.toLocaleString("es-AR")}
          </span>
        )}
      </div>

      <div className="bg-surface rounded-[32px] border border-outline-variant/10 shadow-sm overflow-hidden">
        {pendingTasks.length > 0 ? (
          <div className="divide-y divide-outline-variant/10">
            {pendingTasks.slice(0, 10).map((task) => (
              <Link
                key={task.id}
                href={`/trabajos/${task.trabajo_id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group"
              >
                <Circle className="w-5 h-5 text-on-surface-variant/30 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface truncate">
                    {task.descripcion}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant/50 mt-0.5">
                    <span className="font-bold text-on-surface/70">
                      {task.job?.titulo}
                    </span>
                    <span className="opacity-30">•</span>
                    <span>{task.client?.nombre}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {task.precio !== null && (
                    <span className="text-xs font-bold text-on-surface/60">
                      ${task.precio.toLocaleString("es-AR")}
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-on-surface-variant/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <CheckCircle className="w-10 h-10 text-emerald-500/40 mx-auto mb-3" />
            <p className="text-sm font-bold text-on-surface">
              Todo completado
            </p>
            <p className="text-xs text-on-surface-variant/40 mt-1">
              No hay tareas pendientes.
            </p>
          </div>
        )}

        {pendingTasks.length > 10 && (
          <div className="px-6 py-3 bg-on-surface/[0.02] border-t border-outline-variant/10 text-center">
            <Link
              href="/trabajos"
              className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
            >
              Ver las {pendingTasks.length} tareas pendientes
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
