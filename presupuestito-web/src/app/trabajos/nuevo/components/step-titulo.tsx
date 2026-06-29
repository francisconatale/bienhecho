interface Props {
  titulo: string;
  setTitulo: (val: string) => void;
  descripcion: string;
  setDescripcion: (val: string) => void;
}

export function StepTitulo({ titulo, setTitulo, descripcion, setDescripcion }: Props) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Ej: Reforma integral de cocina"
        className="input-field"
        autoFocus
      />
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Contá un poco de qué se trata (opcional)..."
        rows={2}
        className="input-field resize-none"
      />
    </div>
  );
}
