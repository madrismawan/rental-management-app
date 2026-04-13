"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardLoading from "./loading";
import { useSession } from "next-auth/react";
import { User } from "@/lib/api/resource/user";
import { setDocumentTitle } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const getAdminPageTitle = (pathname: string) => {
  if (pathname.startsWith("/vehicle-incident")) {
    if (pathname.endsWith("/create")) return "Vehicle Incident Create";
    if (pathname.endsWith("/edit")) return "Vehicle Incident Edit";
    if (pathname !== "/vehicle-incident") return "Vehicle Incident Detail";
    return "Vehicle Incident";
  }

  if (pathname.startsWith("/vehicle")) {
    if (pathname.endsWith("/create")) return "Vehicle Create";
    if (pathname.endsWith("/edit")) return "Vehicle Edit";
    if (pathname !== "/vehicle") return "Vehicle Detail";
    return "Vehicle";
  }

  if (pathname.startsWith("/customer")) {
    if (pathname.endsWith("/create")) return "Customer Create";
    if (pathname.endsWith("/edit")) return "Customer Edit";
    if (pathname !== "/customer") return "Customer Detail";
    return "Customer";
  }

  if (pathname.startsWith("/rental")) {
    if (pathname.endsWith("/create")) return "Rental Create";
    if (pathname.endsWith("/edit")) return "Rental Edit";
    if (pathname !== "/rental") return "Rental Detail";
    return "Rental";
  }

  return "Dashboard";
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    setDocumentTitle(getAdminPageTitle(pathname));
  }, [pathname]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <DashboardLoading />;
  }

  if (status !== "authenticated" || !session?.user) {
    return <DashboardLoading />;
  }

  const user: User = {
    id: session.user.id,
    name: session.user.name || "No Name",
    email: session.user.email || "",
    role: session.user.role || "user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
