import { useQuery } from "@tanstack/react-query";
import { suggestionsService_getSmartSuggestions } from "@/actions/suggestions.actions";
import { Task } from "@/types";

export interface AgendaSuggestion {
  jobId: string;
  jobTitle: string;
  clientName: string;
  criticalTasksCount: number;
  criticalTasks: Task[];
}

export function useSmartScheduling() {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["smart-suggestions"],
    queryFn: suggestionsService_getSmartSuggestions,
  });

  const suggestions: AgendaSuggestion[] = rows.map((row) => ({
    jobId: row.job_id,
    jobTitle: row.job_title,
    clientName: row.client_name,
    criticalTasksCount: row.critical_tasks_count,
    criticalTasks: (row.critical_tasks || []) as Task[],
  }));

  return { suggestions, isLoading };
}
