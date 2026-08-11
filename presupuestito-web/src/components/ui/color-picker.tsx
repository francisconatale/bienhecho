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
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => setIsOpen(false);

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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Seleccionar color"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`w-9 h-9 rounded-lg border border-outline-variant/20 cursor-pointer overflow-hidden p-0.5 transition-[transform,border-color] duration-200 ease-spring active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-primary/40 hit-padding ${className}`}
      >
        <div
          className="w-full h-full rounded-md"
          style={{ backgroundColor: color }}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-12 md:bottom-auto md:top-12 right-0 sm:left-0 sm:right-auto z-50 shadow-xl rounded-xl overflow-hidden border border-outline-variant/20 bg-surface p-3">
          <HexColorPicker color={color} onChange={onChange} />

          <div className="mt-3 flex gap-2">
            <label htmlFor="color-picker-hex" className="text-xs font-semibold text-on-surface-variant my-auto uppercase cursor-default select-none">
              Hex
            </label>
            <input
              id="color-picker-hex"
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
