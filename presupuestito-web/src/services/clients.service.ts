import { Client } from "@/types";
import { createClient } from "@/utils/supabase/client";

export const clientsService = {
  getAll: async (): Promise<Client[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Client[];
  },

  getById: async (id: string): Promise<Client> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("clientes").select("*").eq("id", id).single();
    if (error) throw new Error(error.message);
    return data as Client;
  },

  create: async (clientData: Omit<Client, "id" | "created_at" | "user_id">): Promise<Client> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
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
    const { data, error } = await supabase.from("clientes").update(clientData).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data as Client;
  },

  delete: async (id: string): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase.from("clientes").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
