"use client";

import { useRef, useState, useEffect } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useLogoUpload } from "../../hooks/use-logo-upload";
import { storageService } from "@/services/storage.service";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export function ProfilePicture() {
  const { profile, refetchProfile } = useProfile();
  const { uploadLogo, deleteLogo, isUploading, error } = useLogoUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.logo_path) {
      setPreviewUrl(storageService.getPublicUrl(profile.logo_path));
    } else {
      setPreviewUrl(null);
    }
  }, [profile?.logo_path]);

  const displayName = profile?.nombre || "Prestador de Servicios";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Formato inválido", { description: "Solo se permiten formatos .jpg, .jpeg y .png." });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Archivo muy grande", { description: "El tamaño máximo permitido es 2MB." });
      return;
    }

    try {
      const updatedProfile = await uploadLogo(file);
      if (updatedProfile) {
        refetchProfile();
        if (updatedProfile.logo_path) {
          setPreviewUrl(storageService.getPublicUrl(updatedProfile.logo_path));
        }
        toast.success("Foto actualizada correctamente");
      }
    } catch (err) {
      toast.error("Ocurrió un error al subir la foto");
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar tu foto de perfil?")) return;
    try {
      const updatedProfile = await deleteLogo();
      if (updatedProfile) {
        refetchProfile();
        setPreviewUrl(null);
        toast.success("Foto eliminada correctamente");
      }
    } catch (err) {
      toast.error("Ocurrió un error al eliminar la foto");
    }
  };

  return (
    <section className="flex flex-col items-center">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-surface-container-highest shadow-sm bg-surface-variant flex items-center justify-center relative">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={`Foto de perfil de ${displayName || "usuario"}`}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="text-3xl font-bold text-on-surface-variant uppercase">
              {displayName.charAt(0)}
            </span>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/10 opacity-0 group-active:opacity-100 transition-opacity pointer-events-none" />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        disabled={isUploading}
      />

      <div className="mt-3 flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-primary font-semibold text-sm hover:underline transition-colors select-none disabled:opacity-50"
        >
          {isUploading ? "Subiendo..." : "Cambiar foto"}
        </button>

        {previewUrl && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isUploading}
            className="text-red-500 flex items-center gap-1 text-xs font-medium hover:underline transition-colors select-none disabled:opacity-50"
          >
            <Trash2 className="w-3 h-3" />
            Eliminar foto
          </button>
        )}
        
        {error && (
          <span className="text-red-500 text-xs text-center mt-1">{error}</span>
        )}
      </div>
    </section>
  );
}
