import { Heart, Rocket } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 px-6 md:px-12 text-center bg-[#FAF6F0] relative overflow-hidden border-t border-stone-900/5">
      <div className="max-w-4xl mx-auto p-10 md:p-16 sketch-card bg-[#FAF6F0] space-y-8 relative overflow-hidden">
        
        <div className="space-y-6">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center border-1.5 border-stone-900 mx-auto">
            <Heart className="w-6 h-6 text-[#E35B30] fill-current" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 leading-tight tracking-tight">
            Mulai Langkah Finansial <br /> Sehat Anda Hari Ini
          </h2>
          <p className="text-stone-600 text-xs md:text-sm font-semibold max-w-lg mx-auto leading-relaxed">
            Bergabunglah dengan ribuan pengguna lain yang telah berhasil mengubah cara mereka mengelola uang, mencatat transaksi secara otomatis, dan hidup lebih hemat.
          </p>
        </div>

        <div className="pt-4 flex flex-col items-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#E35B30] text-white font-extrabold text-sm rounded-lg hover:bg-[#DE5024] transition-colors"
          >
            <span>Daftar Sekarang, 100% Gratis</span>
            <Rocket className="w-4 h-4 text-white" />
          </Link>
          <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Registrasi Cepat Tanpa Kartu Kredit</p>
        </div>

      </div>
    </section>
  );
}
