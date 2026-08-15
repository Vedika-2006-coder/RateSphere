import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { AuthAside } from "@/components/AuthAside";
import { Field } from "@/components/FormField";
import { Logo } from "@/components/Logo";
import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { loginFormSchema, type LoginFormValues } from "@/schemas/validation";
import { ApiError } from "@/services/apiClient";
import { ROLE_HOME } from "@/services/types";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Log in — RateSphere" },
      {
        name: "description",
        content:
          "Sign in to RateSphere to browse stores, submit ratings or manage your store's reputation.",
      },
      { property: "og:title", content: "Log in — RateSphere" },
      { property: "og:description", content: "One secure sign-in for every RateSphere role." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, user, status } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  // Already signed in? Send the user to their role home.
  useEffect(() => {
    if (status === "authenticated" && user) {
      void navigate({ to: ROLE_HOME[user.role], replace: true });
    }
  }, [status, user, navigate]);

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);
    try {
      // The role is resolved by the backend from the database — never chosen here.
      const authenticated = await login(values.email, values.password);
      await navigate({ to: ROLE_HOME[authenticated.role], replace: true });
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : "Unable to sign in. Please try again.",
      );
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-4 py-8 sm:px-8 lg:px-14">
        <Link to="/" aria-label="RateSphere home" className="w-fit rounded-md">
          <Logo />
        </Link>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue to your RateSphere workspace.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
            {formError ? (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/8 p-3 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{formError}</span>
              </div>
            ) : null}

            <Field id="email" label="Email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
            </Field>

            <Field id="password" label="Password" error={errors.password?.message}>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                placeholder="Your password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                {...register("password")}
              />
            </Field>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden /> Signing in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="size-4" aria-hidden />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            New to RateSphere?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <AuthAside
        heading="One login. Three roles."
        body="Shoppers, store owners and administrators all sign in here. Your permissions are determined by your account — there's nothing to choose."
      />
    </div>
  );
}
