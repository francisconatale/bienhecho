import { Task } from "@/types";
import { createClient } from "@/utils/supabase/client";

export const tasksService = {
  getAll: async (): Promise<Task[]> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("tareas").select("*").eq("user_id", user.id).order("orden", { ascending: true });
    if (error) throw new Error(error.message);
    return data as Task[];
  },

  getPaginated: async (
    page: number = 1,
    pageSize: number = 10,
    filter: "pendientes" | "completadas",
    category?: "alta" | "media" | "baja"
  ) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    // Fetch joined data using string notation
    // Because of foreign keys, we can do trabajos(titulo, estado, clientes(nombre))
    let query = supabase
      .from("tareas")
      .select("*, trabajos!inner(titulo, estado, clientes(nombre))", { count: "exact" })
      .eq("user_id", user.id)
      .eq("completada", filter === "completadas");

    if (filter === "pendientes" && category) {
      if (category === "baja") {
        query = query.or("prioridad.eq.baja,prioridad.is.null");
      } else {
        query = query.eq("prioridad", category);
      }
    }

    // Order appropriately (e.g. by order or created_at)
    query = query.order("orden", { ascending: true });

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query.range(from, to);
    if (error) throw new Error(error.message);

    // Flatten relations to match expected format (job, client)
    const formatted = data.map((t: any) => ({
      ...t,
      job: t.trabajos ? { ...t.trabajos, id: t.trabajo_id } : null,
      client: t.trabajos?.clientes ? { ...t.trabajos.clientes } : null,
    }));

    return { data: formatted, total: count || 0 };
  },

  getResumen: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const baseQuery = supabase
      .from("tareas")
      .select("*, trabajos!inner(titulo, estado, clientes(nombre))")
      .eq("user_id", user.id)
      .eq("completada", false)
      .order("orden", { ascending: true })
      .limit(5);

    const [alta, media, baja] = await Promise.all([
      baseQuery.eq("prioridad", "alta"),
      baseQuery.eq("prioridad", "media"),
      baseQuery.or("prioridad.eq.baja,prioridad.is.null")
    ]);

    const formatData = (res: any) => (res.data || []).map((t: any) => ({
      ...t,
      job: t.trabajos ? { ...t.trabajos, id: t.trabajo_id } : null,
      client: t.trabajos?.clientes ? { ...t.trabajos.clientes } : null,
    }));

    return {
      alta: formatData(alta),
      media: formatData(media),
      baja: formatData(baja),
    };
  },

  getCounts: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    // En Supabase lo más eficiente para counts múltiples es agrupar o hacer RPC
    // Para simplificar, hacemos counts paralelos
    const getCount = async (filters: any) => {
      let q = supabase.from("tareas").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      Object.entries(filters).forEach(([k, v]) => {
        if (k === "or") q = q.or(v as string);
        else q = q.eq(k, v);
      });
      const { count } = await q;
      return count || 0;
    };

    const [pendingCount, completedCount, alta, media, baja] = await Promise.all([
      getCount({ completada: false }),
      getCount({ completada: true }),
      getCount({ completada: false, prioridad: "alta" }),
      getCount({ completada: false, prioridad: "media" }),
      getCount({ completada: false, or: "prioridad.eq.baja,prioridad.is.null" }),
    ]);

    return {
      pendingCount,
      completedCount,
      categoryCounts: { alta, media, baja }
    };
  },

  getByJobId: async (jobId: string): Promise<Task[]> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("tareas").select("*").eq("trabajo_id", jobId).eq("user_id", user.id).order("orden", { ascending: true });
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("tareas").update(taskData).eq("id", id).eq("user_id", user.id).select().single();
    if (error) throw new Error(error.message);
    return data as Task;
  },

  delete: async (id: string): Promise<void> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    const { error } = await supabase.from("tareas").delete().eq("id", id).eq("user_id", user.id);
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
