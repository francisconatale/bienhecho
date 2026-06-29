"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Plus, Trash2, Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { TaskPhoto } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["taskPhotos", tareaId],
    queryFn: () => getPhotosByTarea(tareaId),
  });

  const [isUploading, setIsUploading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [viewerPhotoIndex, setViewerPhotoIndex] = useState<number | null>(null);

  const addPhotoMutation = useMutation({
    mutationFn: addPhoto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["taskPhotos", tareaId] }),
  });

  const deletePhotoMutation = useMutation({
    mutationFn: deletePhoto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["taskPhotos", tareaId] }),
  });

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

    await addPhotoMutation.mutateAsync(newPhoto);
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    await deletePhotoMutation.mutateAsync(id);
    setConfirmDeleteId(null);
  };

  const openViewer = (index: number) => setViewerPhotoIndex(index);
  const closeViewer = () => setViewerPhotoIndex(null);

  const goToPrev = useCallback(() => {
    if (viewerPhotoIndex !== null && viewerPhotoIndex > 0) {
      setViewerPhotoIndex(viewerPhotoIndex - 1);
    }
  }, [viewerPhotoIndex]);

  const goToNext = useCallback(() => {
    if (viewerPhotoIndex !== null && viewerPhotoIndex < photos.length - 1) {
      setViewerPhotoIndex(viewerPhotoIndex + 1);
    }
  }, [viewerPhotoIndex, photos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewerPhotoIndex === null) return;
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerPhotoIndex, goToPrev, goToNext]);

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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mt-2">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative group rounded-2xl overflow-hidden bg-on-surface/5 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => openViewer(index)}
            >
              <img
                src={photo.url}
                alt={photo.descripcion || "Foto de tarea"}
                className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {photo.descripcion && (
                <p className="px-2 py-1 text-[10px] font-medium text-on-surface-variant/60 truncate">
                  {photo.descripcion}
                </p>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDeleteId(photo.id);
                }}
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
            <ImageIcon className="w-8 h-8 mx-auto text-on-surface-variant/20" />
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

      {confirmDeleteId && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 bg-surface/80 ">
          <div className="bg-surface/90 dark:bg-surface/70 backdrop-blur-xl rounded-xl p-6 mx-4 max-w-sm w-full shadow-2xl space-y-4 border border-outline-variant/20">
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
        </div>,
        document.body
      )}

      {viewerPhotoIndex !== null && typeof window !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={closeViewer}
        >
          <button
            onClick={closeViewer}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {viewerPhotoIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          <img
            src={photos[viewerPhotoIndex].url}
            alt={photos[viewerPhotoIndex].descripcion || "Foto de tarea"}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {viewerPhotoIndex < photos.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all z-10"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span className="text-white/60 text-sm font-medium">
              {viewerPhotoIndex + 1} / {photos.length}
            </span>
          </div>

          {photos[viewerPhotoIndex].descripcion && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-[80vw]">
              <p className="text-white/80 text-sm font-medium text-center">
                {photos[viewerPhotoIndex].descripcion}
              </p>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
