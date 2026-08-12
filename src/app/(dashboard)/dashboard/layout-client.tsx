"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuthStore, type AuthUser } from "@/lib/stores/auth-store";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pathMap: Record<string, { group: string; name: string }> = {
    "/dashboard": { group: "Menu", name: "Dashboard" },
    "/dashboard/transactions": { group: "Menu", name: "Transaksi" },
    "/dashboard/transactions/new": { group: "Menu", name: "Catat Transaksi" },
    "/dashboard/wallets": { group: "Menu", name: "Kantong Keuangan" },
    "/dashboard/budgets": { group: "Menu", name: "Anggaran Bulanan" },
    "/dashboard/goals": { group: "Menu", name: "Target Keuangan" },
    "/dashboard/reports": { group: "Menu", name: "Laporan & Grafik" },
    "/dashboard/settings": { group: "Menu", name: "Pengaturan" },
    "/dashboard/master/categories": { group: "Master Data", name: "Master Kategori" },
    "/dashboard/master/account-types": { group: "Master Data", name: "Tipe Kantong" },
    "/dashboard/master/laporan": { group: "Master Data", name: "Laporan Admin" },
};

export function DashboardLayoutClient({
    children,
    user,
}: {
    children: React.ReactNode;
    user: AuthUser & { role: string };
}) {
    const setUser = useAuthStore((s) => s.setUser);
    const hydrate = useAuthStore((s) => s.hydrate);
    const pathname = usePathname();

    useEffect(() => {
        setUser(user);
        hydrate();
    }, [user, setUser, hydrate]);

    const currentPath = pathMap[pathname] || { group: "Platform", name: "hemat.yu" };

    return (
        <SidebarProvider>
            {/* App Sidebar from shadcn */}
            <AppSidebar role={user.role} />

            {/* Sidebar Inset (Main area wrapper from shadcn) */}
            <SidebarInset>
                {/* Header murni tipis bawaan shadcn (Tanpa Navbar/Dropdown Kanan) */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden sm:block">
                                <span className="text-xs font-medium text-muted-foreground">
                                    {currentPath.group}
                                </span>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden sm:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-xs font-semibold text-foreground">
                                    {currentPath.name}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}