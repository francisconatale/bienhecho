import { requireAuth } from "@/utils/supabase/require-auth";

export interface SmartSuggestionRow {
  job_id: string;
  job_title: string;
  client_name: string;
  critical_tasks_count: number;
  high_priority_count: number;
  critical_tasks: any[];
}

export const suggestionsService = {
  getSmartSuggestions: async (): Promise<SmartSuggestionRow[]> => {
    const { supabase } = await requireAuth();
    const { data, error } = await supabase.rpc("get_smart_suggestions");
    if (error) throw new Error(error.message);
    return (data || []) as SmartSuggestionRow[];
  },
};
