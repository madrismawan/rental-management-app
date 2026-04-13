"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardLoading from "./loading";
import { useSession } from "next-auth/react";
import { User } from "@/lib/api/resource/user";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <DashboardLoading />;
  }
  if (status === "unauthenticated") {
    return <div>Please sign in</div>;
  }

  const user: User = {
    id: session!.user.id,
    name: session!.user.name || "No Name",
    email: session!.user.email || "",
    role: session!.user.role || "user",
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <Sidebar variant="inset" user={user} />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 max-w-full">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
