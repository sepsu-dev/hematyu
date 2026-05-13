import { Zap, MousePointerClick, SearchCheck, TrendingUp } from "lucide-react";
import { Highlighter } from "@/components/highlighter";

export function Workflow() {
  return (
    <section id="demo" className="py-24 px-6 md:px-12 bg-[#F8F9FB] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-6 mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-lg bg-white text-primary text-[9px] font-black uppercase tracking-[0.2em] border border-blue-100">
            <Zap className="w-3 h-3" />
            <span>Cara Kerja Hematyu</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#111827] tracking-tight"><span className="relative inline-block z-0">Tiga Langkah<Highlighter variant={1} className="text-emerald-300/80" strokeWidth={5} /></span> Menuju Finansial Sehat.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {[
            {
              title: "1. Registrasi Akun",
              desc: "Buat akun dengan mudah dan sambungkan dengan layanan favorit Anda.",
              icon: MousePointerClick,
              color: "border-blue-200 text-blue-600",
              tag: "Langkah 01"
            },
            {
              title: "2. Catat Transaksi",
              desc: "Ketik, kirim foto struk, atau input langsung pengeluaran Anda kapan saja.",
              icon: SearchCheck,
              color: "border-primary/20 text-primary",
              tag: "Langkah 02"
            },
            {
              title: "3. Pantau Hasilnya",
              desc: "Dapatkan analisis rutin dan saran personal untuk keuangan yang lebih sehat.",
              icon: TrendingUp,
              color: "border-blue-200 text-blue-600",
              tag: "Langkah 03"
            }
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-6 group">
              <div className={`w-20 h-20 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-sm ${s.color}`}>
                <s.icon className="w-9 h-9" />
              </div>
              <div className="space-y-3">
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{s.tag}</p>
                <h3 className="text-xl md:text-2xl font-bold text-[#111827] group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-[#6B7280] text-sm md:text-base font-medium leading-relaxed px-4">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
