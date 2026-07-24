import { createClient } from "@/utils/supabase/client";

export const getPublicLogoUrl = (path: string): string => {
  const supabase = createClient();
  const { data: { publicUrl } } = supabase.storage
    .from('company-logos')
    .getPublicUrl(path);
  return publicUrl;
};
