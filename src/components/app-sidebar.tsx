"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Target,
  BarChart3,
  Wallet,
  ShieldCheck,
  Users,
  UserCog,
  KeyRound,
  Menu,
  ListChecks,
  Database,
  FolderTree,
  Landmark,
  FileBarChart,
  Circle,
  type LucideIcon,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { NavMain } from "@/components/nav-main"
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
import { useMenuStore } from "@/lib/stores/menu-store"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SidebarMenuNode {
  id: string
  label: string
  path: string | null
  icon_name: string
  children: SidebarMenuNode[]
}

const ICONS: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  "arrow-left-right": ArrowLeftRight,
  wallet: Wallet,
  "piggy-bank": PiggyBank,
  target: Target,
  "bar-chart-3": BarChart3,
  "shield-check": ShieldCheck,
  users: Users,
  "user-cog": UserCog,
  "key-round": KeyRound,
  menu: Menu,
  "list-checks": ListChecks,
  database: Database,
  "folder-tree": FolderTree,
  landmark: Landmark,
  "file-bar-chart": FileBarChart,
  circle: Circle,
}

export function AppSidebar({ menus: propMenus = [], ...props }: React.ComponentProps<typeof Sidebar> & { menus: SidebarMenuNode[] }) {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const storeMenus = useMenuStore((s) => s.menus)
  const { isMobile, setOpenMobile, state } = useSidebar()

  // Menu selalu dibaca dari state management setelah load pertama
  const menus = storeMenus.length > 0 ? storeMenus : propMenus

  const isActive = (href: string) => {
    if (!href) return false
    return href === "/dashboard" ? pathname === href : pathname.startsWith(href)
  }

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

  const navMain = menus.map((m) => {
    const Icon = ICONS[m.icon_name] ?? Circle
    const isParent = m.children.length > 0
    return {
      title: m.label,
      url: m.path ?? undefined,
      icon: <Icon className="size-4" />,
      isActive: isParent
        ? m.children.some((c) => c.path && pathname.startsWith(c.path))
        : isActive(m.path ?? ""),
      items: isParent
        ? m.children.map((c) => ({
          title: c.label,
          url: c.path ?? "#",
          icon: (() => { const Ci = ICONS[c.icon_name] ?? Circle; return <Ci className="size-4" /> })(),
        }))
        : undefined,
    }
  })

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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}