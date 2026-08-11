import { ComingSoonOverlay } from "../_components/coming-soon";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Akun & Rekening</h1>
        <p className="text-xs text-stone-500 mt-0.5">Kelola rekening bank, kartu kredit, dan dompet tunai Anda.</p>
      </div>
      <ComingSoonOverlay
        title="Akun & Rekening"
        description="Manajemen multi-rekening sedang dalam pengembangan. Anda akan bisa menghubungkan rekening bank, e-wallet, dan dompet tunai dalam satu tampilan."
      />
    </div>
  );
}
