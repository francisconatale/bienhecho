import { Client } from "@/types";
import { createClient } from "@/utils/supabase/client";

export const clientsService = {
  getAll: async (): Promise<Client[]> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("clientes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Client[];
  },

  getPaginated: async (
    page: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<{ data: Client[]; total: number }> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");

    let query = supabase
      .from("clientes")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`nombre.ilike.%${search}%,email.ilike.%${search}%,telefono.ilike.%${search}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) throw new Error(error.message);
    return { data: data as Client[], total: count || 0 };
  },

  getById: async (id: string): Promise<Client> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("clientes").select("*").eq("id", id).eq("user_id", user.id).single();
    if (error) throw new Error(error.message);
    return data as Client;
  },

  create: async (clientData: Omit<Client, "id" | "created_at" | "user_id">): Promise<Client> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("clientes")
      .insert({ ...clientData, user_id: user.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Client;
  },

  update: async (id: string, clientData: Partial<Client>): Promise<Client> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");
    const { data, error } = await supabase.from("clientes").update(clientData).eq("id", id).eq("user_id", user.id).select().single();
    if (error) throw new Error(error.message);
    return data as Client;
  },

  delete: async (id: string): Promise<void> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");
    const { error } = await supabase.from("clientes").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
  },
};

