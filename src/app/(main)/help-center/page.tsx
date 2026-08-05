import { Search, Book, MessageCircle, HelpCircle, FileText } from "lucide-react";
import Link from "next/link";

export default function HelpCenterPage() {
  const categories = [
    { icon: Book, title: "Memulai", count: 12, desc: "Panduan langkah demi langkah untuk mengatur akun Anda.", color: "bg-blue-100" },
    { icon: HelpCircle, title: "FAQ", count: 24, desc: "Pertanyaan yang paling sering diajukan oleh pengguna kami.", color: "bg-yellow-100" },
    { icon: MessageCircle, title: "Dukungan", count: 5, desc: "Cara menghubungi tim dukungan teknis kami.", color: "bg-purple-100" },
    { icon: FileText, title: "Billing", count: 8, desc: "Informasi mengenai paket langganan dan pembayaran.", color: "bg-emerald-100" },
  ];

  return (
    <div className="bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-24 space-y-20">
        {/* Search Header */}
        <div className="space-y-8 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Pusat Bantuan</h1>
          <p className="text-lg text-slate-700 font-bold leading-relaxed">
            Cari panduan cepat, jawaban atas pertanyaan umum, atau tips trik memaksimalkan fitur pencatatan otomatis hemat.yu.
          </p>
          <div className="relative group max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-slate-900 transition-colors w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari bantuan (misal: cara ganti email)"
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-900 rounded-full focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-bold text-slate-900"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Link key={i} href="#" className="p-8 bg-white brutal-card hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#111827] transition-all group">
              <div className="space-y-6">
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_#111827] group-hover:scale-105 transition-transform`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2 text-left">
                  <h3 className="text-xl font-black text-slate-900">{cat.title}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-bold">{cat.desc}</p>
                </div>
                <div className="pt-4 border-t-2 border-slate-900/10 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>{cat.count} Artikel</span>
                  <span className="text-purple-600 group-hover:translate-x-1 transition-transform">Lihat →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="brutal-card bg-white p-12 text-center space-y-8 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Tidak menemukan jawaban?</h2>
            <p className="text-slate-700 font-bold max-w-lg mx-auto leading-relaxed">
              Tim dukungan kami tersedia 24/7 untuk membantu Anda menyelesaikan kendala teknis maupun administratif.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact" className="px-8 py-3.5 bg-primary text-white font-bold text-sm rounded-full border border-primary hover:bg-primary/95 transition-colors">Hubungi Dukungan</Link>
              <Link href="#" className="px-8 py-3.5 bg-white text-slate-900 font-bold text-sm rounded-full border border-slate-900 hover:bg-slate-50 transition-colors">Kirim Tiket</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
