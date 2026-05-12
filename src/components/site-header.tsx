"use client";

import Link from "next/link";
import { Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Highlighter } from "./highlighter";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

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

          <Link href="/login" className="hidden sm:inline-flex">
            <Button variant="outline" className="px-6 py-5 rounded-xl border-gray-100 text-sm font-bold text-[#111827] hover:bg-gray-50 transition-all">
              Masuk
            </Button>
          </Link>
          <Link href="/register" className="hidden sm:inline-flex">
            <Button className="px-6 py-5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all">
              Daftar
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-gray-500 hover:bg-gray-50 rounded-xl">
                <Menu className="h-6 w-6" strokeWidth={2.5} />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              <SheetDescription className="sr-only">
                Navigasi utama situs web Hematyu.
              </SheetDescription>
              <nav className="flex flex-col gap-6 mt-8">
                <Link href="#tentang" className="text-base font-semibold text-[#6B7280] hover:text-primary">Beranda</Link>
                <Link href="#fitur" className="text-base font-semibold text-[#6B7280] hover:text-primary">Fitur</Link>
                <Link href="#demo" className="text-base font-semibold text-[#6B7280] hover:text-primary">Cara Kerja</Link>
                <Link href="#harga" className="text-base font-semibold text-[#6B7280] hover:text-primary">Paket Harga</Link>
                <hr className="my-2 border-gray-100" />
                <div className="flex flex-col gap-3">
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full justify-center py-6 rounded-xl border-gray-200">Masuk</Button>
                  </Link>
                  <Link href="/register" className="w-full">
                    <Button className="w-full justify-center py-6 rounded-xl shadow-md">Daftar</Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
