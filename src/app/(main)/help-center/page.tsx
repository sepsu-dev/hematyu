import { Search, Book, MessageCircle, HelpCircle, FileText } from "lucide-react";
import Link from "next/link";

export default function HelpCenterPage() {
  const categories = [
    { icon: Book, title: "Memulai", count: 12, desc: "Panduan langkah demi langkah untuk mengatur akun Anda." },
    { icon: HelpCircle, title: "FAQ", count: 24, desc: "Pertanyaan yang paling sering diajukan oleh pengguna kami." },
    { icon: MessageCircle, title: "Dukungan", count: 5, desc: "Cara menghubungi tim dukungan teknis kami." },
    { icon: FileText, title: "Billing", count: 8, desc: "Informasi mengenai paket langganan dan pembayaran." },
  ];

  return (
    <div className="bg-[#FAFAFB] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-24 space-y-20">
        {/* Search Header */}
        <div className="space-y-8 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E1B4B] tracking-tight">Pusat Bantuan</h1>
          <p className="text-lg text-[#6B7280] font-medium leading-relaxed">
            Temukan jawaban atas pertanyaan Anda atau hubungi tim kami untuk bantuan lebih lanjut.
          </p>
          <div className="relative group max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari bantuan (misal: cara ganti email)"
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Link key={i} href="#" className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <cat.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#1E1B4B]">{cat.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed font-medium">{cat.desc}</p>
                </div>
                <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>{cat.count} Artikel</span>
                  <span className="text-primary group-hover:translate-x-1 transition-transform">Lihat →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="bg-[#1E1B4B] p-12 rounded-[3rem] text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full"></div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Tidak menemukan jawaban?</h2>
            <p className="text-indigo-200/60 font-medium max-w-lg mx-auto leading-relaxed">
              Tim dukungan kami tersedia 24/7 untuk membantu Anda menyelesaikan kendala teknis maupun administratif.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact" className="px-8 py-3.5 bg-white text-[#1E1B4B] font-bold text-sm rounded-xl hover:scale-105 transition-all">Hubungi Dukungan</Link>
              <Link href="#" className="px-8 py-3.5 bg-white/10 text-white font-bold text-sm rounded-xl border border-white/10 hover:bg-white/20 transition-all">Kirim Tiket</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
