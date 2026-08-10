"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PiggyBank,
  Target,
  BarChart3,
  Settings,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ScribbleMark } from "@/components/scribble-mark";

const navigation = [
  { name: "Dashboard",       href: "/dashboard",              icon: LayoutDashboard },
  { name: "Akun & Rekening", href: "/dashboard/accounts",    icon: Wallet },
  { name: "Transaksi",       href: "/dashboard/transactions", icon: ArrowLeftRight },
  { name: "Anggaran",        href: "/dashboard/budgets",      icon: PiggyBank },
  { name: "Target",          href: "/dashboard/goals",        icon: Target },
  { name: "Laporan",         href: "/dashboard/reports",      icon: BarChart3 },
  { name: "Pengaturan",      href: "/dashboard/settings",     icon: Settings },
];

interface DashboardSidebarProps {
  isCollapsed: boolean;
}

export function DashboardSidebar({ isCollapsed }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        border-r border-stone-200/80 bg-white/80 backdrop-blur-md
        flex flex-col shrink-0
        fixed inset-y-0 left-0 z-40
        transition-all duration-300
        ${isCollapsed ? "w-16" : "w-60"}
      `}
    >
      {/* Brand */}
      <div
        className={`
          h-16 flex items-center border-b border-stone-200/80 gap-2
          transition-all duration-300
          ${isCollapsed ? "justify-center px-0" : "px-6"}
        `}
      >
        <Logo className="h-6 w-auto" />
        {!isCollapsed && (
          <span className="font-extrabold text-stone-900 text-sm tracking-tight">
            hemat.yu
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`
                relative flex items-center rounded-md transition-all duration-200
                ${isCollapsed
                  ? "justify-center p-2.5"
                  : "gap-3 px-3 py-2 text-xs font-bold uppercase tracking-wider"
                }
                ${isActive
                  ? "text-primary"
                  : "text-stone-500 hover:text-stone-900"
                }
              `}
            >
              {/* Active state – abstract scribble mark */}
              {isActive && !isCollapsed && (
                <ScribbleMark variant="frenzy" />
              )}

              {/* Active state – collapsed: just a dot indicator */}
              {isActive && isCollapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
              )}

              <item.icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? "text-primary" : "text-stone-400"
                }`}
              />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
