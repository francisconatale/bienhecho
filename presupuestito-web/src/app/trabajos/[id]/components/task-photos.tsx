"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Image } from "lucide-react";
import { TaskPhoto } from "@/types";
import { useDataStore } from "@/lib/store";
import { PhotoUpload } from "./photo-upload";
import { cn } from "@/lib/utils";
import {
  getPhotosByTarea,
  addPhoto,
  deletePhoto,
} from "@/lib/photo-storage";

interface TaskPhotosProps {
  tareaId: string;
}

const MAX_PHOTOS = 20;

export function TaskPhotos({ tareaId }: TaskPhotosProps) {
  const { taskPhotos, addTaskPhoto, removeTaskPhoto } = useDataStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const photos = taskPhotos.filter((p) => p.tarea_id === tareaId);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const storedPhotos = await getPhotosByTarea(tareaId);
        storedPhotos.forEach((photo) => {
          if (!taskPhotos.find((p) => p.id === photo.id)) {
            addTaskPhoto(photo);
          }
        });
      } catch (error) {
        console.error("Error loading photos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPhotos();
  }, [tareaId]);

  const handleSave = async (photoData: {
    tareaId: string;
    url: string;
    descripcion: string;
    orden: number;
  }) => {
    const newPhoto: TaskPhoto = {
      id: crypto.randomUUID(),
      tarea_id: photoData.tareaId,
      url: photoData.url,
      descripcion: photoData.descripcion,
      orden: photos.length,
      created_at: new Date().toISOString(),
    };

    await addPhoto(newPhoto);
    addTaskPhoto(newPhoto);
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    await deletePhoto(id);
    removeTaskPhoto(id);
    setConfirmDeleteId(null);
  };

  if (isLoading) {
    return (
      <div className="py-4 text-center">
        <p className="text-xs text-on-surface-variant/40">Cargando fotos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
          Fotos {photos.length > 0 && `(${photos.length})`}
        </span>
        {photos.length < MAX_PHOTOS && (
          <button
            onClick={() => setIsUploading(true)}
            className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all active:scale-95"
          >
            <Plus className="w-3 h-3" strokeWidth={3} />
            Agregar
          </button>
        )}
      </div>

      {isUploading && (
        <PhotoUpload
          tareaId={tareaId}
          onSave={handleSave}
          onCancel={() => setIsUploading(false)}
        />
      )}

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group rounded-xl overflow-hidden bg-on-surface/5"
            >
              <img
                src={photo.url}
                alt={photo.descripcion || "Foto de tarea"}
                className="w-full h-24 object-cover"
              />
              {photo.descripcion && (
                <p className="px-2 py-1 text-[10px] font-medium text-on-surface-variant/60 truncate">
                  {photo.descripcion}
                </p>
              )}
              <button
                onClick={() => setConfirmDeleteId(photo.id)}
                className="absolute top-1 right-1 p-1.5 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        !isUploading && (
          <div className="py-6 text-center border border-dashed border-outline-variant/20 rounded-xl">
            <Image className="w-8 h-8 mx-auto text-on-surface-variant/20" />
            <p className="text-xs font-medium text-on-surface-variant/30 mt-2">
              Sin fotos aún
            </p>
          </div>
        )
      )}

      {photos.length >= MAX_PHOTOS && !isUploading && (
        <p className="text-[10px] font-medium text-on-surface-variant/40 text-center">
          Límite máximo de fotos alcanzado
        </p>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface rounded-[28px] p-6 mx-4 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-on-surface">
              Eliminar foto
            </h3>
            <p className="text-sm text-on-surface-variant/70 font-medium">
              ¿Estás seguro de eliminar esta foto? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-3 rounded-2xl bg-on-surface/5 text-on-surface font-black text-xs uppercase tracking-widest hover:bg-on-surface/10 transition-all active:scale-95"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
