import { Wallet, Star, ShieldAlert, CheckCircle2 } from "lucide-react";

export function Pricing() {
  return (
    <section id="harga" className="py-24 px-6 md:px-12 bg-[#FAF6F0] relative overflow-hidden border-t border-stone-900/5">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
            Akses Penuh <span className="text-[#E35B30]">Tanpa Biaya</span>
          </h2>
          <p className="text-stone-600 text-sm md:text-base font-semibold leading-relaxed">
            Semua fitur unggulan hemat.yu dapat Anda gunakan secara gratis untuk membantu mengelola keuangan harian agar lebih hemat dan terencana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Card 1 */}
          <div className="sketch-card bg-[#FAF6F0] p-8 flex flex-col justify-between text-left">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center border-1.5 border-stone-900">
                <Wallet className="w-6 h-6 text-[#E35B30]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-stone-900">Catat via WhatsApp</h3>
                <p className="text-[10px] font-bold text-[#E35B30] uppercase tracking-wider">Gratis Selamanya</p>
              </div>
              <ul className="space-y-3.5 pt-2">
                {[
                  "Chat bot AI pencatatan instan",
                  "Pemilah kategori otomatis",
                  "Ringkasan pengeluaran harian",
                  "Dukungan WhatsApp 24/7"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs font-semibold text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-stone-900 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 2 */}
          <div className="sketch-card bg-[#FAF6F0] p-8 flex flex-col justify-between text-left relative overflow-hidden">
            <div className="absolute top-6 right-6 px-3 py-1 bg-[#E35B30]/10 text-[#E35B30] text-[9px] font-extrabold border border-[#E35B30]/20 rounded-full uppercase tracking-wider">Terpopuler</div>
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center border-1.5 border-stone-900">
                <Star className="w-6 h-6 text-blue-600 fill-current" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-stone-900">Dashboard Web</h3>
                <p className="text-[10px] font-bold text-[#E35B30] uppercase tracking-wider">Gratis Selamanya</p>
              </div>
              <ul className="space-y-3.5 pt-2">
                {[
                  "Visualisasi grafik arus kas",
                  "Rekap mingguan & bulanan",
                  "Ekspor data CSV / Excel",
                  "Manajemen kategori anggaran"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs font-semibold text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-stone-900 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 3 */}
          <div className="sketch-card bg-[#FAF6F0] p-8 flex flex-col justify-between text-left">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center border-1.5 border-stone-900">
                <ShieldAlert className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-stone-900">Fitur Cerdas AI</h3>
                <p className="text-[10px] font-bold text-[#E35B30] uppercase tracking-wider">Gratis Selamanya</p>
              </div>
              <ul className="space-y-3.5 pt-2">
                {[
                  "Saran finansial otomatis",
                  "Deteksi pemborosan jajan",
                  "Fitur target tabungan",
                  "Sistem pengingat cerdas harian"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs font-semibold text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-stone-900 shrink-0" />
                    <span>{item}</span>
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
