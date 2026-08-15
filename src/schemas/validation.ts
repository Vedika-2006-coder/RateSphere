import { z } from "zod";

/** Mirrors backend/src/validators/schemas.js — the backend remains authoritative. */

export const PASSWORD_MESSAGE =
  "Password must be 8–16 characters and contain at least one uppercase letter and one special character.";

export const ROLE_OPTIONS = [
  { value: "normal_user", label: "Normal User" },
  { value: "store_owner", label: "Store Owner" },
  { value: "administrator", label: "Administrator" },
] as const;

export const nameSchema = z
  .string()
  .trim()
  .min(20, "Name must be at least 20 characters.")
  .max(60, "Name must be at most 60 characters.");

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Enter a valid email address.");

export const addressSchema = z
  .string()
  .trim()
  .min(1, "Address is required.")
  .max(400, "Address must be at most 400 characters.");

export const passwordSchema = z
  .string()
  .min(8, PASSWORD_MESSAGE)
  .max(16, PASSWORD_MESSAGE)
  .regex(/[A-Z]/, PASSWORD_MESSAGE)
  .regex(/[^A-Za-z0-9]/, PASSWORD_MESSAGE);

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

export const signupFormSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    address: addressSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const createUserFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: z.enum(["administrator", "normal_user", "store_owner"]),
});

export const createStoreFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Store name must be at least 2 characters.")
    .max(120, "Store name must be at most 120 characters."),
  email: emailSchema,
  address: addressSchema,
  ownerId: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;
export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;
export type CreateStoreFormValues = z.infer<typeof createStoreFormSchema>;

/** Password requirement checklist used by the signup / change-password UI. */
export function passwordChecks(value: string) {
  return [
    { label: "8–16 characters", passed: value.length >= 8 && value.length <= 16 },
    { label: "One uppercase letter", passed: /[A-Z]/.test(value) },
    { label: "One special character", passed: /[^A-Za-z0-9]/.test(value) },
  ];
}
