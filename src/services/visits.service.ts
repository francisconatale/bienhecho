import { Visit, VisitaTarea } from "@/types";
import { requireAuth } from "@/utils/supabase/require-auth";

export type VisitWithJob = Visit & {
  job?: {
    titulo: string;
    direccion: string;
    cliente_id: string;
    clientes: { nombre: string };
  };
};

export const visitsService = {
  getAll: async (): Promise<Visit[]> => {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase.from("visitas").select("*").eq("user_id", user.id).order("fecha", { ascending: true });
    if (error) throw new Error(error.message);
    return data as Visit[];
  },

  getByRange: async (desde: string, hasta: string): Promise<VisitWithJob[]> => {
    const { supabase, user } = await requireAuth();

    const { data, error } = await supabase
      .from("visitas")
      .select("*, trabajos(titulo, direccion, cliente_id, clientes(nombre))")
      .eq("user_id", user.id)
      .gte("fecha", desde)
      .lte("fecha", hasta)
      .order("fecha", { ascending: true })
      .order("hora_inicio", { ascending: true });

    if (error) throw new Error(error.message);
    return data as VisitWithJob[];
  },

  getUpcoming: async (): Promise<(Visit & { trabajos: { titulo: string, clientes: { nombre: string } } })[]> => {
    const { supabase, user } = await requireAuth();

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const inSevenDays = new Date();
    inSevenDays.setDate(inSevenDays.getDate() + 7);
    const inSevenDaysStr = inSevenDays.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("visitas")
      .select("*, trabajos(titulo, cliente_id, clientes(nombre))")
      .eq("user_id", user.id)
      .eq("estado", "planificada")
      .gte("fecha", todayStr)
      .lte("fecha", inSevenDaysStr)
      .order("fecha", { ascending: true })
      .limit(5);

    if (error) throw new Error(error.message);
    return data as any[];
  },

  create: async (visitData: Omit<Visit, "id" | "created_at" | "user_id">): Promise<Visit> => {
    const { supabase, user } = await requireAuth();

    const { data, error } = await supabase
      .from("visitas")
      .insert({ ...visitData, user_id: user.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Visit;
  },

  update: async (id: string, visitData: Partial<Visit>): Promise<Visit> => {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase.from("visitas").update(visitData).eq("id", id).eq("user_id", user.id).select().single();
    if (error) throw new Error(error.message);
    return data as Visit;
  },

  delete: async (id: string): Promise<void> => {
    const { supabase, user } = await requireAuth();
    const { error } = await supabase.from("visitas").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
  },

  getVisitaTareas: async (): Promise<VisitaTarea[]> => {
    const { supabase } = await requireAuth();
    const { data, error } = await supabase.from("visita_tareas").select("*");
    if (error) throw new Error(error.message);
    return data as VisitaTarea[];
  },
};
