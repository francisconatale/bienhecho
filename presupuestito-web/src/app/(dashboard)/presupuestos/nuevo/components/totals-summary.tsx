interface TotalsSummaryProps {
  subtotal: string;
  ivaRate: number;
  iva: string;
  total: string;
}

export function TotalsSummary({ subtotal, ivaRate, iva, total }: TotalsSummaryProps) {
  return (
    <section>
      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="flex justify-between px-4 py-3 border-b border-outline-variant/10">
          <span className="text-on-surface">Subtotal</span>
          <span className="text-on-surface font-medium">{subtotal}</span>
        </div>
        <div className="flex justify-between px-4 py-3 border-b border-outline-variant/10">
          <span className="text-on-surface">IVA ({ivaRate}%)</span>
          <span className="text-on-surface font-medium">{iva}</span>
        </div>
        <div className="flex justify-between px-4 py-4">
          <span className="font-bold text-lg text-on-surface">Total</span>
          <span className="font-bold text-lg text-primary">{total}</span>
        </div>
      </div>
    </section>
  );
}
