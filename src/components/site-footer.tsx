import { Heart } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";

interface SiteFooterProps {
  author: string;
}

export function SiteFooter({ author }: SiteFooterProps) {
  return (
    <footer className="py-10 px-6 bg-[#FAF6F0] border-t border-stone-900/5">
      <div className="mx-auto max-w-7xl flex flex-col items-center justify-center gap-4 text-center">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 group">
          <div className="h-7 flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
            <Logo className="h-full" />
          </div>
          <span className="font-bold text-stone-900 text-base tracking-tight">hemat.yu</span>
        </Link>

        {/* Copyright & Tagline */}
        <div className="text-xs font-bold text-stone-500/80 flex items-center gap-1.5 flex-wrap justify-center">
          <span>© {new Date().getFullYear()} {author}.</span>
          <span className="flex items-center gap-1.5">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-[#E35B30] fill-current" /> untuk finansial sehat Anda.
          </span>
        </div>

      </div>
    </footer>
  );
}
