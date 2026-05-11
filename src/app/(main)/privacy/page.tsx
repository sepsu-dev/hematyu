export default function PrivacyPage() {
  const policies = [
    {
      title: "Informasi yang Kami Kumpulkan",
      desc: "Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, termasuk nama, alamat email, dan data transaksi keuangan yang Anda masukkan secara manual atau melalui integrasi."
    },
    {
      title: "Penggunaan Informasi",
      desc: "Informasi Anda digunakan semata-mata untuk menyediakan layanan analisis finansial, mempersonalisasi pengalaman Anda, dan meningkatkan keamanan akun Anda."
    },
    {
      title: "Keamanan Data",
      desc: "Kami menggunakan enkripsi AES-256 tingkat militer untuk melindungi data Anda saat istirahat dan TLS untuk melindungi data Anda saat dalam perjalanan."
    },
    {
      title: "Berbagi Informasi",
      desc: "Kami tidak menjual, menyewakan, atau membagikan data finansial pribadi Anda kepada pihak ketiga untuk tujuan pemasaran tanpa persetujuan eksplisit dari Anda."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-24 space-y-12">
        <div className="space-y-4 border-b border-gray-100 pb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E1B4B] tracking-tight">Kebijakan Privasi</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Terakhir diperbarui: 11 Mei 2026</p>
        </div>

        <div className="space-y-10">
          {policies.map((policy, i) => (
            <div key={i} className="space-y-4">
              <h2 className="text-xl font-bold text-[#1E1B4B]">{policy.title}</h2>
              <p className="text-[#6B7280] font-medium leading-relaxed">
                {policy.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t border-gray-100">
          <div className="p-8 bg-[#F8FAFF] rounded-3xl border border-indigo-50 space-y-4">
            <h3 className="font-bold text-[#1E1B4B]">Keamanan Adalah Prioritas Kami</h3>
            <p className="text-sm text-[#6B7280] font-medium leading-relaxed">
              Jika Anda memiliki kekhawatiran tentang privasi data Anda, tim keamanan kami tersedia di <span className="font-bold text-primary">privacy@hematyu.com</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
