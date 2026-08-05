import { Heart } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";

interface SiteFooterProps {
  author: string;
}

export function SiteFooter({ author }: SiteFooterProps) {
  return (
    <div className="w-full flex flex-col mt-auto">
      {/* ─── Main Footer ─── */}
      <footer className="py-20 px-6 md:px-12 bg-[#FAF6F0] border-t border-stone-900/5">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16">
            
            {/* Brand Column */}
            <div className="md:col-span-1 space-y-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex items-center justify-center h-9">
                  <Logo className="h-full" />
                </div>
              </Link>
              <p className="text-xs font-bold text-stone-500 leading-relaxed">
                hemat.yu menyederhanakan pencatatan keuangan harian Anda melalui asisten cerdas yang bekerja secara instan langsung via WhatsApp.
              </p>
            </div>

            {/* Links Columns */}
            <div className="space-y-6">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-stone-900">Produk</h3>
              <ul className="space-y-3 text-xs font-bold text-stone-500">
                <li><Link href="#" className="hover:text-stone-950 transition-colors">Fitur Utama</Link></li>
                <li><Link href="#" className="hover:text-stone-950 transition-colors">Update Terbaru</Link></li>
                <li><Link href="#" className="hover:text-stone-950 transition-colors">Harga</Link></li>
                <li><Link href="#" className="hover:text-stone-950 transition-colors">Keamanan Data</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-stone-900">Perusahaan</h3>
              <ul className="space-y-3 text-xs font-bold text-stone-500">
                <li><Link href="/about" className="hover:text-stone-950 transition-colors">Tentang Kami</Link></li>
                <li><Link href="#" className="hover:text-stone-950 transition-colors">Karir</Link></li>
                <li><Link href="#" className="hover:text-stone-950 transition-colors">Blog & Kiat</Link></li>
                <li><Link href="/contact" className="hover:text-stone-950 transition-colors">Hubungi Kami</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-stone-900">Bantuan</h3>
              <ul className="space-y-3 text-xs font-bold text-stone-500">
                <li><Link href="/help-center" className="hover:text-stone-950 transition-colors">Pusat Bantuan</Link></li>
                <li><Link href="#" className="hover:text-stone-950 transition-colors">Panduan Pengguna</Link></li>
                <li><Link href="/terms" className="hover:text-stone-950 transition-colors">Syarat & Ketentuan</Link></li>
                <li><Link href="/privacy" className="hover:text-stone-950 transition-colors">Kebijakan Privasi</Link></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-stone-900/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xs font-bold text-stone-500">
              © {new Date().getFullYear()} {author}. All rights reserved.
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500">
              Dibuat dengan <Heart className="w-3.5 h-3.5 text-[#E35B30] fill-current" /> untuk finansial sehat Anda.
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
