import { Star } from "lucide-react";
import { Highlighter } from "@/components/highlighter";

export function Testimonials() {
  return (
    <section className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] tracking-tight">Apa <span className="relative inline-block z-0">Kata Mereka.<Highlighter variant={2} className="text-amber-400/60" strokeWidth={5} /></span></h2>
          <div className="w-16 h-1 bg-primary rounded-xl mx-auto opacity-10"></div>
        </div>

        <div className="grid grid-cols-1 md:flex-row md:flex gap-8">
          {[
            { name: "Andi Saputra", text: "Aplikasinya gampang banget dipake! Sekarang aku tahu pasti ke mana aja gajiku tiap bulan. Bye-bye pengeluaran ga jelas!", job: "Karyawan Swasta", color: "bg-[#EFF6FF]" },
            { name: "Siska Amelia", text: "Suka banget sama fitur target budgetnya. Notifikasinya sangat membantu buat ngerem kalau lagi boros jajan.", job: "Freelancer", color: "bg-[#FEF08A]/20" },
            { name: "Rian Hidayat", text: "Laporannya visual dan mudah dibaca. Mengatur keuangan keluarga jadi jauh lebih praktis dan transparan.", job: "Wiraswasta", color: "bg-[#F3F4F6]" }
          ].map((r, i) => (
            <div key={i} className={`p-6 sm:p-10 rounded-2xl flex-1 ${r.color} shadow-sm border border-white flex flex-col justify-between hover:-translate-y-2 transition-all duration-500 hover:shadow-xl group`}>
              <div className="space-y-6 text-left">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-base font-medium text-[#111827] italic leading-relaxed">"{r.text}"</p>
              </div>
              <div className="flex items-center gap-4 mt-10">
                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.name}`} className="w-10 h-10 rounded-lg border-2 border-white shadow-xl group-hover:scale-110 transition-transform" alt="avatar" />
                <div className="text-left">
                  <h3 className="font-bold text-xs text-[#111827]">{r.name}</h3>
                  <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{r.job}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
