"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Target,
  BarChart3,
  Settings,
  Wallet,
  Tag,
  Layers,
  ShieldCheck,
  Database,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/lib/stores/auth-store"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppSidebar({ role, ...props }: React.ComponentProps<typeof Sidebar> & { role?: string }) {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const isSuperadmin = role === "superadmin" || user?.role === "superadmin"
  const { isMobile, setOpenMobile, state } = useSidebar()

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href)

  const teams = [
    {
      name: "hemat.yu",
      logo: (
        <div className="flex aspect-square size-6 items-center justify-center rounded-lg">
          <Logo className="size-5" />
        </div>
      ),
      plan: "",
    }
  ]

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard className="size-4" />,
      isActive: isActive("/dashboard"),
    },
    {
      title: "Transaksi",
      url: "/dashboard/transactions",
      icon: <ArrowLeftRight className="size-4" />,
      isActive: isActive("/dashboard/transactions"),
    },
    {
      title: "Kantong",
      url: "/dashboard/wallets",
      icon: <Wallet className="size-4" />,
      isActive: isActive("/dashboard/wallets"),
    },
    {
      title: "Anggaran",
      url: "/dashboard/budgets",
      icon: <PiggyBank className="size-4" />,
      isActive: isActive("/dashboard/budgets"),
    },
    {
      title: "Target",
      url: "/dashboard/goals",
      icon: <Target className="size-4" />,
      isActive: isActive("/dashboard/goals"),
    },
    {
      title: "Laporan",
      url: "/dashboard/reports",
      icon: <BarChart3 className="size-4" />,
      isActive: isActive("/dashboard/reports"),
    },
    {
      title: "Pengaturan",
      url: "/dashboard/settings",
      icon: <Settings className="size-4" />,
      isActive: isActive("/dashboard/settings"),
    },
  ]

  // Master Data menus mapped to navProjects for Superadmin
  const masterProjects = isSuperadmin
    ? [
      {
        name: "Master Kategori",
        url: "/dashboard/master/categories",
        icon: <Tag className="size-4" />,
      },
      {
        name: "Tipe Kantong",
        url: "/dashboard/master/account-types",
        icon: <Layers className="size-4" />,
      },
      {
        name: "Laporan Admin",
        url: "/dashboard/master/laporan",
        icon: <ShieldCheck className="size-4" />,
      },
    ]
    : []

  const sidebarUser = {
    name: user?.name || "Pengguna",
    email: user?.email || "user@hemat.yu",
    avatar: "",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className={cn(
        "flex h-16 flex-row items-center justify-between px-4",
        state === "collapsed" && "justify-center px-0"
      )}>
        {state === "collapsed" ? (
          <div className="flex size-8 items-center justify-center">
            <Logo className="size-5" />
          </div>
        ) : (
          <TeamSwitcher teams={teams} />
        )}
        {isMobile && (
          <button
            onClick={() => setOpenMobile(false)}
            className="p-1 rounded-md hover:bg-muted text-stone-400 hover:text-stone-900 cursor-pointer mr-2 flex items-center justify-center border border-transparent transition-colors"
            aria-label="Tutup Sidebar"
          >
            <X className="size-4" />
          </button>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {isSuperadmin && (
          <NavProjects projects={masterProjects} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
