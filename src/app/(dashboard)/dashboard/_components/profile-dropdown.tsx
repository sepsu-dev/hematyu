"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";

interface ProfileDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  /** Display name shown in the trigger button */
  displayName?: string;
  /** Two-letter avatar initials */
  initials?: string;
  email?: string;
}

export function ProfileDropdown({
  isOpen,
  onToggle,
  displayName = "Jason David",
  initials = "JD",
  email = "jason.david@example.com",
}: ProfileDropdownProps) {
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
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => e.key === "Enter" && onToggle()}
        aria-expanded={isOpen}
        aria-label="Menu profil"
        className={`
          flex items-center gap-2.5 bg-white border rounded-lg px-2.5 py-1.5
          hover:bg-stone-50 transition-all cursor-pointer shadow-xs
          ${isOpen ? "border-primary bg-stone-50" : "border-stone-200/80"}
        `}
      >
        {/* Avatar */}
        <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary uppercase">
          {initials}
        </div>
        <span className="text-xs font-bold text-stone-700 hidden sm:inline">
          {displayName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-stone-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs font-bold">
          {/* User info */}
          <div className="px-4 py-2.5 border-b border-stone-100">
            <p className="text-stone-900 font-bold truncate">{displayName}</p>
            <p className="text-[10px] text-stone-400 truncate">{email}</p>
          </div>

          {/* Links */}
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 px-4 py-2.5 text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
          >
            <User className="w-3.5 h-3.5 text-stone-400" />
            <span>Profil Saya</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 px-4 py-2.5 text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-stone-400" />
            <span>Pengaturan</span>
          </Link>

          <div className="border-t border-stone-100 my-1" />

          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Keluar</span>
          </Link>
        </div>
      )}
    </div>
  );
}
