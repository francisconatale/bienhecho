import { TaskPhoto } from "@/types";
import { createClient } from "@/utils/supabase/client";

export const taskPhotosService = {
  getByTaskId: async (taskId: string): Promise<TaskPhoto[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("task_photos").select("*").eq("tarea_id", taskId).order("orden", { ascending: true });
    if (error) throw new Error(error.message);
    return data as TaskPhoto[];
  },

  create: async (photoData: Omit<TaskPhoto, "id" | "created_at" | "user_id">): Promise<TaskPhoto> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("task_photos")
      .insert({ ...photoData, user_id: user.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as TaskPhoto;
  },

  update: async (id: string, photoData: Partial<TaskPhoto>): Promise<TaskPhoto> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("task_photos").update(photoData).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data as TaskPhoto;
  },

  delete: async (id: string): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase.from("task_photos").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
