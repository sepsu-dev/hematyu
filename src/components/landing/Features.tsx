import { Receipt, Banknote, Calendar, Target, BellRing, ShieldCheck, Lock, Check } from "lucide-react";
import { Highlighter } from "@/components/highlighter";

export function Features() {
  return (
    <section id="fitur" className="px-6 md:px-12 py-24 bg-white relative">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111827] tracking-tight">Fitur Lengkap untuk <br /> <span className="relative inline-block z-0">Kesehatan Finansialmu.<Highlighter variant={2} className="text-emerald-300/80" strokeWidth={4} /></span></h2>
          <p className="text-sm md:text-base text-[#6B7280] font-medium leading-relaxed">Semua yang Anda butuhkan untuk mengatur uang dengan mudah dalam satu aplikasi.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Feature 1 - Manajemen Transaksi */}
          <div className="md:col-span-8 p-6 sm:p-10 bg-gradient-to-br from-[#EFF6FF] to-white rounded-2xl space-y-10 group overflow-hidden relative shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-700">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000">
              <Receipt className="w-64 h-64 text-blue-600" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-gray-200 group-hover:rotate-6 transition-transform shadow-sm">
                <Banknote className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-bold text-[#111827]">Catat Transaksi Instan</h3>
                <p className="text-[#6B7280] text-base font-medium max-w-md leading-relaxed">
                  Catat setiap pemasukan dan pengeluaran dalam hitungan detik. Laporan otomatis membantu Anda melacak ke mana perginya uang Anda.
                </p>
              </div>

              <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Pemasukan', val: '+100%' },
                  { label: 'Pengeluaran', val: 'Terkontrol' },
                  { label: 'Tabungan', val: 'Aman' },
                  { label: 'Tagihan', val: 'Lunas' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/80 backdrop-blur-md p-4 rounded-xl border border-gray-100 shadow-sm space-y-2 hover:-translate-y-1 transition-all">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{item.label}</p>
                    <p className="text-xs font-bold text-[#111827]">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 2 - Planning */}
          <div className="md:col-span-4 p-6 sm:p-10 bg-[#FEF08A] rounded-2xl space-y-10 flex flex-col justify-between shadow-sm border border-white relative overflow-hidden group hover:shadow-xl transition-all duration-700">
            <div className="absolute -top-10 -right-10 w-48 h-48 text-amber-700/10 rotate-45 group-hover:rotate-[60deg] transition-transform duration-1000">
              <Calendar className="w-full h-full fill-current" />
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-amber-800/30 group-hover:rotate-6 transition-transform shadow-sm">
              <Target className="w-6 h-6 text-amber-700" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#854D0E]">Rencana Anggaran Cerdas</h3>
              <p className="text-[#854D0E]/80 font-medium text-base leading-relaxed">
                Buat target pengeluaran bulanan. Hematyu akan memberi tahu sisa anggaran agar Anda tidak boros.
              </p>
              <div className="p-4 bg-white/60 backdrop-blur-md rounded-xl space-y-3 border border-white/50">
                <div className="flex justify-between items-center text-[9px] font-black text-amber-900 uppercase tracking-widest">
                  <span>Alokasi Anggaran</span>
                  <span>70%</span>
                </div>
                <div className="h-2.5 w-full bg-white/30 rounded-xl overflow-hidden">
                  <div className="h-full bg-amber-700 w-[70%] rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 - Alerts */}
          <div className="md:col-span-4 p-6 sm:p-10 bg-[#F3F4F6] rounded-2xl space-y-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all duration-700">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
              <BellRing className="w-6 h-6 text-gray-500" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-[#111827]">Pengingat Otomatis</h3>
              <p className="text-[#6B7280] font-medium text-base leading-relaxed">
                Dapatkan notifikasi cerdas jika pengeluaran hampir melebihi batas anggaran yang Anda tentukan.
              </p>
            </div>
          </div>

          {/* Feature 4 - Security */}
          <div className="md:col-span-8 p-6 sm:p-10 bg-[#111827] text-white rounded-2xl flex flex-col md:flex-row items-center gap-12 shadow-2xl border border-white/10 relative overflow-hidden group">
            <div className="flex-1 space-y-6 relative z-10">
              <h3 className="text-3xl font-bold tracking-tight">Aman dan Terenkripsi</h3>
              <p className="text-blue-200/80 font-medium text-base leading-relaxed">
                Data keuangan Anda dilindungi dengan standar enkripsi tinggi. Aman, privat, dan sepenuhnya milik Anda.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" /> Terverifikasi ISO
                </div>
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-[10px] uppercase tracking-widest">
                  <Lock className="w-4 h-4" /> Aman 256-bit
                </div>
              </div>
            </div>

            <div className="flex-1 w-full bg-white/5 backdrop-blur-2xl rounded-2xl p-8 space-y-4 relative z-10 border border-white/10">
              {[
                { label: 'Integrasi Bank', icon: Check },
                { label: 'Sinkronisasi Cloud', icon: Check }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                  <span className="font-semibold text-xs text-blue-100">{item.label}</span>
                  <item.icon className="w-4 h-4 text-emerald-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
