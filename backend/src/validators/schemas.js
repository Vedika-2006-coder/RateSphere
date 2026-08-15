import { z } from "zod";

export const ROLES = ["administrator", "normal_user", "store_owner"];

export const PASSWORD_MESSAGE =
  "Password must be 8–16 characters and contain at least one uppercase letter and one special character.";

export const nameSchema = z
  .string()
  .trim()
  .min(20, "Name must be at least 20 characters.")
  .max(60, "Name must be at most 60 characters.");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required.")
  .max(255, "Email must be at most 255 characters.")
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

export const ratingValueSchema = z
  .number({ invalid_type_error: "Rating must be a number." })
  .int("Rating must be a whole number.")
  .min(1, "Rating must be between 1 and 5.")
  .max(5, "Rating must be between 1 and 5.");

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    address: addressSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: z.enum(ROLES, { errorMap: () => ({ message: "Select a valid role." }) }),
});

export const createStoreSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Store name must be at least 2 characters.")
    .max(120, "Store name must be at most 120 characters."),
  email: emailSchema,
  address: addressSchema,
  ownerId: z
    .union([z.number(), z.string(), z.null()])
    .optional()
    .transform((value) => {
      if (value === null || value === undefined || value === "") return null;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }),
});

export const ratingSchema = z.object({
  rating: ratingValueSchema,
});
