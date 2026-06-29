"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[30px] w-[52px] shrink-0 cursor-pointer rounded-full transition-all duration-300 ease-in-out focus:outline-none border ${
        checked ? "bg-primary border-transparent shadow-[0_0_12px_rgba(74,140,127,0.4)]" : "bg-surface-variant/30 border-outline-variant/20"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] ring-0 transition-all duration-300 ease-in-out mt-[2px] ml-[2px] ${
          checked ? "translate-x-[22px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}
