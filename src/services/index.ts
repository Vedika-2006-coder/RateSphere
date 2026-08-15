import { apiRequest, type Paginated } from "./apiClient";
import type {
  AdminDashboard,
  AdminUserRow,
  AuthUser,
  OwnerDashboard,
  Role,
  Store,
  StoreRating,
  UserDashboard,
  UserDetails,
  UserRating,
} from "./types";

/* ----------------------------- auth ----------------------------- */

export const authService = {
  register: (body: {
    name: string;
    email: string;
    address: string;
    password: string;
    confirmPassword: string;
  }) => apiRequest<{ data: AuthUser; message: string }>("/auth/register", { method: "POST", body }),

  login: (body: { email: string; password: string }) =>
    apiRequest<{ data: { token: string; user: AuthUser } }>("/auth/login", {
      method: "POST",
      body,
    }),

  me: () => apiRequest<{ data: AuthUser }>("/auth/me"),

  changePassword: (body: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => apiRequest<{ message: string }>("/auth/password", { method: "PATCH", body }),
};

/* ---------------------------- stores ---------------------------- */

export type StoreQuery = {
  search?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
  address?: string | undefined;
  owner?: string | undefined;
  sortBy?: string | undefined;
  order?: "asc" | "desc" | undefined;
  page?: number | undefined;
  limit?: number | undefined;
};

export const storeService = {
  list: (query: StoreQuery = {}) => apiRequest<Paginated<Store>>("/stores", { query }),
  get: (id: number) => apiRequest<{ data: Store }>(`/stores/${id}`),
  create: (body: { name: string; email: string; address: string; ownerId: number | null }) =>
    apiRequest<{ data: Store; message: string }>("/stores", { method: "POST", body }),
  ratings: (storeId: number) =>
    apiRequest<{ data: StoreRating[] }>(`/stores/${storeId}/ratings`),
};

/* ---------------------------- ratings --------------------------- */

export const ratingService = {
  submit: (storeId: number, rating: number) =>
    apiRequest<{ data: { store: Store }; message: string }>(`/stores/${storeId}/ratings`, {
      method: "POST",
      body: { rating },
    }),
  update: (storeId: number, rating: number) =>
    apiRequest<{ data: { store: Store }; message: string }>(`/stores/${storeId}/ratings`, {
      method: "PUT",
      body: { rating },
    }),
  mine: () => apiRequest<{ data: UserRating[] }>("/user/ratings"),
};

/* ----------------------------- users ---------------------------- */

export type UserQuery = {
  search?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
  address?: string | undefined;
  role?: Role | "" | undefined;
  sortBy?: string | undefined;
  order?: "asc" | "desc" | undefined;
  page?: number | undefined;
  limit?: number | undefined;
};

export const userService = {
  list: (query: UserQuery = {}) => apiRequest<Paginated<AdminUserRow>>("/users", { query }),
  get: (id: number) => apiRequest<{ data: UserDetails }>(`/users/${id}`),
  create: (body: {
    name: string;
    email: string;
    address: string;
    password: string;
    role: Role;
  }) => apiRequest<{ data: AuthUser; message: string }>("/users", { method: "POST", body }),
  owners: () => apiRequest<{ data: { id: number; name: string; email: string }[] }>("/users/owners"),
};

/* --------------------------- dashboards -------------------------- */

export const dashboardService = {
  user: () => apiRequest<{ data: UserDashboard }>("/user/dashboard"),
  owner: () => apiRequest<{ data: OwnerDashboard }>("/owner/dashboard"),
  admin: () => apiRequest<{ data: AdminDashboard }>("/admin/dashboard"),
};
