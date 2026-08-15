import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Circle, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthAside } from "@/components/AuthAside";
import { Field } from "@/components/FormField";
import { Logo } from "@/components/Logo";
import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { passwordChecks, signupFormSchema, type SignupFormValues } from "@/schemas/validation";
import { ApiError } from "@/services/apiClient";
import { authService } from "@/services";

export const Route = createFileRoute("/signup")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Create your account — RateSphere" },
      {
        name: "description",
        content:
          "Create a free RateSphere shopper account to discover registered stores and submit honest 1–5 star ratings.",
      },
      { property: "og:title", content: "Create your account — RateSphere" },
      {
        property: "og:description",
        content: "Join RateSphere to discover stores and share honest ratings.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: { name: "", email: "", address: "", password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password") ?? "";
  const nameValue = watch("name") ?? "";
  const addressValue = watch("address") ?? "";

  async function onSubmit(values: SignupFormValues) {
    setFormError(null);
    try {
      // Public registration always creates a Normal User on the backend.
      await authService.register(values);
      setSuccess(true);
      toast.success("Account created", { description: "You can now sign in to RateSphere." });
      window.setTimeout(() => void navigate({ to: "/login" }), 1600);
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : "Unable to create your account right now.",
      );
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <div className="surface-card max-w-md p-10 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/12 text-success">
            <CheckCircle2 className="size-7" aria-hidden />
          </span>
          <h1 className="font-display mt-5 text-2xl font-semibold">You're all set</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your RateSphere account has been created. Taking you to the sign-in page…
          </p>
          <Button asChild className="mt-6">
            <Link to="/login">Go to sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-4 py-8 sm:px-8 lg:px-14">
        <Link to="/" aria-label="RateSphere home" className="w-fit rounded-md">
          <Logo />
        </Link>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-3xl font-semibold">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Shopper accounts are free. Store owner and administrator access is provisioned by an
            administrator.
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

            <Field
              id="name"
              label="Full name"
              error={errors.name?.message}
              hint={`Between 20 and 60 characters (${nameValue.trim().length}/60).`}
            >
              <Input
                id="name"
                autoComplete="name"
                placeholder="Your full legal name"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
            </Field>

            <Field id="email" label="Email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
            </Field>

            <Field
              id="address"
              label="Address"
              error={errors.address?.message}
              hint={`Up to 400 characters (${addressValue.trim().length}/400).`}
            >
              <Textarea
                id="address"
                rows={3}
                autoComplete="street-address"
                placeholder="Street, area, city and postcode"
                aria-invalid={Boolean(errors.address)}
                {...register("address")}
              />
            </Field>

            <Field id="password" label="Password" error={errors.password?.message}>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              <ul className="mt-2 space-y-1">
                {passwordChecks(passwordValue).map((check) => (
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
                    <span className="sr-only">{check.passed ? " — met" : " — not met"}</span>
                  </li>
                ))}
              </ul>
            </Field>

            <Field id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmPassword)}
                {...register("confirmPassword")}
              />
            </Field>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden /> Creating account…
                </>
              ) : (
                <>
                  <UserPlus className="size-4" aria-hidden /> Create account
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <AuthAside
        heading="Your rating, your voice"
        body="Every shopper gets one rating per store — and can revise it at any time. That keeps store averages meaningful instead of noisy."
      />
    </div>
  );
}
