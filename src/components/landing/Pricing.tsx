import { Wallet, Calendar, Infinity, CheckCircle2 } from "lucide-react";
import { Highlighter } from "@/components/highlighter";

export function Pricing() {
  return (
    <section id="harga" className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#111827] tracking-tight">Pilih Paket yang <span className="relative inline-block z-0">Sesuai.<Highlighter variant={5} className="text-emerald-400/40" strokeWidth={3} /></span></h2>
          <p className="text-[#6B7280] text-base md:text-lg font-medium max-w-lg mx-auto">Mulai dari yang gratis, tingkatkan saat Anda siap mengatur keuangan lebih pro.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-2xl border-2 border-primary/20 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-all duration-500 hover:shadow-xl group">
            <div className="text-left space-y-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-gray-200 group-hover:rotate-6 transition-transform shadow-sm">
                <Wallet className="w-6 h-6 text-gray-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#111827]">Pemula</h3>
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Selalu Gratis</p>
              </div>
              <div className="text-3xl font-bold text-[#111827]">Rp 0</div>
              <ul className="space-y-3 pt-2">
                {["Pencatatan via Chat", "3 Kategori Anggaran", "Laporan Dasar", "Kalkulator Zakat"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-[11px] font-bold text-[#6B7280]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Monthly Plan */}
          <div className="bg-white p-8 rounded-2xl border-2 border-primary/20 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-all duration-500 relative overflow-hidden hover:shadow-xl group">
            <div className="absolute top-6 right-6 px-4 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg uppercase tracking-widest shadow-md z-20">Populer</div>
            <div className="text-left space-y-6 relative z-10">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-primary/20 group-hover:rotate-6 transition-transform shadow-sm">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#111827]">Pro</h3>
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Langganan Bulanan</p>
              </div>
              <div className="text-3xl font-bold text-[#111827]">Rp 29k <span className="text-sm text-gray-600">/bln</span></div>
              <ul className="space-y-3 pt-2">
                {["Chat AI Tanpa Batas", "Pemindaian Struk (OCR)", "Analisis Mendalam", "Prediksi Pengeluaran"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-[11px] font-bold text-[#6B7280]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Lifetime Plan */}
          <div className="bg-white p-8 rounded-2xl border-2 border-primary/20 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-all duration-500 relative overflow-hidden hover:shadow-xl group">
            <div className="text-left space-y-6 relative z-10">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-gray-200 group-hover:rotate-6 transition-transform shadow-sm">
                <Infinity className="w-8 h-8 text-amber-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#111827]">Seumur Hidup</h3>
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Sekali Bayar</p>
              </div>
              <div className="text-3xl font-bold text-[#111827]">Rp 499k</div>
              <ul className="space-y-3 pt-2">
                {["Berbagi Akun Keluarga", "Mode Syariah Lengkap", "Deteksi Produk Halal", "Prioritas Layanan"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-[11px] font-bold text-[#6B7280]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
