import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { RequireRole } from "@/components/RequireRole";
import { StoreBrowser } from "@/components/StoreBrowser";

export const Route = createFileRoute("/stores")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "All stores — RateSphere" },
      {
        name: "description",
        content:
          "Browse every registered store on RateSphere, search by name or address, and submit or update your rating.",
      },
      { property: "og:title", content: "All stores — RateSphere" },
      { property: "og:description", content: "Browse and rate every registered store." },
    ],
  }),
  component: () => (
    <RequireRole role="normal_user">
      <AppShell
        title="Stores"
        description="Every registered store, searchable by name and address."
      >
        <StoreBrowser pageSize={9} />
      </AppShell>
    </RequireRole>
  ),
});
