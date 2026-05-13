import { Receipt, Banknote, Calendar, Target, BellRing, ShieldCheck, Lock, Check, MessageSquare, Camera, MousePointer2, Zap, Heart, ArrowRight, TrendingUp } from "lucide-react";
import { Highlighter } from "@/components/highlighter";

export function Features() {
  return (
    <section id="fitur" className="px-6 md:px-12 py-24 bg-white relative">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111827] tracking-tight">Solusi Lengkap untuk <br /> <span className="relative inline-block z-0">Kesehatan Finansial Anda.<Highlighter variant={2} className="text-emerald-300/80" strokeWidth={4} /></span></h2>
          <p className="text-sm md:text-base text-[#6B7280] font-medium leading-relaxed">Dari pencatatan harian hingga perencanaan masa depan, semua dikelola secara otomatis dan cerdas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Feature 1 - Multi-Input */}
          <div className="md:col-span-8 p-8 sm:p-12 bg-gradient-to-br from-[#EFF6FF] to-white rounded-3xl space-y-12 group overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] hover:border-blue-100 transition-all duration-700">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000">
              <MessageSquare className="w-64 h-64 text-blue-600" />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-gray-100 group-hover:rotate-6 transition-transform shadow-sm">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-bold text-[#111827] tracking-tight">Pencatatan Tanpa Repot</h3>
                <p className="text-[#6B7280] text-base md:text-lg font-medium max-w-xl leading-relaxed">
                  Pilih metode yang paling nyaman bagi Anda. Semua transaksi akan tercatat otomatis dengan bantuan asisten AI.
                </p>
              </div>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'WhatsApp', icon: MessageSquare, desc: 'Chat "Makan 50rb"', color: 'bg-blue-50' },
                  { label: 'Scan Struk', icon: Camera, desc: 'Foto struk belanja', color: 'bg-emerald-50' },
                  { label: 'Manual', icon: MousePointer2, desc: 'Input presisi & cepat', color: 'bg-amber-50' },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 hover:-translate-y-2 transition-all duration-500 hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-4 h-4 text-[#111827]" />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                    </div>
                    <p className="text-xs font-bold text-[#111827]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 2 - Category Budgeting */}
          <div className="md:col-span-4 p-8 bg-[#FFFBEB] rounded-3xl space-y-8 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-amber-100/50 relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(251,191,36,0.1)] transition-all duration-700">
            <div className="absolute -top-10 -right-10 w-48 h-48 text-amber-700/10 rotate-45 group-hover:rotate-[60deg] transition-transform duration-1000">
              <Calendar className="w-full h-full fill-current" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-amber-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Banknote className="w-6 h-6 text-amber-600" />
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#854D0E] tracking-tight">Anggaran Per Kategori</h3>
                <p className="text-[#854D0E]/80 font-medium text-sm leading-relaxed">
                  Atur batas pengeluaran spesifik untuk makan, transportasi, atau hiburan.
                </p>
              </div>
              <div className="p-5 bg-white rounded-2xl space-y-4 border border-amber-100/50 shadow-sm">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-amber-900 uppercase tracking-widest">
                    <span>Makan & Minum</span>
                    <span>65%</span>
                  </div>
                  <div className="h-2 w-full bg-amber-50 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[65%] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.3)]"></div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-amber-900 uppercase tracking-widest">
                    <span>Transportasi</span>
                    <span>40%</span>
                  </div>
                  <div className="h-2 w-full bg-amber-50 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 w-[40%] rounded-full shadow-[0_0_8px_rgba(251,191,36,0.2)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 - Asisten Finansial Personal */}
          <div className="md:col-span-4 p-8 bg-white rounded-3xl space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Zap className="w-6 h-6 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#111827] tracking-tight">Asisten Keuangan Personal</h3>
              <p className="text-[#6B7280] font-medium text-sm leading-relaxed">
                Terima tips cerdas dan pengingat harian yang disesuaikan agar kondisi keuangan Anda tetap sehat.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-amber-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Pelajari Lebih Lanjut <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Feature 5 - Tantangan Menabung */}
          <div className="md:col-span-4 p-8 bg-[#F0FDF4] rounded-3xl space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-emerald-100/50 relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] transition-all duration-700">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-emerald-100 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#065F46] tracking-tight">Tantangan Menabung</h3>
              <p className="text-[#065F46]/80 font-medium text-sm leading-relaxed">
                Ikuti rencana terukur untuk dana darurat atau impian finansial Anda lainnya.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Mulai Menabung <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Feature 8 - Analytics */}
          <div className="md:col-span-4 p-8 bg-blue-600 text-white rounded-3xl space-y-6 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform duration-700">
              <TrendingUp className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight">Laporan Visual AI</h3>
                <p className="text-blue-100 font-medium text-sm leading-relaxed">
                  Visualisasi data yang cerdas membantu Anda memahami arus kas dalam satu kedipan mata.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
