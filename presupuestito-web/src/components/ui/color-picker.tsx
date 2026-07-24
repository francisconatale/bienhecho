"use client";

import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ color, onChange, className = "" }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-9 h-9 rounded-lg border border-outline-variant/20 cursor-pointer overflow-hidden p-0.5 ${className}`}
        aria-label="Seleccionar color"
      >
        <div
          className="w-full h-full rounded-md"
          style={{ backgroundColor: color }}
        />
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 z-50 shadow-xl rounded-xl overflow-hidden border border-outline-variant/20 bg-surface p-3 animate-in fade-in zoom-in-95 duration-200">
          <HexColorPicker color={color} onChange={onChange} />
          
          <div className="mt-3 flex gap-2">
            <span className="text-xs font-semibold text-on-surface-variant my-auto uppercase">Hex</span>
            <input
              type="text"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 w-full bg-on-surface/5 border border-outline-variant/20 rounded-md px-2 py-1 text-sm text-on-surface font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
}
