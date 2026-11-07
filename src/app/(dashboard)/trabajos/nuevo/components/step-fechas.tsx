interface Props {
  fechaInicio: string;
  setFechaInicio: (val: string) => void;
  fechaFinEstimada: string;
  setFechaFinEstimada: (val: string) => void;
}

export function StepFechas({ fechaInicio, setFechaInicio, fechaFinEstimada, setFechaFinEstimada }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-[11px] font-bold text-on-surface-variant/40 mb-1.5 block">
          Fecha de inicio
        </label>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="input-field"
          autoFocus
        />
      </div>
      <div>
        <label className="text-[11px] font-bold text-on-surface-variant/40 mb-1.5 block">
          Fecha fin estimada
        </label>
        <input
          type="date"
          value={fechaFinEstimada}
          onChange={(e) => setFechaFinEstimada(e.target.value)}
          className="input-field"
        />
      </div>
    </div>
  );
}
