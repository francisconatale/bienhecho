import { Job } from "@/types";
import { requireAuth } from "@/utils/supabase/require-auth";

export const jobsService = {
  getAll: async (): Promise<Job[]> => {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase.from("trabajos").select("*, clientes(nombre)").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Job[];
  },

  getDashboardStats: async () => {
    const { supabase, user } = await requireAuth();

    const [jobsResult, tasksResult] = await Promise.all([
      supabase.from("trabajos").select("id, estado, presupuesto").eq("user_id", user.id),
      supabase.from("tareas").select("id, completada").eq("user_id", user.id),
    ]);

    if (jobsResult.error) throw new Error(jobsResult.error.message);
    if (tasksResult.error) throw new Error(tasksResult.error.message);

    const jobs = jobsResult.data || [];
    const tasks = tasksResult.data || [];

    const totalToInvoice = jobs
      .filter((j: any) => j.estado !== "pagado")
      .reduce((sum: number, j: any) => sum + (j.presupuesto || 0), 0);

    return { totalJobs: jobs.length, totalToInvoice };
  },

  getPaginated: async (page: number = 1, pageSize: number = 10, filter?: string) => {
    const { supabase, user } = await requireAuth();

    let query = supabase
      .from("trabajos")
      .select("*, clientes(nombre)", { count: "exact" })
      .eq("user_id", user.id);

    if (filter && filter !== "todos") {
      query = query.ilike("titulo", `%${filter}%`);
    }

    query = query.order("created_at", { ascending: false });

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query.range(from, to);
    if (error) throw new Error(error.message);

    return { data: data || [], total: count || 0 };
  },

  getById: async (id: string): Promise<Job | null> => {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase.from("trabajos").select("*, clientes(nombre)").eq("id", id).eq("user_id", user.id).single();
    if (error) throw new Error(error.message);
    return data as Job;
  },

  create: async (jobData: Omit<Job, "id" | "created_at" | "user_id">): Promise<Job> => {
    const { supabase, user } = await requireAuth();

    const { data, error } = await supabase
      .from("trabajos")
      .insert({ ...jobData, user_id: user.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Job;
  },

  update: async (id: string, jobData: Partial<Job>): Promise<Job> => {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase.from("trabajos").update(jobData).eq("id", id).eq("user_id", user.id).select().single();
    if (error) throw new Error(error.message);
    return data as Job;
  },

  delete: async (id: string): Promise<void> => {
    const { supabase, user } = await requireAuth();
    const { error } = await supabase.from("trabajos").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
  },
};
