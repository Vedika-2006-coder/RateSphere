import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Circle, KeyRound, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Field } from "@/components/FormField";
import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  changePasswordFormSchema,
  passwordChecks,
  type ChangePasswordFormValues,
} from "@/schemas/validation";
import { ApiError } from "@/services/apiClient";
import { authService } from "@/services";
import { ROLE_LABELS } from "@/services/types";

export const Route = createFileRoute("/account/password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Change password — RateSphere" },
      { name: "description", content: "Update the password for your RateSphere account." },
      { property: "og:title", content: "Change password — RateSphere" },
      { property: "og:description", content: "Keep your RateSphere account secure." },
    ],
  }),
  component: ChangePasswordPage,
});

/** Shared by all three roles — the backend verifies the current password. */
function ChangePasswordPage() {
  const { user, status } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const newPassword = watch("newPassword") ?? "";

  useEffect(() => {
    if (status === "anonymous" && typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, [status]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" aria-hidden /> Loading…
      </div>
    );
  }

  async function onSubmit(values: ChangePasswordFormValues) {
    setFormError(null);
    setSaved(false);
    try {
      await authService.changePassword(values);
      setSaved(true);
      reset();
      toast.success("Password updated");
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : "Could not update your password right now.",
      );
    }
  }

  return (
    <AppShell
      title="Change password"
      description={`Signed in as ${user.email} · ${ROLE_LABELS[user.role]}`}
    >
      <div className="surface-card max-w-xl p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <KeyRound className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold">Update your password</h2>
            <p className="text-sm text-muted-foreground">
              You'll need your current password to make this change.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
          {formError ? (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/8 p-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{formError}</span>
            </div>
          ) : null}

          {saved ? (
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-lg border border-success/30 bg-success/8 p-3 text-sm text-success"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>Your password has been updated.</span>
            </div>
          ) : null}

          <Field id="currentPassword" label="Current password" error={errors.currentPassword?.message}>
            <PasswordInput
              id="currentPassword"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.currentPassword)}
              {...register("currentPassword")}
            />
          </Field>

          <Field id="newPassword" label="New password" error={errors.newPassword?.message}>
            <PasswordInput
              id="newPassword"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.newPassword)}
              {...register("newPassword")}
            />
            <ul className="mt-2 space-y-1">
              {passwordChecks(newPassword).map((check) => (
                <li
                  key={check.label}
                  className={
                    check.passed
                      ? "flex items-center gap-1.5 text-xs text-success"
                      : "flex items-center gap-1.5 text-xs text-muted-foreground"
                  }
                >
                  {check.passed ? (
                    <CheckCircle2 className="size-3.5" aria-hidden />
                  ) : (
                    <Circle className="size-3.5" aria-hidden />
                  )}
                  {check.label}
                </li>
              ))}
            </ul>
          </Field>

          <Field id="confirmPassword" label="Confirm new password" error={errors.confirmPassword?.message}>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register("confirmPassword")}
            />
          </Field>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden /> Updating…
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
