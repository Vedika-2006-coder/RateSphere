import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { ApiError, getToken, setToken } from "@/services/apiClient";
import { authService } from "@/services";
import type { AuthUser } from "@/services/types";

type AuthState = {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "anonymous";
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthState["status"]>("loading");

  // Session hydration happens after mount so SSR never touches localStorage.
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      if (!getToken()) {
        if (!cancelled) setStatus("anonymous");
        return;
      }
      try {
        const response = await authService.me();
        if (cancelled) return;
        setUser(response.data);
        setStatus("authenticated");
      } catch (error) {
        if (cancelled) return;
        // A network failure keeps the token; an auth failure clears it.
        if (error instanceof ApiError && !error.isNetworkError) setToken(null);
        setStatus("anonymous");
      }
    }
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setToken(response.data.token);
    setUser(response.data.user);
    setStatus("authenticated");
    return response.data.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setStatus("anonymous");
  }, []);

  const refresh = useCallback(async () => {
    if (!getToken()) return;
    const response = await authService.me();
    setUser(response.data);
    setStatus("authenticated");
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, status, login, logout, refresh }),
    [user, status, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
