import { TransaccionCuentaCorriente } from "@/types";
import { requireAuth } from "@/utils/supabase/require-auth";

export const transactionsService = {
  getByJobId: async (jobId: string): Promise<TransaccionCuentaCorriente[]> => {
    const { supabase, user } = await requireAuth();
    
    const { data, error } = await supabase
      .from("transacciones")
      .select("*")
      .eq("referencia_trabajo_id", jobId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    
    return data as TransaccionCuentaCorriente[];
  },
};
