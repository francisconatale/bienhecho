import { Job } from "@/types";
import { createClient } from "@/utils/supabase/client";

export const jobsService = {
  getAll: async (): Promise<Job[]> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("trabajos").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Job[];
  },

  
  getDashboardStats: async (): Promise<{ totalJobs: number; totalToInvoice: number }> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");

    const { data, error, count } = await supabase
      .from("trabajos")
      .select("presupuesto", { count: "exact" })
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);

    const totalToInvoice = (data || []).reduce((acc, row) => acc + (row.presupuesto || 0), 0);
    return { totalJobs: count || 0, totalToInvoice };
  },

  getPaginated: async (
    page: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<{ data: (Job & { clientes: { nombre: string } | null })[]; total: number }> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");

    let query = supabase
      .from("trabajos")
      .select("*, clientes(nombre)", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (search) {
      // Supabase JS allows filtering by joined table columns if they are referenced
      query = query.or(`titulo.ilike.%${search}%,clientes.nombre.ilike.%${search}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) throw new Error(error.message);
    return { data: data as any[], total: count || 0 };
  },

  getById: async (id: string): Promise<Job> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("trabajos").select("*").eq("id", id).eq("user_id", user.id).single();
    if (error) throw new Error(error.message);
    return data as Job;
  },

  create: async (jobData: Omit<Job, "id" | "created_at" | "estado" | "user_id">): Promise<Job> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
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
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("trabajos").update(jobData).eq("id", id).eq("user_id", user.id).select().single();
    if (error) throw new Error(error.message);
    return data as Job;
  },

  delete: async (id: string): Promise<void> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");
    const { error } = await supabase.from("trabajos").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
  },
};
