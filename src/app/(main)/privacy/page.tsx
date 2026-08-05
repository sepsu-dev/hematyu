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
    <div className="bg-transparent">
      <div className="max-w-3xl mx-auto px-6 py-24 space-y-12">
        <div className="space-y-4 border-b-2 border-slate-900/10 pb-12">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Kebijakan Privasi</h1>
          <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Terakhir diperbarui: 11 Mei 2026</p>
        </div>

        <div className="space-y-10">
          {policies.map((policy, i) => (
            <div key={i} className="space-y-4 text-left">
              <h2 className="text-xl font-black text-slate-900">{policy.title}</h2>
              <p className="text-slate-700 font-bold leading-relaxed">
                {policy.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t-2 border-slate-900/10">
          <div className="p-8 bg-white brutal-card space-y-4 text-left">
            <h3 className="font-black text-slate-900">Keamanan Adalah Prioritas Kami</h3>
            <p className="text-sm text-slate-700 font-bold leading-relaxed">
              Jika Anda memiliki kekhawatiran tentang privasi data Anda, tim keamanan kami tersedia di <span className="font-black text-purple-600">privacy@hemat.yu</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
