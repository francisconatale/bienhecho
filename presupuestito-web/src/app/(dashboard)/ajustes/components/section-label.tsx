export function SectionLabel({ label }: { label: string }) {
  return (
    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-2 mb-3">
      {label}
    </h3>
  );
}
