import { Check, ShoppingCart } from "lucide-react";
import { useShoppingList } from "../hooks/use-shopping-list";

export function ShoppingList() {
  const { pendingMaterials, toggleMaterial } = useShoppingList();

  if (pendingMaterials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-surface/30 rounded-xl border border-outline-variant/10 backdrop-blur-xl">
        <ShoppingCart className="w-12 h-12 text-on-surface-variant/30 mb-4" />
        <h3 className="text-lg font-semibold text-on-surface">
          Nada que comprar
        </h3>
        <p className="text-on-surface-variant text-sm mt-1">
          No hay materiales pendientes en tus trabajos activos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pendingMaterials.map((item) => (
        <div
          key={item.id}
          className="group relative flex items-start gap-4 p-4 rounded-2xl bg-surface/30 hover:bg-surface/50 border border-outline-variant/10 backdrop-blur-xl transition-all cursor-pointer active:scale-[0.98]"
          onClick={() => toggleMaterial(item.id, item.comprado)}
        >
          <div className="pt-0.5">
            <button
              className="w-6 h-6 rounded-full border-2 border-outline flex items-center justify-center transition-colors group-hover:border-primary"
            >
              <Check className="w-4 h-4 opacity-0 transition-opacity" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-on-surface line-clamp-1">
              {item.nombre_material}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-on-surface-variant truncate">
                {item.cantidad} unid. • {item.client?.nombre || item.job?.titulo}
              </span>
            </div>
          </div>
          <div className="text-right whitespace-nowrap">
            <span className="text-sm font-semibold text-on-surface">
              ${item.subtotal.toLocaleString("es-AR")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
