"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect } from "react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface SiteHeaderProps {
  name: string;
}

export function SiteHeader({ name }: SiteHeaderProps) {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 md:px-12 bg-[#FAF6F0]/90 backdrop-blur-md flex items-center h-20 border-b border-stone-900/10">
      <div className="mx-auto max-w-7xl w-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-all duration-300 group"
        >
          <div className="flex items-center justify-center h-10 transition-transform group-hover:scale-105 duration-300">
            <Logo className="h-full" />
          </div>
        </Link>

        {/* Navigation Menu (Without subtexts) */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="#tentang" className="flex items-center gap-2 group">
            <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-125 transition-transform"></span>
            <span className="text-[11px] font-extrabold text-stone-900 uppercase tracking-wider hover:text-primary transition-colors">Beranda</span>
          </Link>
          <Link href="#fitur" className="flex items-center gap-2 group">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] group-hover:scale-125 transition-transform"></span>
            <span className="text-[11px] font-extrabold text-stone-900 uppercase tracking-wider hover:text-[#10B981] transition-colors">Fitur</span>
          </Link>
          <Link href="#demo" className="flex items-center gap-2 group">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] group-hover:scale-125 transition-transform"></span>
            <span className="text-[11px] font-extrabold text-stone-900 uppercase tracking-wider hover:text-[#F59E0B] transition-colors">Cara Kerja</span>
          </Link>
          <Link href="#harga" className="flex items-center gap-2 group">
            <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-125 transition-transform"></span>
            <span className="text-[11px] font-extrabold text-stone-900 uppercase tracking-wider hover:text-primary transition-colors">Harga</span>
          </Link>
        </nav>

        {/* Action Buttons (No Search Icon) */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:inline-flex text-xs font-bold text-stone-900 border border-stone-900/60 px-5 py-2 rounded-full hover:bg-stone-900/5 transition-all">
            Masuk
          </Link>
          <Link href="/register" className="hidden sm:inline-flex">
            <Button className="px-5 py-2 h-auto !rounded-full bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors border-none shadow-none">
              Daftar
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-stone-900 border border-stone-900/30 !rounded-full hover:bg-stone-900/5 h-9 w-9">
                <Menu className="h-5 w-5" strokeWidth={2.5} />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] p-0 border-l border-stone-900/10">
              <div className="h-full flex flex-col bg-[#FAF6F0] relative overflow-hidden text-stone-900">
                <div className="p-8 border-b border-stone-900/10">
                  <div className="flex items-center justify-between mb-2">
                    <Logo className="h-8" />
                    <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                  </div>
                  <SheetDescription className="text-xs font-bold text-stone-500">
                    Kelola uangmu, wujudkan mimpi.
                  </SheetDescription>
                </div>

                <nav className="flex-1 px-4 py-8 flex flex-col gap-2">
                  <Link 
                    href="#tentang" 
                    className="flex items-center justify-between px-4 py-3 hover:bg-stone-900/5 rounded-xl transition-all"
                  >
                    <span className="text-sm font-extrabold text-stone-900">Beranda</span>
                  </Link>
                  <Link 
                    href="#fitur" 
                    className="flex items-center justify-between px-4 py-3 hover:bg-stone-900/5 rounded-xl transition-all"
                  >
                    <span className="text-sm font-extrabold text-stone-900">Fitur</span>
                  </Link>
                  <Link 
                    href="#demo" 
                    className="flex items-center justify-between px-4 py-3 hover:bg-stone-900/5 rounded-xl transition-all"
                  >
                    <span className="text-sm font-extrabold text-stone-900">Cara Kerja</span>
                  </Link>
                  <Link 
                    href="#harga" 
                    className="flex items-center justify-between px-4 py-3 hover:bg-stone-900/5 rounded-xl transition-all"
                  >
                    <span className="text-sm font-extrabold text-stone-900">Harga</span>
                  </Link>
                </nav>

                <div className="p-8 bg-[#FAF6F0] border-t border-stone-900/10">
                  <div className="flex flex-col gap-3">
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full justify-center h-12 !rounded-full border border-stone-950/60 text-xs font-bold bg-transparent text-stone-900 hover:bg-stone-900/5 transition-colors">
                        Masuk
                      </Button>
                    </Link>
                    <Link href="/register" className="w-full">
                      <Button className="w-full justify-center h-12 !rounded-full bg-primary border-none text-white text-xs font-bold hover:bg-primary/90 transition-colors">
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
