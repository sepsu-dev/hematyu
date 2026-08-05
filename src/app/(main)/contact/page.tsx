import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Info */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-200 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_#111827] text-slate-900 text-[10px] font-black uppercase tracking-widest">
                Kontak Kami
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Kami Siap <br /> Membantu Anda.
              </h1>
              <p className="text-lg text-slate-700 font-bold leading-relaxed max-w-md">
                Ada pertanyaan atau butuh bantuan dengan akun Anda? Tim support kami selalu siap sedia membantu Anda mewujudkan keuangan yang lebih teratur.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: Mail, title: "Email", info: "halo@hemat.yu", sub: "Respon dalam 24 jam" },
                { icon: Phone, title: "Telepon", info: "+62 21 555 0123", sub: "Senin - Jumat, 09:00 - 17:00" },
                { icon: MessageSquare, title: "Live Chat", info: "WhatsApp Bisnis", sub: "Tersedia di Aplikasi" },
                { icon: MapPin, title: "Kantor", info: "Jakarta Selatan", sub: "Indonesia" },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_#111827]">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{item.title}</h4>
                    <p className="text-sm font-bold text-purple-600">{item.info}</p>
                    <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-white p-10 brutal-card space-y-8">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Hubungi Kami Secara Langsung</h3>
              <p className="text-sm text-slate-700 font-bold">Kirim pesan Anda dan tim kami akan merespons dalam waktu kurang dari 24 jam.</p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Depan</label>
                  <input type="text" placeholder="Budi" className="w-full px-4 py-3 bg-white border border-slate-900 rounded-full text-sm font-bold text-slate-900 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Belakang</label>
                  <input type="text" placeholder="Santoso" className="w-full px-4 py-3 bg-white border border-slate-900 rounded-full text-sm font-bold text-slate-900 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alamat Email</label>
                <input type="email" placeholder="nama@email.com" className="w-full px-4 py-3 bg-white border border-slate-900 rounded-full text-sm font-bold text-slate-900 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pesan Anda</label>
                <textarea rows={4} placeholder="Bagaimana kami bisa membantu?" className="w-full px-4 py-3 bg-white border border-slate-900 rounded-xl text-sm font-bold text-slate-900 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none"></textarea>
              </div>
              <button className="w-full py-4 bg-primary text-white font-bold text-sm rounded-full border border-primary hover:bg-primary/95 transition-colors cursor-pointer">
                Kirim Sekarang
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
