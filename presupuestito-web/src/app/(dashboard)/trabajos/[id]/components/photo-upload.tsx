"use client";

import { useState, useRef } from "react";
import { X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  tareaId: string;
  onSave: (photo: { tareaId: string; file: File; descripcion: string; orden: number }) => Promise<void> | void;
  onCancel: () => void;
  isSaving?: boolean;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export function PhotoUpload({ tareaId, onSave, onCancel, isSaving = false }: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError("Solo se permiten archivos jpg, png o webp");
      return;
    }

    const extension = selected.name.toLowerCase().match(/\.[^.]+$/)?.[0];
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      setError("Extensión de archivo no válida");
      return;
    }

    if (selected.size > MAX_SIZE) {
      setError("La imagen no puede superar 5MB");
      return;
    }

    setError(null);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSave = async () => {
    if (!file || isSaving) return;
    try {
      await onSave({
        tareaId,
        file: file,
        descripcion,
        orden: 0,
      });
      onCancel();
    } catch {
      // error handled by parent
    }
  };

  return (
    <div className="bg-surface rounded-2xl p-4 border border-primary/20 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          Agregar foto
        </span>
        <button
          onClick={onCancel}
          className="p-1 rounded-lg hover:bg-on-surface/5 text-on-surface-variant/40 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!preview ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-8 border-2 border-dashed border-outline-variant/20 rounded-xl flex flex-col items-center gap-2 hover:border-primary/40 transition-colors"
        >
          <Camera className="w-8 h-8 text-on-surface-variant/30" />
          <span className="text-xs font-medium text-on-surface-variant/40">
            Seleccionar imagen
          </span>
        </button>
      ) : (
        <div className="space-y-3">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-xl"
          />
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción de la foto..."
            rows={2}
            maxLength={500}
            className="w-full bg-on-surface/5 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/25 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-colors resize-none"
          />
        </div>
      )}

      {error && (
        <p className="text-xs font-medium text-red-500">{error}</p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="flex-1 py-2.5 rounded-xl bg-on-surface/5 text-on-surface font-black text-[10px] uppercase tracking-widest hover:bg-on-surface/10 transition-colors transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!file || isSaving}
          className={cn(
            "flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors transition-transform active:scale-95 flex items-center justify-center gap-2",
            file
              ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
              : "bg-on-surface/10 text-on-surface-variant/30 cursor-not-allowed",
            isSaving && "opacity-70 cursor-not-allowed"
          )}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar"
          )}
        </button>
      </div>
    </div>
  );
}
