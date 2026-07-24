import { requireAuth } from "@/utils/supabase/require-auth";
import { createClient } from "@/utils/supabase/client";

export const storageService = {
  uploadCompanyLogo: async (userId: string, file: File): Promise<{ path: string; error: null } | { path: null; error: Error }> => {
    const { supabase } = await requireAuth();

    const fileName = `${userId}/logo.${file.name.split('.').pop()}`;

    const { data, error } = await supabase.storage
      .from('company-logos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) return { path: null, error };

    return { path: data?.path || fileName, error: null };
  },

  deleteCompanyLogo: async (logoPath: string): Promise<{ error: null } | { error: Error }> => {
    const { supabase } = await requireAuth();

    const { error } = await supabase.storage
      .from('company-logos')
      .remove([logoPath]);

    if (error) return { error };

    return { error: null };
  },

  getPublicUrl: (path: string): string => {
    const supabase = createClient();
    const { data: { publicUrl } } = supabase.storage
      .from('company-logos')
      .getPublicUrl(path);
    return publicUrl;
  },
};
