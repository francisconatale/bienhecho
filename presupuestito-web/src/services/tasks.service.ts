import { Task } from "@/types";
import { createClient } from "@/utils/supabase/client";

export const tasksService = {
  getAll: async (): Promise<Task[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("tareas").select("*").order("orden", { ascending: true });
    if (error) throw new Error(error.message);
    return data as Task[];
  },

  getByJobId: async (jobId: string): Promise<Task[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("tareas").select("*").eq("trabajo_id", jobId).order("orden", { ascending: true });
    if (error) throw new Error(error.message);
    return data as Task[];
  },

  create: async (taskData: Omit<Task, "id" | "user_id">): Promise<Task> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("tareas")
      .insert({ ...taskData, user_id: user.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Task;
  },

  update: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("tareas").update(taskData).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data as Task;
  },

  delete: async (id: string): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase.from("tareas").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  reorder: async (jobId: string, taskIds: string[]): Promise<void> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const updates = taskIds.map((id, index) => ({
      id,
      orden: index,
      trabajo_id: jobId,
      user_id: user.id,
    }));
    const { error } = await supabase.from("tareas").upsert(updates);
    if (error) throw new Error(error.message);
  },
};
