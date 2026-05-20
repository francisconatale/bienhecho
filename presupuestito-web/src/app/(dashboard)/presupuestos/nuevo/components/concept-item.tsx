interface ConceptItemProps {
  name: string;
  description: string;
  amount: string;
}

export function ConceptItem({ name, description, amount }: ConceptItemProps) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 border-b border-outline-variant/10 last:border-0">
      <div className="flex justify-between w-full">
        <span className="font-semibold text-on-surface">{name}</span>
        <span className="font-semibold text-on-surface">{amount}</span>
      </div>
      <span className="text-xs text-on-surface-variant">{description}</span>
    </div>
  );
}
