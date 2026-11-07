interface Props {
  direccion: string;
  setDireccion: (val: string) => void;
}

export function StepDireccion({ direccion, setDireccion }: Props) {
  return (
    <>
      <label htmlFor="direccion-trabajo" className="text-xs font-bold text-on-surface-variant/60 mb-1.5 block">Dirección del trabajo</label>
      <input
        type="text"
        id="direccion-trabajo"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        placeholder="Av. Corrientes 1234"
        className="input-field"
        autoFocus
      />
    </>
  );
}
