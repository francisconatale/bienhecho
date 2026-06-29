"use client";

import { useTheme } from "./theme-provider";
import { Toaster as Sonner } from "sonner";
import { useEffect, useState } from "react";

export function Toaster() {
  const { darkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Sonner
      theme={darkMode ? "dark" : "light"}
      position="top-center"
      richColors
    />
  );
}
