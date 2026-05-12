import { Heart, Rocket } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 px-6 md:px-12 text-center bg-white relative">
      <div className="max-w-7xl mx-auto p-8 sm:p-16 md:p-24 rounded-3xl bg-gradient-to-br from-[#111827] to-[#111827] space-y-12 relative overflow-hidden shadow-2xl group border border-white/5">
        <div className="relative z-10 space-y-8">
          <div className="w-16 h-16 rounded-xl border border-white/20 flex items-center justify-center shadow-2xl mx-auto mb-6">
            <Heart className="w-8 h-8 text-rose-400 fill-current" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tighter">
            Mulai Perjalanan <br /> Bebas Finansial Anda.
          </h2>
          <p className="text-blue-200/60 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
            Bergabung dengan ribuan pengguna lainnya yang telah berhasil mengubah cara mereka mengelola uang.
          </p>
        </div>

        <div className="pt-6 relative z-10 flex flex-col items-center gap-6">
          <Link
            href="#"
            className="inline-flex items-center gap-4 px-12 py-5 bg-white text-[#111827] font-black text-lg rounded-lg hover:scale-105 active:scale-95 transition-all shadow-xl group overflow-hidden relative"
          >
            Daftar Sekarang, Gratis
            <Rocket className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-[9px] font-black text-emerald-300/40 uppercase tracking-[0.4em]">Tanpa Kartu Kredit • Batal Kapan Saja</p>
        </div>
      </div>
    </section>
  );
}
