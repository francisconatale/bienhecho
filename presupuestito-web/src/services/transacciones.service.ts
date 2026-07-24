import { TransaccionCuentaCorriente } from "@/types";
import { requireAuth } from "@/utils/supabase/require-auth";

export const transaccionesService = {
  getByClientId: async (clientId: string): Promise<TransaccionCuentaCorriente[]> => {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase.from("transacciones").select("*").eq("cliente_id", clientId).eq("user_id", user.id).order("fecha", { ascending: false });
    if (error) throw new Error(error.message);
    return data as TransaccionCuentaCorriente[];
  },

  create: async (txData: Omit<TransaccionCuentaCorriente, "id" | "created_at" | "user_id">): Promise<TransaccionCuentaCorriente> => {
    const { supabase, user } = await requireAuth();

    const { data, error } = await supabase
      .from("transacciones")
      .insert({ ...txData, user_id: user.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as TransaccionCuentaCorriente;
  },
};
