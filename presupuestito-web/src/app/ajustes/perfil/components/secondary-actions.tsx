import { ActionRow } from "./action-row";

export function SecondaryActions() {
  return (
    <section>
      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <ActionRow label="Cambiar Contraseña" />
        <ActionRow label="Preferencias de Notificación" />
      </div>
    </section>
  );
}
