export interface FormFieldProps {
  label: string;
  id: string;
  type: string;
  defaultValue?: string;
  placeholder?: string;
}

export function FormField({ label, id, type, defaultValue, placeholder }: FormFieldProps) {
  return (
    <div className="flex items-center px-4 py-3 min-h-[44px] border-b border-outline-variant/10 last:border-0 bg-surface">
      <label
        htmlFor={id}
        className="w-24 font-medium text-on-surface-variant text-sm shrink-0"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-0 p-0 text-on-surface placeholder-on-surface-variant/40 focus:ring-0 text-sm"
      />
    </div>
  );
}
