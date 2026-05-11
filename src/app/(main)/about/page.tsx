import { Shield, Target, Users, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-24 space-y-20">
        {/* Header */}
        <div className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-md text-primary text-[10px] font-black uppercase tracking-widest">
            Tentang Kami
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E1B4B] tracking-tight">
            Membangun Standar Baru <br /> Keuangan Digital.
          </h1>
          <p className="text-lg text-[#6B7280] font-medium leading-relaxed max-w-2xl mx-auto">
            Hematyu hadir untuk menjawab tantangan kompleksitas pengelolaan aset di era digital melalui teknologi yang intuitif dan aman.
          </p>
        </div>

        {/* Vision/Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-[#F8FAFF] rounded-3xl border border-indigo-50 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-indigo-100 text-primary shadow-sm">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#1E1B4B]">Misi Kami</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed font-medium">
              Memberdayakan 1 juta individu di Indonesia untuk mencapai kemandirian finansial melalui sistem manajemen aset yang terstruktur dan cerdas.
            </p>
          </div>
          <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-200 text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#1E1B4B]">Nilai Kami</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed font-medium">
              Transparansi, Keamanan, dan Inovasi adalah fondasi dari setiap fitur yang kami kembangkan untuk memastikan data Anda tetap terlindungi.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="prose prose-indigo max-w-none space-y-8">
          <h2 className="text-2xl font-bold text-[#1E1B4B]">Cerita Kami</h2>
          <p className="text-[#6B7280] font-medium leading-relaxed">
            Dimulai dari sebuah garasi kecil di Jakarta pada tahun 2024, tim kami melihat betapa sulitnya melacak pengeluaran di berbagai platform yang tersebar. Kami membangun Hematyu sebagai solusi tunggal untuk mengonsolidasikan semua instrumen finansial Anda.
          </p>
          <p className="text-[#6B7280] font-medium leading-relaxed">
            Hari ini, Hematyu telah berkembang menjadi platform yang dipercaya oleh ribuan profesional untuk membantu mereka mengambil keputusan finansial yang lebih matang setiap harinya.
          </p>
        </div>

        {/* Team Stats */}
        <div className="pt-10 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Pengguna", val: "10K+" },
            { label: "Transaksi", val: "1M+" },
            { label: "Kota", val: "50+" },
            { label: "Partner", val: "12+" },
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <p className="text-2xl font-black text-[#1E1B4B]">{item.val}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
