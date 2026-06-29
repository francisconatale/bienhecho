import { Visit, VisitaTarea } from "@/types";
import { createClient } from "@/utils/supabase/client";

export const visitsService = {
  getAll: async (): Promise<Visit[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("visitas").select("*").order("fecha", { ascending: true });
    if (error) throw new Error(error.message);
    return data as Visit[];
  },

  getByDate: async (date: string): Promise<Visit[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("visitas").select("*").eq("fecha", date);
    if (error) throw new Error(error.message);
    return data as Visit[];
  },

  getByJobId: async (jobId: string): Promise<Visit[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("visitas").select("*").eq("trabajo_id", jobId);
    if (error) throw new Error(error.message);
    return data as Visit[];
  },

  create: async (visitData: Omit<Visit, "id" | "created_at" | "user_id">): Promise<Visit> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("visitas")
      .insert({ ...visitData, user_id: user.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Visit;
  },

  update: async (id: string, visitData: Partial<Visit>): Promise<Visit> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("visitas").update(visitData).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data as Visit;
  },

  delete: async (id: string): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase.from("visitas").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  // Visita Tareas
  getVisitaTareas: async (): Promise<VisitaTarea[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("visita_tareas").select("*");
    if (error) throw new Error(error.message);
    return data as VisitaTarea[];
  },

  addVisitaTarea: async (vtData: VisitaTarea): Promise<VisitaTarea> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("visita_tareas").insert(vtData).select().single();
    if (error) throw new Error(error.message);
    return data as VisitaTarea;
  },

  removeVisitaTarea: async (visitaId: string, tareaId: string): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase.from("visita_tareas").delete().match({ visita_id: visitaId, tarea_id: tareaId });
    if (error) throw new Error(error.message);
  },
};
