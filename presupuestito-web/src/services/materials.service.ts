import { Material } from "@/types";
import { createClient } from "@/utils/supabase/client";

export const materialsService = {
  getAll: async (): Promise<Material[]> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("materiales").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Material[];
  },

  getByJobId: async (jobId: string): Promise<Material[]> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("materiales").select("*").eq("trabajo_id", jobId).eq("user_id", user.id);
    if (error) throw new Error(error.message);
    return data as Material[];
  },

  create: async (materialData: Omit<Material, "id" | "created_at" | "user_id">): Promise<Material> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("materiales")
      .insert({ ...materialData, user_id: user.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Material;
  },

  update: async (id: string, materialData: Partial<Material>): Promise<Material> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("materiales").update(materialData).eq("id", id).eq("user_id", user.id).select().single();
    if (error) throw new Error(error.message);
    return data as Material;
  },

  delete: async (id: string): Promise<void> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { error } = await supabase.from("materiales").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
  },
};
