import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-[#FAFAFB] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Info */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-md text-primary text-[10px] font-black uppercase tracking-widest">
                Kontak Kami
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E1B4B] tracking-tight">
                Kami Siap <br /> Membantu Anda.
              </h1>
              <p className="text-lg text-[#6B7280] font-medium leading-relaxed max-w-md">
                Punya pertanyaan mengenai fitur atau kemitraan? Tim kami siap memberikan respon cepat dan solusi tepat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: Mail, title: "Email", info: "halo@hematyu.com", sub: "Respon dalam 24 jam" },
                { icon: Phone, title: "Telepon", info: "+62 21 555 0123", sub: "Senin - Jumat, 09:00 - 17:00" },
                { icon: MessageSquare, title: "Live Chat", info: "WhatsApp Bisnis", sub: "Tersedia di Aplikasi" },
                { icon: MapPin, title: "Kantor", info: "Jakarta Selatan", sub: "Indonesia" },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-100 text-primary shadow-sm">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1E1B4B]">{item.title}</h4>
                    <p className="text-sm font-bold text-primary">{item.info}</p>
                    <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-widest">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-indigo-900/5 space-y-8">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#1E1B4B]">Kirim Pesan</h3>
              <p className="text-sm text-[#6B7280] font-medium">Lengkapi formulir di bawah ini untuk memulai percakapan.</p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Depan</label>
                  <input type="text" placeholder="Budi" className="w-full px-4 py-3 bg-[#FAFAFB] border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/5 focus:border-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Belakang</label>
                  <input type="text" placeholder="Santoso" className="w-full px-4 py-3 bg-[#FAFAFB] border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/5 focus:border-primary outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alamat Email</label>
                <input type="email" placeholder="nama@email.com" className="w-full px-4 py-3 bg-[#FAFAFB] border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/5 focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pesan Anda</label>
                <textarea rows={4} placeholder="Bagaimana kami bisa membantu?" className="w-full px-4 py-3 bg-[#FAFAFB] border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/5 focus:border-primary outline-none transition-all resize-none"></textarea>
              </div>
              <button className="w-full py-4 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Kirim Sekarang
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
