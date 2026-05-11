"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Highlighter } from "./highlighter";
import { Logo } from "./logo";

interface SiteHeaderProps {
  name: string;
}

export function SiteHeader({ name }: SiteHeaderProps) {
  // Dark mode temporarily disabled
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-6 md:px-12 bg-white/80 backdrop-blur-xl border-b border-gray-50 flex items-center h-20 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      <div className="mx-auto max-w-7xl w-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-all duration-300 group"
        >
          <div className="flex items-center justify-center h-11 transition-transform group-hover:scale-105 duration-300">
            <Logo className="h-full" />
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-10">
          <Link href="#tentang" className="text-sm font-semibold text-[#6B7280] hover:text-primary transition-colors">Beranda</Link>
          <Link href="#fitur" className="text-sm font-semibold text-[#6B7280] hover:text-primary transition-colors">Fitur</Link>
          <Link href="#demo" className="text-sm font-semibold text-[#6B7280] hover:text-primary transition-colors">Cara Kerja</Link>
          <Link href="#harga" className="text-sm font-semibold text-[#6B7280] hover:text-primary transition-colors">Paket Harga</Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Dark mode toggle temporarily hidden
          <button
            aria-label="Toggle theme"
            onClick={() => {}}
            className="p-2.5 rounded-xl text-[#6B7280] hover:bg-gray-50 transition-all"
          >
            <Moon className="h-5 w-5" strokeWidth={2.5} />
          </button>
          */}

          <Link
            href="/login"
            className="hidden sm:inline-flex px-6 py-2.5 rounded-xl border border-gray-100 text-sm font-bold text-[#111827] hover:bg-gray-50 transition-all"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all"
          >
            Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}
