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

  const userTrade = TRADES.find(t => t.id === user?.tradeId);
  const itemSuggestions = userTrade?.suggestions || [];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label className="text-xs font-medium text-on-surface-variant mb-1.5 block">Nombre</label>
        <input
          {...register("name")}
          type="text"
          placeholder="¿Qué estamos cobrando?"
          className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-on-surface-variant/40"
        />
        {errors.name && <p className="text-[10px] text-error mt-1">{errors.name.message}</p>}
      </div>

      {/* Suggestions */}
      {itemSuggestions.length > 0 && showSuggestions && !initialData && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3 h-3 text-primary/40" />
            <span className="text-[10px] text-on-surface-variant/60">Ítems frecuentes de {userTrade?.label}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {itemSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setValue("name", suggestion, { shouldValidate: true });
                  setShowSuggestions(false);
                }}
                className="px-3 py-1.5 bg-surface-variant/10 hover:bg-primary/5 border border-outline-variant/20 hover:border-primary/20 rounded-lg text-[10px] font-medium text-on-surface-variant hover:text-primary transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Unit */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-on-surface-variant mb-1.5 block">Cantidad</label>
          <input
            {...register("quantity", { valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/20 rounded-lg text-sm font-medium text-on-surface tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-on-surface-variant mb-1.5 block">Unidad</label>
          <div className="relative">
            <select
              {...register("unit")}
              className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/20 rounded-lg text-sm font-medium text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
            >
              <option value="un.">un.</option>
              <option value="hs.">hs.</option>
              <option value="m2">m²</option>
              <option value="m3">m³</option>
              <option value="ml">ml</option>
              <option value="kg">kg</option>
              <option value="gl">gl.</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="text-xs font-medium text-on-surface-variant mb-1.5 block">Precio Unitario</label>
        <div className="relative">
          <input
            {...register("price")}
            type="text"
            placeholder="0,00"
            className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/20 rounded-lg text-sm font-medium text-on-surface text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-on-surface-variant/60">{currency}</span>
        </div>
        {errors.price && <p className="text-[10px] text-error mt-1">{errors.price.message}</p>}
      </div>

      {/* Total */}
      <div className="bg-primary/5 rounded-lg p-3 flex justify-between items-center border border-primary/10">
        <span className="text-xs font-medium text-primary/60">Total Item</span>
        <span className="text-sm font-semibold tabular-nums text-primary">{formatAmount(totalCalculated)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 px-4 rounded-lg border border-outline-variant text-xs font-medium text-on-surface-variant hover:bg-surface-variant/10 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="flex-1 py-2.5 px-4 rounded-lg bg-primary text-on-primary text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-30"
        >
          {initialData ? "Guardar" : "Añadir"}
        </button>
      </div>
    </form>
  );
}
