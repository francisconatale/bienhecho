import { createClient } from "@/utils/supabase/client";

export interface Profile {
  id: string;
  nombre: string;
  rubro: string | null;
  numero_matricula: string | null;
  direccion: string | null;
  logo_path: string | null;
  created_at: string;
}

export const profileService = {
  get: async (): Promise<Profile | null> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return null;

    const { data, error } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile details:", { code: error.code, message: error.message, details: error.details, hint: error.hint });
      return null;
    }

    return data as Profile;
  },

  upsert: async (profile: { nombre: string; rubro?: string; numero_matricula?: string; direccion?: string; logo_path?: string | null }): Promise<Profile> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("perfiles")
      .upsert({
        id: user.id,
        ...profile,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Profile;
  },

  update: async (updates: Partial<Pick<Profile, "nombre" | "rubro" | "numero_matricula" | "direccion" | "logo_path">>): Promise<Profile> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("perfiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Profile;
  },
};

