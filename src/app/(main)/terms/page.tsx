export default function TermsPage() {
  const sections = [
    {
      title: "1. Ketentuan Penggunaan",
      content: "Dengan mengakses dan menggunakan platform hemat.yu, Anda setuju untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, Anda tidak diperkenankan menggunakan layanan kami."
    },
    {
      title: "2. Akun Pengguna",
      content: "Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun dan kata sandi Anda. Anda setuju untuk menerima tanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda."
    },
    {
      title: "3. Privasi Data",
      content: "Penggunaan data Anda diatur oleh Kebijakan Privasi kami. Kami berkomitmen untuk melindungi informasi finansial Anda dengan standar keamanan perbankan internasional."
    },
    {
      title: "4. Pembatasan Tanggung Jawab",
      content: "hemat.yu adalah alat bantu manajemen keuangan. Kami tidak memberikan saran finansial profesional. Segala keputusan investasi atau pengeluaran adalah tanggung jawab mutlak pengguna."
    }
  ];

  return (
    <div className="bg-transparent">
      <div className="max-w-3xl mx-auto px-6 py-24 space-y-12">
        <div className="space-y-4 border-b-2 border-slate-900/10 pb-12">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Syarat & Ketentuan</h1>
          <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Terakhir diperbarui: 11 Mei 2026</p>
        </div>

        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i} className="space-y-4 text-left">
              <h2 className="text-xl font-black text-slate-900">{section.title}</h2>
              <p className="text-slate-700 font-bold leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t-2 border-slate-900/10">
          <div className="p-8 bg-white brutal-card space-y-4 text-left">
            <h3 className="font-black text-slate-900">Butuh Bantuan?</h3>
            <p className="text-sm text-slate-700 font-bold leading-relaxed">
              Jika Anda memiliki pertanyaan mengenai Syarat & Ketentuan ini, silakan hubungi tim legal kami di <span className="font-black text-purple-600">legal@hemat.yu</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
