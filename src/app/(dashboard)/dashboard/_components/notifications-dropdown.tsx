"use client";

import { useRef, useEffect } from "react";
import { Bell, Wallet, Target } from "lucide-react";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function NotificationsDropdown({ isOpen, onToggle }: NotificationsDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (isOpen) onToggle();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={onToggle}
        className={`
          p-2 rounded-lg transition-all relative border
          ${isOpen
            ? "bg-stone-100 text-stone-900 border-stone-200"
            : "text-stone-500 hover:text-stone-900 hover:bg-stone-100 border-transparent"
          }
        `}
        aria-label="Notifikasi"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#E35B30] rounded-full" />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-stone-200 rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-stone-900">
              Notifikasi
            </span>
            <span className="text-[10px] font-bold text-primary cursor-pointer hover:underline">
              Tandai semua dibaca
            </span>
          </div>

          {/* List */}
          <div className="divide-y divide-stone-50 max-h-60 overflow-y-auto">
            <NotifItem
              icon={<Wallet className="w-3 h-3" />}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
              title="Gaji Berhasil Masuk"
              body="Rp 15,000,000 telah ditambahkan ke saldo utama."
            />
            <NotifItem
              icon={<Target className="w-3 h-3" />}
              iconBg="bg-[#E35B30]/10"
              iconColor="text-[#E35B30]"
              title="Target Menabung 85%"
              body="Tinggal Rp 3,000,000 lagi untuk mencapai goal Laptop Baru Anda!"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Private sub-component ─────────────────────────────────── */

interface NotifItemProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
}

function NotifItem({ icon, iconBg, iconColor, title, body }: NotifItemProps) {
  return (
    <div className="px-4 py-3 hover:bg-stone-50 transition-colors flex gap-2.5 items-start">
      <div className={`w-6 h-6 rounded-full ${iconBg} flex items-center justify-center ${iconColor} shrink-0`}>
        {icon}
      </div>
      <div className="text-xs">
        <p className="font-bold text-stone-800">{title}</p>
        <p className="text-stone-500 text-[10px] mt-0.5">{body}</p>
      </div>
    </div>
  );
}
