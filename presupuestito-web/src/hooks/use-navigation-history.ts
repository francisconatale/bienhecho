import { useCallback } from "react";

const STORAGE_KEY = "nav_stack";

export function useNavigationHistory() {
  const getStack = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const pushHistory = useCallback((url: string) => {
    if (typeof window === "undefined") return;
    const stack = getStack();
    stack.push(url);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stack));
  }, []);

  const popHistory = useCallback((fallbackUrl: string): string => {
    if (typeof window === "undefined") return fallbackUrl;
    const stack = getStack();
    const popped = stack.pop();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stack));
    
    if (!popped) return fallbackUrl;

    // Append ?dir=back or &dir=back to the popped URL if not present
    // so we get the back animation.
    try {
      const urlObj = new URL(popped, window.location.origin);
      urlObj.searchParams.set("dir", "back");
      return urlObj.pathname + urlObj.search;
    } catch {
      return popped;
    }
  }, []);

  const clearHistory = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return { pushHistory, popHistory, clearHistory };
}
