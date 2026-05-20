"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Concept, useBudgetStore } from "../hooks/use-budget";
import { useEffect } from "react";
import { Tag, AlignLeft, Check } from "lucide-react";

const conceptSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  amount: z.string().min(1, "El precio es requerido")
    .regex(/^[0-9]+([.,][0-9]{1,2})?$/, "Formato numérico inválido (Ej: 150,00)"),
});

type ConceptFormValues = z.infer<typeof conceptSchema>;

interface ConceptFormProps {
  initialData?: Concept | null;
  onSubmit: (data: Omit<Concept, "id">) => void;
  onCancel: () => void;
}

export function ConceptForm({ initialData, onSubmit, onCancel }: ConceptFormProps) {
  const { currency } = useBudgetStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ConceptFormValues>({
    resolver: zodResolver(conceptSchema),
    defaultValues: {
      name: "",
      description: "",
      amount: "",
    },
    mode: "onChange"
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        amount: initialData.amount,
      });
    } else {
      reset({
        name: "",
        description: "",
        amount: "",
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: ConceptFormValues) => {
    // Reemplazar punto por coma para estandarizar en BD/Estado
    let formattedAmount = data.amount.trim().replace(".", ",");

    onSubmit({
      name: data.name,
      description: data.description || "",
      amount: formattedAmount,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="space-y-4">
        
        {/* Campo Nombre */}
        <div className="group">
          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">
            Concepto o Servicio
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-blue-500 transition-colors">
              <Tag className="w-4 h-4" strokeWidth={2} />
            </div>
            <input
              {...register("name")}
              type="text"
              placeholder="Ej: Desarrollo Frontend"
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0A0A0A] border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 text-on-surface font-medium transition-all shadow-sm"
            />
          </div>
          {errors.name && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.name.message}</p>}
        </div>

        {/* Campo Descripción */}
        <div className="group">
          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">
            Detalles (Opcional)
          </label>
          <div className="relative">
            <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-on-surface-variant group-focus-within:text-blue-500 transition-colors">
              <AlignLeft className="w-4 h-4" strokeWidth={2} />
            </div>
            <textarea
              {...register("description")}
              placeholder="Describe lo que incluye este concepto..."
              rows={2}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0A0A0A] border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 text-on-surface resize-none transition-all shadow-sm"
            />
          </div>
          {errors.description && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.description.message}</p>}
        </div>

        {/* Campo Precio */}
        <div className="group pt-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">
            Valor Monetario
          </label>
          <div className="relative flex items-center">
            <span className={`absolute left-4 font-medium text-on-surface-variant pointer-events-none select-none ${currency.length > 1 ? 'text-lg' : 'text-xl'}`}>
              {currency}
            </span>
            <input
              {...register("amount")}
              type="text"
              placeholder="0,00"
              className={`w-full ${currency.length > 1 ? 'pl-16' : 'pl-9'} pr-4 py-4 bg-white dark:bg-[#0A0A0A] border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 text-on-surface text-2xl font-bold tracking-tight transition-all placeholder:font-normal shadow-sm`}
            />
          </div>
          {errors.amount && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.amount.message}</p>}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="pt-4 flex items-center gap-3 border-t border-outline-variant/10 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3.5 rounded-xl font-semibold text-on-surface-variant hover:text-on-surface hover:bg-outline-variant/10 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm shadow-blue-500/20"
        >
          <Check className="w-5 h-5" strokeWidth={2.5} />
          <span>{initialData ? "Guardar Cambios" : "Agregar Concepto"}</span>
        </button>
      </div>
    </form>
  );
}
