"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar, type SidebarMenuNode } from "@/components/app-sidebar";
import { useAuthStore, type AuthUser } from "@/lib/stores/auth-store";
import { useMenuStore } from "@/lib/stores/menu-store";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ROOT_PREFIX = "/dashboard";

function buildPathMap(menus: SidebarMenuNode[]): Map<string, { group: string; name: string }> {
    const map = new Map<string, { group: string; name: string }>();
    const walk = (nodes: SidebarMenuNode[], group?: string) => {
        for (const n of nodes) {
            const g = group ?? (n.children.length > 0 ? n.label : "Menu");
            if (n.path) map.set(n.path, { group: g, name: n.label });
            walk(n.children, g);
        }
    };
    walk(menus);
    return map;
}

function resolveBreadcrumb(pathname: string, menus: SidebarMenuNode[]): { group: string; name: string } {
    const map = buildPathMap(menus);
    if (map.has(pathname)) return map.get(pathname)!;
    if (map.has(`/${pathname}`)) return map.get(`/${pathname}`)!;
    // Fallback untuk path dinamis: ambil segmen terakhir
    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1] ?? "";
    const readable = last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { group: "Menu", name: readable || "Halaman" };
}

export function DashboardLayoutClient({
    children,
    user,
    menus,
}: {
    children: React.ReactNode;
    user: AuthUser;
    menus: SidebarMenuNode[];
}) {
    const setUser = useAuthStore((s) => s.setUser);
    const hydrate = useAuthStore((s) => s.hydrate);
    const storeMenus = useMenuStore((s) => s.menus);
    const setMenus = useMenuStore((s) => s.setMenus);
    const pathname = usePathname();

    useEffect(() => {
        setUser(user);
        hydrate();
        // Sinkronkan menu terbaru dari server ke store agar sidebar terupdate secara real-time
        if (menus.length > 0) {
            setMenus(menus);
        }
    }, [user, setUser, hydrate, menus, setMenus]);

    // Setelah mount, menu dibaca dari store (memori); sebelum itu pakai props (SSR)
    const activeMenus = storeMenus.length > 0 ? storeMenus : menus;

    // Path tanpa prefix /dashboard, mis. /transactions
    const routePath = pathname.startsWith(ROOT_PREFIX) ? pathname.slice(ROOT_PREFIX.length) || "/" : pathname;
    const currentPath = resolveBreadcrumb(routePath, activeMenus);

    return (
        <SidebarProvider>
            <AppSidebar menus={menus} />
            <SidebarInset>
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
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