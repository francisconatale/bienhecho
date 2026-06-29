interface Props {
  direccion: string;
  setDireccion: (val: string) => void;
}

export function StepDireccion({ direccion, setDireccion }: Props) {
  return (
    <input
      type="text"
      value={direccion}
      onChange={(e) => setDireccion(e.target.value)}
      placeholder="Av. Corrientes 1234"
      className="input-field"
      autoFocus
    />
  );
}
