interface Props {
  presupuesto: string;
  setPresupuesto: (val: string) => void;
}

export function StepPresupuesto({ presupuesto, setPresupuesto }: Props) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-on-surface-variant/40 pointer-events-none">
        $
      </span>
      <input
        type="number"
        value={presupuesto}
        onChange={(e) => setPresupuesto(e.target.value)}
        placeholder="0"
        min={0}
        className="input-field pl-8"
        autoFocus
      />
    </div>
  );
}
