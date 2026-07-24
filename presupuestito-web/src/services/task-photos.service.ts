import { TaskPhoto } from "@/types";
import { requireAuth } from "@/utils/supabase/require-auth";

export const taskPhotosService = {
  getByTaskId: async (taskId: string): Promise<TaskPhoto[]> => {
    const { supabase, user } = await requireAuth();
    const { data, error } = await supabase.from("task_photos").select("*").eq("tarea_id", taskId).eq("user_id", user.id).order("orden", { ascending: true });
    if (error) throw new Error(error.message);
    return data as TaskPhoto[];
  },

  uploadFile: async (file: File): Promise<string> => {
    const { supabase, user } = await requireAuth();

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Tipo de archivo no válido");
    }
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      throw new Error("Extensión de archivo no válida");
    }

    const fileName = `${user.id}/${Math.random().toString(36).substring(2, 15)}.${ext}`;

    const { data, error } = await supabase.storage
      .from('task-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw new Error(error.message);

    const { data: { publicUrl } } = supabase.storage
      .from('task-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  },

  create: async (photoData: Omit<TaskPhoto, "id" | "created_at" | "user_id">): Promise<TaskPhoto> => {
    const { supabase, user } = await requireAuth();

    const { data, error } = await supabase
      .from("task_photos")
      .insert({ ...photoData, user_id: user.id })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as TaskPhoto;
  },

  delete: async (id: string, photoUrl?: string): Promise<void> => {
    const { supabase, user } = await requireAuth();

    if (photoUrl) {
      try {
        const urlObj = new URL(photoUrl);
        const pathSegments = urlObj.pathname.split('/task-photos/');
        if (pathSegments.length > 1) {
          const filePath = pathSegments[1];
          await supabase.storage.from('task-photos').remove([filePath]);
        }
      } catch (e) {
        console.error("Error eliminando foto del storage:", e);
      }
    }

    const { error } = await supabase.from("task_photos").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
  },
};
