import { Plus, Flame, AlertCircle } from "lucide-react";
import { useSmartScheduling, AgendaSuggestion } from "../hooks/use-smart-scheduling";
import { VisitForm } from "./visit-form";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService_getAll } from "@/actions/jobs.actions";
import { clientsService_getAll } from "@/actions/clients.actions";
import { visitsService_create } from "@/actions/visits.actions";

export function SmartSuggestions() {
  const queryClient = useQueryClient();
  const { suggestions } = useSmartScheduling();
  const { data: jobs = [] } = useQuery({ queryKey: ["jobs"], queryFn: jobsService_getAll });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: clientsService_getAll });
  const [selectedSuggestion, setSelectedSuggestion] = useState<AgendaSuggestion | null>(null);

  const addVisitMutation = useMutation({
    mutationFn: visitsService_create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["visits"] }),
  });

  if (suggestions.length === 0) return null;

  return (
    <>
      <div className="mb-6">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 mb-3 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          Sugerencias de Planificación
        </h3>
        
        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-none snap-x">
          {suggestions.map((sug) => (
            <div 
              key={sug.jobId} 
              className="snap-start shrink-0 w-[280px] bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl border border-orange-500/20 shadow-sm p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500/80 bg-orange-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    Atención Requerida
                  </span>
                </div>
                <h4 className="text-sm font-bold text-on-surface line-clamp-1">{sug.jobTitle}</h4>
                <p className="text-[11px] text-on-surface-variant/60 mb-3">{sug.clientName}</p>
                
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Tiene {sug.criticalTasksCount} tarea{sug.criticalTasksCount > 1 ? "s" : ""} crítica{sug.criticalTasksCount > 1 ? "s" : ""} sin agendar.
                </p>
              </div>
              
              <button
                onClick={() => setSelectedSuggestion(sug)}
                className="mt-4 w-full h-9 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-orange-500 hover:text-white transition-colors transition-transform active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                Agendar Visita
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={!!selectedSuggestion}
        onClose={() => setSelectedSuggestion(null)}
        title="Agendar desde sugerencia"
        footer={
          <div className="flex gap-2">
            <button type="button" onClick={() => setSelectedSuggestion(null)} className="flex-1 h-11 rounded-xl font-bold text-xs text-on-surface-variant hover:bg-outline-variant/10 transition-colors">Cancelar</button>
            <button type="button" className="flex-1 h-11 rounded-xl font-bold text-xs text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 transition-colors">Crear Visita</button>
          </div>
        }
      >
        {selectedSuggestion && (
          <VisitForm
            jobs={jobs}
            clients={clients}
            initial={{
              id: "",
              trabajo_id: selectedSuggestion.jobId,
              fecha: "",
              hora_inicio: "",
              hora_fin: "",
              estado: "planificada",
              notas: `Tareas críticas pendientes:\n${selectedSuggestion.criticalTasks.map(t => `- ${t.descripcion}`).join("\n")}`,
              created_at: ""
            }}
            onSubmit={async (data) => {
              await addVisitMutation.mutateAsync(data);
              setSelectedSuggestion(null);
            }}
            onCancel={() => setSelectedSuggestion(null)}
            hideFooter
          />
        )}
      </Modal>
    </>
  );
}
