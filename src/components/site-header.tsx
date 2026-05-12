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
            <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0 border-l-0">
              <div className="h-full flex flex-col bg-white relative overflow-hidden">
                {/* Decorative Background for Mobile Menu */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50/50 blur-3xl -z-10 rounded-full"></div>

                <div className="p-8 border-b border-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <Logo className="h-9" />
                    <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                  </div>
                  <SheetDescription className="text-xs font-medium text-[#6B7280]">
                    Kelola uangmu, wujudkan mimpi.
                  </SheetDescription>
                </div>

                <nav className="flex-1 px-4 py-8 flex flex-col gap-2">
                  <Link 
                    href="#tentang" 
                    className="flex items-center justify-between px-4 py-4 text-base font-bold text-[#111827] hover:bg-gray-50 rounded-2xl transition-all group"
                  >
                    <span>Beranda</span>
                    <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                    </div>
                  </Link>
                  <Link 
                    href="#fitur" 
                    className="flex items-center justify-between px-4 py-4 text-base font-bold text-[#111827] hover:bg-gray-50 rounded-2xl transition-all group"
                  >
                    <span>Fitur</span>
                    <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                    </div>
                  </Link>
                  <Link 
                    href="#demo" 
                    className="flex items-center justify-between px-4 py-4 text-base font-bold text-[#111827] hover:bg-gray-50 rounded-2xl transition-all group"
                  >
                    <span>Cara Kerja</span>
                    <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                    </div>
                  </Link>
                  <Link 
                    href="#harga" 
                    className="flex items-center justify-between px-4 py-4 text-base font-bold text-[#111827] hover:bg-gray-50 rounded-2xl transition-all group"
                  >
                    <span>Paket Harga</span>
                    <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                    </div>
                  </Link>
                </nav>

                <div className="p-8 bg-gray-50/50 border-t border-gray-50">
                  <div className="flex flex-col gap-3">
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full justify-center h-14 rounded-2xl border-gray-200 text-sm font-bold bg-white hover:bg-gray-50 transition-all">
                        Masuk
                      </Button>
                    </Link>
                    <Link href="/register" className="w-full">
                      <Button className="w-full justify-center h-14 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all">
                        Daftar
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
