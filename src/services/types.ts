export type Role = "administrator" | "normal_user" | "store_owner";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  address: string;
  role: Role;
  created_at?: string;
};

export type Store = {
  id: number;
  name: string;
  email: string;
  address: string;
  owner_id: number | null;
  owner_name: string | null;
  owner_email: string | null;
  average_rating: number | null;
  total_ratings: number;
  user_rating: number | null;
  created_at: string;
};

export type OwnedStore = {
  id: number;
  name: string;
  email: string;
  address: string;
  average_rating: number | null;
  total_ratings: number;
  created_at: string;
};

export type StoreRating = {
  id: number;
  rating: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  user_name: string;
  user_email: string;
};

export type UserRating = {
  id: number;
  rating: number;
  created_at: string;
  updated_at: string;
  store_id: number;
  store_name: string;
  store_address: string;
  average_rating: number | null;
};

export type AdminUserRow = AuthUser & {
  owner_average_rating: number | null;
  owner_total_ratings: number;
};

export type UserDetails = AuthUser & { stores: OwnedStore[] };

export type DistributionPoint = { rating: number; count: number };

export type UserDashboard = {
  user: { name: string; email: string };
  stats: {
    totalStores: number;
    storesRated: number;
    averageGiven: number | null;
    unratedStores: number;
  };
  recentRatings: UserRating[];
  distribution: DistributionPoint[];
};

export type OwnerDashboard = {
  owner: { name: string; email: string };
  stores: OwnedStore[];
  stats: { totalStores: number; totalRatings: number; averageRating: number | null };
  distribution: DistributionPoint[];
  recentRatings: {
    id: number;
    rating: number;
    updated_at: string;
    user_name: string;
    user_email: string;
    store_name: string;
  }[];
  raters: StoreRating[];
};

export type AdminDashboard = {
  stats: { totalUsers: number; totalStores: number; totalRatings: number };
  distribution: DistributionPoint[];
  topStores: Store[];
};

export const ROLE_LABELS: Record<Role, string> = {
  administrator: "Administrator",
  normal_user: "Normal User",
  store_owner: "Store Owner",
};

export const ROLE_HOME: Record<Role, string> = {
  administrator: "/admin/dashboard",
  normal_user: "/dashboard",
  store_owner: "/owner/dashboard",
};
