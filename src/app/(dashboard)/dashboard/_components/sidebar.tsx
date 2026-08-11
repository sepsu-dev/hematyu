"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Target,
  BarChart3,
  Settings,
  Wallet,
} from "lucide-react";
import { Logo } from "@/components/logo";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, soon: false },
  { name: "Transaksi", href: "/dashboard/transactions", icon: ArrowLeftRight, soon: false },
  { name: "Kantong", href: "/dashboard/wallets", icon: Wallet, soon: false },
  { name: "Anggaran", href: "/dashboard/budgets", icon: PiggyBank, soon: false },
  { name: "Target", href: "/dashboard/goals", icon: Target, soon: false },
  { name: "Laporan", href: "/dashboard/reports", icon: BarChart3, soon: false },
  { name: "Pengaturan", href: "/dashboard/settings", icon: Settings, soon: false },
];

interface DashboardSidebarProps {
  isCollapsed: boolean;
}

export function DashboardSidebar({ isCollapsed }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        border-r border-[#E7DED4] bg-[#FAF6F0]/80 backdrop-blur-md
        flex flex-col shrink-0
        fixed inset-y-0 left-0 z-40
        transition-all duration-300
        ${isCollapsed ? "w-16" : "w-60"}
      `}
    >
      {/* Brand */}
      <div
        className={`
          h-16 flex items-center border-b border-[#E7DED4] gap-2
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
                  : "gap-3 px-3 py-2 text-xs font-bold tracking-wider"
                }
                ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/60 border border-transparent"
                }
              `}
            >
              <item.icon
                className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-primary" : "text-stone-400"
                  }`}
              />
              {!isCollapsed && (
                <span className="flex-1">{item.name}</span>
              )}
              {/* Soon badge — only show when sidebar is expanded */}
              {!isCollapsed && item.soon && (
                <span className="px-1.5 py-0.5 text-[8px] bg-purple-50 text-purple-500 rounded font-black border border-purple-200 uppercase tracking-widest leading-none">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
