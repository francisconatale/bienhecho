import { Task } from "@/types";
import { createClient } from "@/utils/supabase/client";

const applyDefaults = (task: any): Task => {
  const result = { ...task };
  if (result.cantidad === undefined || result.cantidad === null) {
    result.cantidad = 1;
    if (result.precio !== undefined && result.precio !== null) {
      result.precio_unitario = result.precio;
    }
  }
  return result as Task;
};

export const tasksService = {
  getAll: async (): Promise<Task[]> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("tareas").select("*").eq("user_id", user.id).order("orden", { ascending: true });
    if (error) throw new Error(error.message);
    return (data as any[]).map(applyDefaults);
  },

  getPaginated: async (
    page: number = 1,
    pageSize: number = 10,
    filter: "pendientes" | "completadas",
    category?: "alta" | "media" | "baja"
  ) => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
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
    const formatted = data.map((t: any) => applyDefaults({
      ...t,
      job: t.trabajos ? { ...t.trabajos, id: t.trabajo_id } : null,
      client: t.trabajos?.clientes ? { ...t.trabajos.clientes } : null,
    }));

    return { data: formatted, total: count || 0 };
  },

  getResumen: async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");

    // Fetch up to 50 pending tasks and group them client-side to save queries
    const { data, error } = await supabase
      .from("tareas")
      .select("*, trabajos!inner(titulo, estado, clientes(nombre))")
      .eq("user_id", user.id)
      .eq("completada", false)
      .order("orden", { ascending: true })
      .limit(50); // Get enough to likely satisfy 5 per category

    if (error) throw new Error(error.message);

    const formattedData = (data || []).map((t: any) => applyDefaults({
      ...t,
      job: t.trabajos ? { ...t.trabajos, id: t.trabajo_id } : null,
      client: t.trabajos?.clientes ? { ...t.trabajos.clientes } : null,
    }));

    const alta = formattedData.filter((t: any) => t.prioridad === "alta").slice(0, 5);
    const media = formattedData.filter((t: any) => t.prioridad === "media").slice(0, 5);
    const baja = formattedData.filter((t: any) => t.prioridad === "baja" || !t.prioridad).slice(0, 5);

    return { alta, media, baja };
  },

  getCounts: async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");

    // Replace 5 parallel counts with a single query fetching only what's needed for counts
    const { data, error } = await supabase
      .from("tareas")
      .select("completada, prioridad")
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);

    let pendingCount = 0;
    let completedCount = 0;
    let alta = 0;
    let media = 0;
    let baja = 0;

    (data || []).forEach((t: any) => {
      if (t.completada) {
        completedCount++;
      } else {
        pendingCount++;
        if (t.prioridad === "alta") alta++;
        else if (t.prioridad === "media") media++;
        else baja++;
      }
    });

    return {
      pendingCount,
      completedCount,
      categoryCounts: { alta, media, baja }
    };
  },

  getByJobId: async (jobId: string): Promise<Task[]> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("tareas").select("*").eq("trabajo_id", jobId).eq("user_id", user.id).order("orden", { ascending: true });
    if (error) throw new Error(error.message);
    return (data as any[]).map(applyDefaults);
  },

  create: async (taskData: Omit<Task, "id" | "user_id">): Promise<Task> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("tareas")
      .insert({ ...taskData, user_id: user.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return applyDefaults(data);
  },

  update: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("tareas").update(taskData).eq("id", id).eq("user_id", user.id).select().single();
    if (error) throw new Error(error.message);
    return applyDefaults(data);
  },

  delete: async (id: string): Promise<void> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");
    const { error } = await supabase.from("tareas").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
  },

  reorder: async (jobId: string, taskIds: string[]): Promise<void> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
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

