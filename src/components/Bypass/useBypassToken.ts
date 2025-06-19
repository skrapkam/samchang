export const BYPASS_TOKEN_STORAGE_KEY = "bypassToken";

/**
 * Return the current bypass token from localStorage, or undefined if not present.
 */
export function getBypassToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const t = localStorage.getItem(BYPASS_TOKEN_STORAGE_KEY);
    return t || undefined;
  } catch {
    // LocalStorage might be unavailable (SSR or privacy mode)
    return undefined;
  }
}

/**
 * Persist a bypass token to localStorage. Passing `undefined` will remove it.
 */
export function setBypassToken(token: string | undefined) {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(BYPASS_TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(BYPASS_TOKEN_STORAGE_KEY);
    }
  } catch {
    /* ignore */
  }
}

import { useState, useEffect } from "react";

/**
 * React hook that returns the current bypass token and provides a setter.
 */
export function useBypassToken(): [string | undefined, (t: string | undefined) => void] {
  const [token, setTokenState] = useState<string | undefined>(() => getBypassToken());

  const setToken = (t: string | undefined) => {
    setTokenState(t);
    setBypassToken(t);
  };

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === BYPASS_TOKEN_STORAGE_KEY) {
        setTokenState(e.newValue || undefined);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    }
  }, []);

  return [token, setToken];
} 