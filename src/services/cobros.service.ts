import { Cobro } from "@/types";
import { requireAuth } from "@/utils/supabase/require-auth";

export const cobrosService = {
  getByJobId: async (jobId: string): Promise<Cobro[]> => {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase.from("cobros").select("*").eq("trabajo_id", jobId).eq("user_id", user.id).order("fecha_cobro", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Cobro[];
  },

  create: async (cobroData: Omit<Cobro, "id" | "created_at" | "user_id">): Promise<Cobro> => {
    const { supabase, user } = await requireAuth();

    const { data, error } = await supabase
      .from("cobros")
      .insert({ ...cobroData, user_id: user.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Cobro;
  },

  update: async (id: string, cobroData: Partial<Cobro>): Promise<Cobro> => {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase.from("cobros").update(cobroData).eq("id", id).eq("user_id", user.id).select().single();
    if (error) throw new Error(error.message);
    return data as Cobro;
  },

  delete: async (id: string): Promise<void> => {
    const { supabase, user } = await requireAuth();
    const { error } = await supabase.from("cobros").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
  },
};
