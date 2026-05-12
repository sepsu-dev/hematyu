import { Heart } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";

interface SiteFooterProps {
  author: string;
}

export function SiteFooter({ author }: SiteFooterProps) {
  return (
    <footer className="py-20 px-6 md:px-12 bg-white border-t border-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center h-9">
                <Logo className="h-full" />
              </div>
            </Link>
            <p className="text-sm font-medium text-[#6B7280] leading-relaxed">
              Misi kami adalah membantu 1 juta orang Indonesia mencapai kebebasan finansial melalui pengelolaan uang yang cerdas dan menyenangkan.
            </p>
          </div>

          {/* Links Columns */}
          <div className="space-y-6">
            <h3 className="font-bold text-[#1E1B4B]">Produk</h3>
            <ul className="space-y-4 text-sm font-medium text-[#6B7280]">
              <li><Link href="#" className="hover:text-primary transition-colors">Fitur Utama</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Update Terbaru</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Keamanan</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-[#1E1B4B]">Perusahaan</h3>
            <ul className="space-y-4 text-sm font-medium text-[#6B7280]">
              <li><Link href="/about" className="hover:text-primary transition-colors">Tentang Kami</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Karir</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Kontak</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-[#1E1B4B]">Bantuan</h3>
            <ul className="space-y-4 text-sm font-medium text-[#6B7280]">
              <li><Link href="/help-center" className="hover:text-primary transition-colors">Pusat Bantuan</Link></li>
              <li><Link href="/user-guide" className="hover:text-primary transition-colors">Panduan User</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm font-medium text-[#6B7280]">
            © {new Date().getFullYear()} {author}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
