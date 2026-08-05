import { Shield, Target, Users, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-transparent">
      <div className="max-w-4xl mx-auto px-6 py-24 space-y-20">
        {/* Header */}
        <div className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-200 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_#111827] text-slate-900 text-[10px] font-black uppercase tracking-widest">
            Tentang Kami
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Misi Kami Mewujudkan <br /> Kesehatan Finansial Anda.
          </h1>
          <p className="text-lg text-slate-700 font-bold leading-relaxed max-w-2xl mx-auto">
            hemat.yu hadir untuk menyederhanakan pengelolaan keuangan harian Anda melalui asisten cerdas yang bekerja secara instan dan otomatis.
          </p>
        </div>

        {/* Vision/Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white brutal-card space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center border border-purple-200 text-purple-700 shadow-sm">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Misi Kami</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-bold">
              Kami percaya semua orang berhak atas pengelolaan uang yang bebas stres. hemat.yu dirancang untuk mendemokratisasi pencatatan keuangan agar dapat diakses siapa saja, kapan saja, langsung dari aplikasi favorit Anda.
            </p>
          </div>
          <div className="p-8 bg-white brutal-card space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200 text-blue-700 shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Nilai Kami</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-bold">
              Privasi dan keamanan data Anda adalah prioritas mutlak kami. Kami menerapkan enkripsi kelas dunia untuk menjaga setiap detail transaksi Anda tetap privat, aman, dan tanpa biaya tersembunyi.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="prose prose-indigo max-w-none space-y-8">
          <h2 className="text-2xl font-black text-slate-900">Bagaimana hemat.yu Dimulai</h2>
          <p className="text-slate-700 font-bold leading-relaxed">
            hemat.yu lahir dari rasa frustrasi yang sama: lelah mencatat pengeluaran secara manual di spreadsheet atau aplikasi keuangan yang rumit dan penuh iklan. Kami menyadari bahwa asisten keuangan terbaik adalah asisten yang selalu siap sedia di dalam saku celana Anda.
          </p>
          <p className="text-slate-700 font-bold leading-relaxed">
            Dimulai dari integrasi pencatatan cerdas lewat WhatsApp dan struk belanjaan, kini hemat.yu berkembang menjadi asisten andalan bagi lebih dari 10.000 profesional muda untuk mengontrol pengeluaran dan menabung secara konsisten.
          </p>
        </div>

        {/* Team Stats */}
        <div className="pt-10 border-t-2 border-slate-900/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Pengguna Setia", val: "10K+" },
            { label: "Transaksi Terproses", val: "1M+" },
            { label: "Kabupaten & Kota", val: "50+" },
            { label: "Partner Keuangan", val: "12+" },
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <p className="text-2xl font-black text-slate-900">{item.val}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
