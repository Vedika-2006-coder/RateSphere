import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ROLE_HOME, type Role } from "@/services/types";

/**
 * Client-side route protection. This is a UX guard only — every API route is
 * independently authenticated and authorised on the Express backend.
 */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user, status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "anonymous") {
      void navigate({ to: "/login", replace: true });
    }
  }, [status, navigate]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        <span className="text-sm">Restoring your session…</span>
      </div>
    );
  }

  if (status === "anonymous" || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Redirecting to sign in…
      </div>
    );
  }

  if (user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="surface-card max-w-md p-8 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="size-5" aria-hidden />
          </span>
          <h1 className="font-display mt-4 text-lg font-semibold">This area isn't available to you</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account doesn't have permission to view this page.
          </p>
          <Button asChild className="mt-5">
            <Link to={ROLE_HOME[user.role]}>Go to my dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
