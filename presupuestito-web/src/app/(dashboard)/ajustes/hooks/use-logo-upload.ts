import { useState } from "react";
import { profileService, Profile } from "@/services/profile.service";
import { storageService } from "@/services/storage.service";

export function useLogoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadLogo = async (file: File): Promise<Profile | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // 1. Get current profile to get the user ID
      const profile = await profileService.get();
      if (!profile) {
        throw new Error("No se pudo obtener el perfil de usuario");
      }

      // 2. Upload the file to Supabase Storage
      const { path, error: uploadError } = await storageService.uploadCompanyLogo(profile.id, file);
      
      if (uploadError) {
        throw uploadError;
      }

      // 3. Update the profile with the new logo_path
      const updatedProfile = await profileService.update({ logo_path: path });
      
      return updatedProfile;
    } catch (err) {
      console.error("Error uploading logo:", err);
      setError(err instanceof Error ? err.message : "Error desconocido al subir el logo");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteLogo = async (): Promise<Profile | null> => {
    setIsUploading(true);
    setError(null);

    try {
      const profile = await profileService.get();
      if (!profile || !profile.logo_path) {
        return profile;
      }

      // 1. Delete from storage
      const { error: deleteError } = await storageService.deleteCompanyLogo(profile.logo_path);
      if (deleteError) {
        throw deleteError;
      }

      // 2. Update profile
      const updatedProfile = await profileService.update({ logo_path: null });
      return updatedProfile;
    } catch (err) {
      console.error("Error deleting logo:", err);
      setError(err instanceof Error ? err.message : "Error desconocido al eliminar el logo");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadLogo,
    deleteLogo,
    isUploading,
    error,
  };
}
