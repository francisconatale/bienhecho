import { Client } from "@/types";
import { requireAuth } from "@/utils/supabase/require-auth";

export const clientsService = {
  getAll: async (): Promise<Client[]> => {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase.from("clientes").select("*").eq("user_id", user.id).order("nombre", { ascending: true });
    if (error) throw new Error(error.message);
    return data as Client[];
  },

  getPaginated: async (page: number = 1, pageSize: number = 10, search?: string) => {
    const { supabase, user } = await requireAuth();

    let query = supabase
      .from("clientes")
      .select("*", { count: "exact" })
      .eq("user_id", user.id);

    if (search) {
      query = query.ilike("nombre", `%${search}%`);
    }

    query = query.order("nombre", { ascending: true });

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query.range(from, to);
    if (error) throw new Error(error.message);

    return { data: data || [], total: count || 0 };
  },

  getById: async (id: string): Promise<Client | null> => {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase.from("clientes").select("*").eq("id", id).eq("user_id", user.id).single();
    if (error) throw new Error(error.message);
    return data as Client;
  },

  create: async (clientData: Omit<Client, "id" | "created_at" | "user_id">): Promise<Client> => {
    const { supabase, user } = await requireAuth();

    const { data, error } = await supabase
      .from("clientes")
      .insert({ ...clientData, user_id: user.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Client;
  },

  update: async (id: string, clientData: Partial<Client>): Promise<Client> => {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase.from("clientes").update(clientData).eq("id", id).eq("user_id", user.id).select().single();
    if (error) throw new Error(error.message);
    return data as Client;
  },

  delete: async (id: string): Promise<void> => {
    const { supabase, user } = await requireAuth();
    const { error } = await supabase.from("clientes").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
  },
};
