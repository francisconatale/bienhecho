import { requireAuth } from "@/utils/supabase/require-auth";
import { cache } from "react";

export interface Profile {
  id: string;
  nombre: string;
  rubro?: string;
  direccion?: string;
  numero_matricula?: string;
  matricula?: string;
  cuit?: string;
  logo_path?: string;
  created_at: string;
}

export const profileService = {
  get: cache(async (): Promise<Profile | null> => {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase.from("perfiles").select("*").eq("id", user.id).single();
    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data as Profile | null;
  }),

  upsert: async (profileData: Partial<Profile>): Promise<Profile> => {
    const { supabase, user } = await requireAuth();

    const { data, error } = await supabase
      .from("perfiles")
      .upsert({ ...profileData, id: user.id }, { onConflict: "id" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Profile;
  },

  update: async (profileData: Partial<Profile>): Promise<Profile> => {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase.from("perfiles").update(profileData).eq("id", user.id).select().single();
    if (error) throw new Error(error.message);
    return data as Profile;
  },
};
