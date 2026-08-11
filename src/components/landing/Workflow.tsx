import { Zap, MousePointerClick, MessageSquareCode, BarChart3 } from "lucide-react";

export function Workflow() {
  return (
    <section id="demo" className="py-24 px-6 md:px-12 bg-[#FAF6F0] relative overflow-hidden border-t border-stone-900/5">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E35B30]/10 text-[#E35B30] text-[10px] font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Cara Kerja hemat.yu</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
            Tiga Langkah Praktis <span className="text-[#E35B30]">Mulai Berhemat</span>
          </h2>
          <p className="text-stone-600 text-sm md:text-base font-semibold max-w-lg mx-auto">
            Hanya butuh beberapa detik untuk menyiapkan asisten keuangan pribadi Anda tanpa ribet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "1. Registrasi Akun",
              desc: "Buat akun gratis Anda menggunakan Google atau email hanya dalam waktu 10 detik.",
              icon: MousePointerClick,
              color: "bg-blue-100 border-stone-900 text-stone-900",
              tag: "Langkah 01"
            },
            {
              title: "2. Catat Transaksi",
              desc: "Ketik pemasukan dan pengeluaran Anda dengan formulir input yang ringkas.",
              icon: MessageSquareCode,
              color: "bg-orange-100 border-stone-900 text-stone-900",
              tag: "Langkah 02"
            },
            {
              title: "3. Evaluasi Grafik",
              desc: "Analisis grafik keuangan real-time dan evaluasi sisa saldo Anda secara instan.",
              icon: BarChart3,
              color: "bg-yellow-100 border-stone-900 text-stone-900",
              tag: "Langkah 03"
            }
          ].map((s, i) => (
            <div key={i} className="sketch-card bg-[#FAF6F0] p-8 flex flex-col items-center text-center space-y-6">
              <div className={`w-16 h-16 rounded-2xl border-1.5 flex items-center justify-center ${s.color}`}>
                <s.icon className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] font-extrabold text-[#E35B30] uppercase tracking-widest">{s.tag}</span>
                <h3 className="text-lg font-extrabold text-stone-900">{s.title}</h3>
                <p className="text-stone-600 text-xs font-semibold leading-relaxed px-2">
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
