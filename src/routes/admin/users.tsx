import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ErrorState, LoadingStats } from "@/components/DataState";
import { RequireRole } from "@/components/RequireRole";
import { userService } from "@/services";
import type { Role } from "@/services/types";
import { ApiError } from "@/services/apiClient";

export const Route = createFileRoute("/admin/users")({
  ssr: false,
  component: () => (
    <RequireRole role="administrator">
      <AdminUsers />
    </RequireRole>
  ),
});

function AdminUsers() {
  const query = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => userService.list({ page: 1, limit: 50 }),
  });

  const users = query.data?.data ?? [];

  return (
    <AppShell
      title="Users"
      description="View and manage RateSphere users."
    >
      {query.isPending ? <LoadingStats count={1} /> : null}

      {query.isError ? (
        <ErrorState
          message={
            query.error instanceof ApiError
              ? query.error.message
              : "Unable to load users."
          }
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {query.data ? (
        <section className="surface-card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border p-5">
            <Users className="size-5" />
            <div>
              <h2 className="font-display text-lg font-semibold">
                All Users
              </h2>
              <p className="text-sm text-muted-foreground">
                {query.data.pagination.total} registered users
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Address</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Ratings</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-4 font-medium">
                      {user.name}
                    </td>

                    <td className="px-5 py-4">
                      {user.email}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {user.address}
                    </td>

                    <td className="px-5 py-4">
                      <RoleBadge role={user.role} />
                    </td>

                    <td className="px-5 py-4">
                      {user.role === "store_owner"
                        ? user.owner_total_ratings
                        : "—"}
                    </td>
                  </tr>
                ))}

                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-muted-foreground"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}

function RoleBadge({ role }: { role: Role }) {
  const label =
    role === "administrator"
      ? "Administrator"
      : role === "store_owner"
        ? "Store Owner"
        : "Normal User";

  return (
    <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
      {label}
    </span>
  );
}