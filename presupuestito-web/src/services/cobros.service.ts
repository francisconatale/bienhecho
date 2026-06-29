import { Cobro } from "@/types";
import { createClient } from "@/utils/supabase/client";

export const cobrosService = {
  getAll: async (): Promise<Cobro[]> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("cobros").select("*").eq("user_id", user.id).order("fecha_cobro", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Cobro[];
  },

  getByJobId: async (jobId: string): Promise<Cobro[]> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("cobros").select("*").eq("trabajo_id", jobId).eq("user_id", user.id).order("fecha_cobro", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Cobro[];
  },

  create: async (cobroData: Omit<Cobro, "id" | "created_at" | "user_id">): Promise<Cobro> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("cobros")
      .insert({ ...cobroData, user_id: user.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Cobro;
  },

  update: async (id: string, cobroData: Partial<Cobro>): Promise<Cobro> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("cobros").update(cobroData).eq("id", id).eq("user_id", user.id).select().single();
    if (error) throw new Error(error.message);
    return data as Cobro;
  },

  delete: async (id: string): Promise<void> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { error } = await supabase.from("cobros").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
  },
};
