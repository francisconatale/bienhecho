"use client";

import { ChevronDown, ChevronUp, Plus, Search, Briefcase } from "lucide-react";
import { useBudgetIdentity } from "../../hooks/use-budget-identity";

export function JobSelector() {
  const {
    clientId,
    selectedJob,
    isJobListOpen,
    jobSearch,
    filteredJobs,
    setJobSearch,
    handleToggleJobs,
    handleSelectJob,
    openNewJobModal,
  } = useBudgetIdentity();

  if (!clientId) return null;

  return (
    <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-hidden">
      <button
        onClick={handleToggleJobs}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-variant/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-variant/30 flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-on-surface-variant" />
          </div>
          <div className="text-left">
            <span className="text-sm font-medium text-on-surface block">
              {selectedJob ? selectedJob.name : "Trabajo / Obra"}
            </span>
            <span className="text-[10px] text-on-surface-variant">
              {selectedJob ? selectedJob.status : "Opcional - Útil para agrupar presupuestos"}
            </span>
          </div>
        </div>
        {isJobListOpen ? (
          <ChevronUp className="w-4 h-4 text-on-surface-variant/60" />
        ) : (
          <ChevronDown className="w-4 h-4 text-on-surface-variant/60" />
        )}
      </button>

      {isJobListOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-outline-variant/20 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative pt-3">
            <Search className="absolute left-3 top-1/2 translate-y-[-25%] w-3.5 h-3.5 text-on-surface-variant/40" />
            <input
              type="text"
              placeholder="Buscar trabajo..."
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg pl-9 pr-4 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto space-y-1">
            {filteredJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => handleSelectJob(job.id)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-variant/10 transition-colors text-left"
              >
                <Briefcase className="w-3.5 h-3.5 text-on-surface-variant/60 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-medium text-on-surface block truncate">{job.name}</span>
                  <span className="text-[10px] text-on-surface-variant">{job.status}</span>
                </div>
              </button>
            ))}

            <button
              onClick={(e) => {
                e.stopPropagation();
                openNewJobModal();
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 border border-dashed border-primary/30 rounded-lg text-primary text-xs font-medium hover:bg-primary/5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo Trabajo / Obra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
