interface Props {
  titulo: string;
  setTitulo: (val: string) => void;
  descripcion: string;
  setDescripcion: (val: string) => void;
}

export function StepTitulo({ titulo, setTitulo, descripcion, setDescripcion }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="titulo-trabajo" className="text-xs font-bold text-on-surface-variant/60 mb-1.5 block">Nombre del trabajo</label>
        <input
          type="text"
          id="titulo-trabajo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej: Reforma integral de cocina"
          className="input-field"
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="descripcion-trabajo" className="text-xs font-bold text-on-surface-variant/60 mb-1.5 block">Descripción</label>
        <textarea
          id="descripcion-trabajo"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Contá un poco de qué se trata (opcional)..."
          rows={2}
          className="input-field resize-none"
        />
      </div>
    </div>
  );
}
