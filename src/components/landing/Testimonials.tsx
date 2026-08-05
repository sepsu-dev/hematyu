import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-24 px-6 md:px-12 bg-[#FAF6F0] relative overflow-hidden border-t border-stone-900/5">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
            Apa Kata <span className="text-[#E35B30]">Pengguna Kami</span>
          </h2>
          <p className="text-stone-600 text-sm md:text-base font-semibold leading-relaxed">
            Pengalaman nyata dari mereka yang telah berhasil menata finansial pribadi bersama hemat.yu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Andi Saputra",
              text: "Fitur pencatatan WhatsApp AI-nya sangat mempermudah keseharian saya. Cukup kirim chat nominal belanjaan langsung teratur rapi di dashboard.",
              job: "Karyawan Swasta",
              color: "bg-blue-100"
            },
            {
              name: "Siska Amelia",
              text: "Sebagai freelancer, memisahkan pengeluaran pribadi dan proyek seringkali rumit. Fitur kategori budget hemat.yu memecahkan masalah ini dengan instan.",
              job: "Freelancer",
              color: "bg-yellow-100"
            },
            {
              name: "Rian Hidayat",
              text: "Mengontrol keuangan keluarga jadi lebih transparan dan mudah dipantau bersama istri. Pengingat limit anggarannya sangat membantu mencegah pemborosan.",
              job: "Wiraswasta",
              color: "bg-orange-100"
            }
          ].map((r, i) => (
            <div key={i} className="sketch-card bg-[#FAF6F0] p-8 flex flex-col justify-between text-left h-full">
              <div className="space-y-6">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-stone-700 italic leading-relaxed">
                  "{r.text}"
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8 pt-4 border-t border-stone-900/5">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.name}`}
                  className={`w-9 h-9 rounded-xl border border-stone-900/10 ${r.color}`}
                  alt={r.name}
                />
                <div>
                  <h3 className="font-extrabold text-xs text-stone-900">{r.name}</h3>
                  <p className="text-[9px] font-extrabold text-[#E35B30] uppercase tracking-wider">{r.job}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
