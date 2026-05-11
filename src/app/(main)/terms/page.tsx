export default function TermsPage() {
  const sections = [
    {
      title: "1. Ketentuan Penggunaan",
      content: "Dengan mengakses dan menggunakan platform Hematyu, Anda setuju untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, Anda tidak diperkenankan menggunakan layanan kami."
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
      content: "Hematyu adalah alat bantu manajemen keuangan. Kami tidak memberikan saran finansial profesional. Segala keputusan investasi atau pengeluaran adalah tanggung jawab mutlak pengguna."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-24 space-y-12">
        <div className="space-y-4 border-b border-gray-100 pb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E1B4B] tracking-tight">Syarat & Ketentuan</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Terakhir diperbarui: 11 Mei 2026</p>
        </div>

        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i} className="space-y-4">
              <h2 className="text-xl font-bold text-[#1E1B4B]">{section.title}</h2>
              <p className="text-[#6B7280] font-medium leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t border-gray-100">
          <div className="p-8 bg-[#FAFAFB] rounded-3xl border border-gray-100 space-y-4">
            <h3 className="font-bold text-[#1E1B4B]">Butuh Bantuan?</h3>
            <p className="text-sm text-[#6B7280] font-medium leading-relaxed">
              Jika Anda memiliki pertanyaan mengenai Syarat & Ketentuan ini, silakan hubungi tim legal kami di <span className="font-bold text-primary">legal@hematyu.com</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
