import { createClient } from "@/utils/supabase/client";

export const storageService = {
  async uploadCompanyLogo(
    userId: string,
    file: File
  ): Promise<{ path: string; error: Error | null }> {
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    // Path structure: [user_id]/[timestamp].[ext]
    const filePath = `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("company-logos")
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) {
      return { path: "", error: new Error(error.message) };
    }

    return { path: data.path, error: null };
  },

  async deleteCompanyLogo(path: string): Promise<{ error: Error | null }> {
    const supabase = createClient();
    const { error } = await supabase.storage
      .from("company-logos")
      .remove([path]);
      
    if (error) {
      return { error: new Error(error.message) };
    }
    return { error: null };
  },

  getPublicUrl(path: string): string {
    const supabase = createClient();
    const { data } = supabase.storage
      .from("company-logos")
      .getPublicUrl(path);
      
    return data.publicUrl;
  },
};

