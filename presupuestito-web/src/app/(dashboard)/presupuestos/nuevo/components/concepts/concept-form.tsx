"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Concept, useBudgetStore } from "../../hooks/use-budget";
import { useUserStore } from "@/lib/user-store";
import { TRADES } from "@/lib/trades";
import { useEffect, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";


const conceptSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  quantity: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
  unit: z.enum(["un.", "hs.", "m2", "m3", "ml", "kg", "gl"]),
  price: z.string().min(1, "El precio es requerido")
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
  const { user } = useUserStore();
  const [showSuggestions, setShowSuggestions] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ConceptFormValues>({
    resolver: zodResolver(conceptSchema),
    defaultValues: {
      name: "",
      description: "",
      quantity: 1,
      unit: "un.",
      price: "",
    },
    mode: "onChange"
  });

  const watchedQuantity = watch("quantity");
  const watchedPrice = watch("price");

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        quantity: initialData.quantity,
        unit: initialData.unit,
        price: initialData.price,
      });
    }
  }, [initialData, reset]);

  const parseAmount = (amountStr: string) => {
    if (!amountStr) return 0;
    const cleanStr = amountStr.replace(/\./g, "").replace(",", ".");
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  const formatAmount = (num: number) => {
    return num.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const totalCalculated = parseAmount(watchedPrice) * watchedQuantity;

  const handleFormSubmit = (data: ConceptFormValues) => {
    let formattedPrice = data.price.trim().replace(".", ",");
    let formattedTotal = formatAmount(totalCalculated);

    onSubmit({
      name: data.name,
      description: data.description || "",
      quantity: data.quantity,
      unit: data.unit,
      price: formattedPrice,
      amount: formattedTotal,
    });
  };

  // Sugerencias basadas en el rubro
  const userTrade = TRADES.find(t => t.id === user?.tradeId);
  const itemSuggestions = userTrade?.suggestions || [];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 rounded-[24px] p-5 shadow-lg shadow-black/5">
        
        {/* Título / Concepto */}
        <div className="mb-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-1 mb-1.5 block">
            Detalle del Concepto
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="¿Qué estamos cobrando?"
            className="w-full bg-surface dark:bg-zinc-900 border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-on-surface-variant/20"
          />
          {errors.name && <p className="text-[9px] font-bold text-error mt-1 ml-1">{errors.name.message}</p>}
        </div>

        {/* Sugerencias de ítems */}
        {itemSuggestions.length > 0 && showSuggestions && !initialData && (
          <div className="mb-5 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-2 px-1">
              <Sparkles className="w-3 h-3 text-[#2563EB]/40" />
              <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">
                Ítems frecuentes de {userTrade?.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {itemSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setValue("name", suggestion, { shouldValidate: true });
                    setShowSuggestions(false); // Ocultar tras elegir para limpiar UI
                  }}
                  className="px-3 py-1.5 bg-surface-variant/10 hover:bg-[#2563EB]/5 border border-outline-variant/10 hover:border-[#2563EB]/20 rounded-lg text-[10px] font-bold text-on-surface-variant hover:text-[#2563EB] transition-all active:scale-95"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cantidad y Unidad */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-1 mb-1.5 block">
              Cantidad
            </label>
            <input
              {...register("quantity", { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full px-4 py-2.5 bg-surface dark:bg-zinc-900 border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-[14px] font-black tabular-nums transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-1 mb-1.5 block">
              Unidad
            </label>
            <div className="relative">
              <select
                {...register("unit")}
                className="w-full px-4 py-2.5 bg-surface dark:bg-zinc-900 border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-[14px] font-bold appearance-none text-on-surface transition-all cursor-pointer"
              >
                <option value="un.">un.</option>
                <option value="hs.">hs.</option>
                <option value="m2">m²</option>
                <option value="m3">m³</option>
                <option value="ml">ml</option>
                <option value="kg">kg</option>
                <option value="gl">gl.</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Precio Unitario */}
        <div className="mb-5">
          <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-1 mb-1.5 block">
            Precio Unitario
          </label>
          <div className="relative">
            <input
              {...register("price")}
              type="text"
              placeholder="0,00"
              className="w-full pl-10 pr-4 py-3 bg-surface dark:bg-zinc-900 border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-[16px] font-black text-right tabular-nums transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-black text-primary">{currency}</span>
          </div>
          {errors.price && <p className="text-[9px] font-bold text-error mt-1 ml-1">{errors.price.message}</p>}
        </div>

        {/* Cuadro de Total Dinámico */}
        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 mb-5 flex justify-between items-center border border-primary/10 transition-colors">
          <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Total Item</span>
          <div className="text-right">
            <span className="block font-black text-xl text-primary tracking-tighter leading-none tabular-nums">
              {formatAmount(totalCalculated)}
            </span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-outline-variant text-[11px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="flex-1 py-3 px-4 rounded-xl bg-primary text-on-primary text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-20 active:scale-95 transition-all"
          >
            {initialData ? "Guardar" : "Añadir"}
          </button>
        </div>
      </div>
    </form>
  );
}
