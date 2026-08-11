"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Plus, Trash2, Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { TaskPhoto } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PhotoUpload } from "./photo-upload";
import { cn } from "@/lib/utils";
import { taskPhotosService_getByTaskId, taskPhotosService_uploadFile, taskPhotosService_create, taskPhotosService_delete } from "@/actions/task-photos.actions";
import { useConfirm } from "@/hooks/use-confirm";
import { TareaPhotosSkeleton } from "@/components/ui/skeletons";

interface TaskPhotosProps {
  tareaId: string;
}

const MAX_PHOTOS = 20;

export function TaskPhotos({ tareaId }: TaskPhotosProps) {
  const queryClient = useQueryClient();
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["taskPhotos", tareaId],
    queryFn: () => taskPhotosService_getByTaskId(tareaId),
  });

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewerPhotoIndex, setViewerPhotoIndex] = useState<number | null>(null);
  const [ConfirmDialog, confirm] = useConfirm();
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleSave = async (photoData: {
    tareaId: string;
    file: File;
    descripcion: string;
    orden: number;
  }) => {
    setIsSaving(true);
    try {
      const publicUrl = await taskPhotosService_uploadFile(photoData.file);

      await taskPhotosService_create({
        tarea_id: photoData.tareaId,
        url: publicUrl,
        descripcion: photoData.descripcion,
        orden: photos.length,
      });

      queryClient.invalidateQueries({ queryKey: ["taskPhotos", tareaId] });
    } catch (e) {
      console.error("Error saving photo:", e);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Eliminar foto",
      description: "¿Estás seguro de eliminar esta foto? Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
      variant: "danger",
      action: async () => {
        try {
          const photo = photos.find(p => p.id === id);
          await taskPhotosService_delete(id, photo?.url);
          queryClient.invalidateQueries({ queryKey: ["taskPhotos", tareaId] });
        } catch (e) {
          console.error("Error deleting photo:", e);
        }
      }
    });
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
    if (viewerPhotoIndex === null) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    viewerRef.current?.querySelector<HTMLElement>("button")?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Tab" && viewerRef.current) {
        const focusable = Array.from(
          viewerRef.current.querySelectorAll<HTMLElement>("button")
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [viewerPhotoIndex, goToPrev, goToNext, closeViewer]);

  if (isLoading) {
    return <TareaPhotosSkeleton />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-on-surface-variant/40">
          Fotos {photos.length > 0 && `(${photos.length})`}
        </span>
        {photos.length < MAX_PHOTOS && (
          <button
            onClick={() => setShowUploadForm(true)}
            className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-[11px] font-bold hover:bg-primary/20 transition-[background-color,transform] active:scale-[0.96] hit-padding"
          >
            <Plus className="w-3 h-3" strokeWidth={3} />
            Agregar
          </button>
        )}
      </div>

      {showUploadForm && (
        <PhotoUpload
          tareaId={tareaId}
          onSave={handleSave}
          onCancel={() => setShowUploadForm(false)}
          isSaving={isSaving}
        />
      )}

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mt-2">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative group rounded-2xl overflow-hidden bg-on-surface/5 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300"
              onClick={() => openViewer(index)}
            >
              <img
                src={photo.url}
                alt={photo.descripcion || "Foto de tarea"}
                className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {photo.descripcion && (
                <p className="px-2 py-1 text-[10px] font-medium text-on-surface-variant/60 truncate">
                  {photo.descripcion}
                </p>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(photo.id);
                }}
                className="absolute top-1 right-1 p-1.5 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        !showUploadForm && (
          <div className="py-6 text-center border border-dashed border-outline-variant/20 rounded-xl">
            <ImageIcon className="w-8 h-8 mx-auto text-on-surface-variant/20" />
            <p className="text-xs font-medium text-on-surface-variant/30 mt-2">
              Sin fotos aún
            </p>
          </div>
        )
      )}

      {photos.length >= MAX_PHOTOS && !showUploadForm && (
        <p className="text-[10px] font-medium text-on-surface-variant/40 text-center">
          Límite máximo de fotos alcanzado
        </p>
      )}

      {viewerPhotoIndex !== null && typeof window !== "undefined" && createPortal(
        <div
          ref={viewerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Visor de fotos"
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={closeViewer}
        >
          <button
            onClick={closeViewer}
            aria-label="Cerrar visor de fotos"
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {viewerPhotoIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Foto anterior"
              className="absolute left-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
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
              aria-label="Foto siguiente"
              className="absolute right-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
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

      <ConfirmDialog />
    </div>
  );
}
