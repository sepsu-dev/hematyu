"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { NotificationsDropdown } from "./notifications-dropdown";
import { ProfileDropdown } from "./profile-dropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pathMap: Record<string, { group: string; name: string }> = {
  "/dashboard": { group: "Aplikasi", name: "Dashboard" },
  "/transactions": { group: "Menu", name: "Transaksi" },
  "/wallets": { group: "Menu", name: "Rekening" },
  "/budgets": { group: "Menu", name: "Anggaran" },
  "/goals": { group: "Menu", name: "Tujuan" },
  "/reports": { group: "Menu", name: "Laporan" },
  "/settings": { group: "Menu", name: "Pengaturan" },
  "/master/categories": { group: "Admin", name: "Kategori" },
  "/master/account-types": { group: "Admin", name: "Jenis Rekening" },
  "/master/laporan": { group: "Admin", name: "Laporan Admin" },
};

export function DashboardHeader() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  function handleToggleNotifications() {
    setIsNotificationsOpen((prev) => !prev);
    setIsProfileOpen(false);
  }

  function handleToggleProfile() {
    setIsProfileOpen((prev) => !prev);
    setIsNotificationsOpen(false);
  }

  const currentPath = pathMap[pathname] || { group: "Platform", name: "Hemat.yu" };

  return (
    <header className="h-16 border-b border-sidebar-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-20">
      {/* Left – Sidebar Trigger & Breadcrumb */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent" />
        <Separator orientation="vertical" className="h-4 bg-sidebar-border" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden sm:block">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                {currentPath.group}
              </span>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[10px] font-black text-foreground uppercase tracking-wider">
                {currentPath.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right – Notifications & Profile */}
      <div className="flex items-center gap-4">
        <NotificationsDropdown
          isOpen={isNotificationsOpen}
          onToggle={handleToggleNotifications}
        />
        <ProfileDropdown
          isOpen={isProfileOpen}
          onToggle={handleToggleProfile}
        />
      </div>
    </header>
  );
}
