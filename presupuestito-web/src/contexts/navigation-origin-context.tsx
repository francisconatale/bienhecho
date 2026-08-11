"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type NavigationOrigin = {
  section: "clientes";
  clienteId: string;
};

type NavigationOriginContextValue = {
  origin: NavigationOrigin | null;
  setOrigin: (origin: NavigationOrigin) => void;
  clearOrigin: () => void;
};

const NavigationOriginContext = createContext<NavigationOriginContextValue | undefined>(undefined);

export function NavigationOriginProvider({ children }: { children: ReactNode }) {
  const [origin, setOrigin] = useState<NavigationOrigin | null>(null);

  const clearOrigin = useCallback(() => setOrigin(null), []);

  return (
    <NavigationOriginContext.Provider value={{ origin, setOrigin, clearOrigin }}>
      {children}
    </NavigationOriginContext.Provider>
  );
}

export function useNavigationOrigin() {
  const ctx = useContext(NavigationOriginContext);
  if (!ctx) throw new Error("useNavigationOrigin debe usarse dentro de NavigationOriginProvider");
  return ctx;
}
