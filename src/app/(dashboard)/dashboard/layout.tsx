"use client";

import { useState, useRef, useEffect } from "react";
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
  Bell,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Info
} from "lucide-react";
import { Logo } from "@/components/logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Akun & Rekening", href: "/dashboard/accounts", icon: Wallet },
    { name: "Transaksi", href: "/dashboard/transactions", icon: ArrowLeftRight },
    { name: "Anggaran", href: "/dashboard/budgets", icon: PiggyBank },
    { name: "Target", href: "/dashboard/goals", icon: Target },
    { name: "Laporan", href: "/dashboard/reports", icon: BarChart3 },
    { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-900 font-sans flex relative overflow-hidden">
      {/* Premium background decorative glow elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-[20%] w-[500px] h-[500px] bg-[#E35B30]/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Sidebar */}
      <aside className={`border-r border-stone-200/80 bg-white/80 backdrop-blur-md flex flex-col shrink-0 fixed inset-y-0 left-0 z-40 transition-all duration-300 ${isCollapsed ? "w-16" : "w-60"}`}>
        <div className={`h-16 flex items-center border-b border-stone-200/80 gap-2 transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-6"}`}>
          <Logo className="h-6 w-auto" />
          {!isCollapsed && <span className="font-extrabold text-stone-900 text-sm tracking-tight">hemat.yu</span>}
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center rounded-md transition-all duration-200 ${
                  isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2 text-xs font-bold uppercase tracking-wider"
                } ${
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-xs" 
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/60 border border-transparent"
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-primary" : "text-stone-400"}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? "pl-16" : "pl-60"}`}>
        {/* Header */}
        <header className="h-16 border-b border-stone-200/80 bg-white/70 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Collapse toggle button */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-transparent hover:border-stone-200"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications Dropdown Container */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className={`p-2 rounded-lg transition-all relative border ${
                  isNotificationsOpen 
                    ? "bg-stone-100 text-stone-900 border-stone-200" 
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-100 border-transparent"
                }`}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#E35B30] rounded-full"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-stone-200 rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-900">Notifikasi</span>
                    <span className="text-[10px] font-bold text-primary cursor-pointer hover:underline">Tandai semua dibaca</span>
                  </div>
                  <div className="divide-y divide-stone-50 max-h-60 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-stone-50 transition-colors flex gap-2.5 items-start">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Wallet className="w-3 h-3" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-stone-800">Gaji Berhasil Masuk</p>
                        <p className="text-stone-500 text-[10px] mt-0.5">Rp 15,000,000 telah ditambahkan ke saldo utama.</p>
                      </div>
                    </div>
                    <div className="px-4 py-3 hover:bg-stone-50 transition-colors flex gap-2.5 items-start">
                      <div className="w-6 h-6 rounded-full bg-[#E35B30]/10 flex items-center justify-center text-[#E35B30] shrink-0">
                        <Target className="w-3 h-3" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-stone-800">Target Menabung 85%</p>
                        <p className="text-stone-500 text-[10px] mt-0.5">Tinggal Rp 3,000,000 lagi untuk mencapai goal Laptop Baru Anda!</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown Container */}
            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className={`flex items-center gap-2.5 bg-white border rounded-lg px-2.5 py-1.5 hover:bg-stone-50 transition-all cursor-pointer shadow-xs ${
                  isProfileOpen ? "border-primary bg-stone-50" : "border-stone-200/80"
                }`}
              >
                <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary uppercase">
                  JD
                </div>
                <span className="text-xs font-bold text-stone-700 hidden sm:inline">{isCollapsed ? "JD" : "Jason David"}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs font-bold">
                  <div className="px-4 py-2.5 border-b border-stone-100 text-stone-500 font-medium">
                    <p className="text-stone-900 font-bold truncate">Jason David</p>
                    <p className="text-[10px] text-stone-400 truncate">jason.david@example.com</p>
                  </div>
                  <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>Profil Saya</span>
                  </Link>
                  <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors">
                    <Settings className="w-3.5 h-3.5 text-stone-400" />
                    <span>Pengaturan</span>
                  </Link>
                  <div className="border-t border-stone-100 my-1"></div>
                  <Link href="/" className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Keluar</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 bg-[#FAF6F0]">
          {children}
        </main>
      </div>
    </div>
  );
}
