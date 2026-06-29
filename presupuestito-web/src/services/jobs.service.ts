import { Job } from "@/types";
import { createClient } from "@/utils/supabase/client";

export const jobsService = {
  getAll: async (): Promise<Job[]> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("trabajos").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Job[];
  },

  getById: async (id: string): Promise<Job> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("trabajos").select("*").eq("id", id).eq("user_id", user.id).single();
    if (error) throw new Error(error.message);
    return data as Job;
  },

  create: async (jobData: Omit<Job, "id" | "created_at" | "estado" | "user_id">): Promise<Job> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("trabajos")
      .insert({ ...jobData, user_id: user.id, estado: "borrador" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Job;
  },

  update: async (id: string, jobData: Partial<Job>): Promise<Job> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("trabajos").update(jobData).eq("id", id).eq("user_id", user.id).select().single();
    if (error) throw new Error(error.message);
    return data as Job;
  },

  delete: async (id: string): Promise<void> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { error } = await supabase.from("trabajos").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
  },
};
