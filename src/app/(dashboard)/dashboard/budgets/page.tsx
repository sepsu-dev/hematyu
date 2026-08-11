import { ComingSoonOverlay } from "../_components/coming-soon";

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Anggaran Bulanan</h1>
        <p className="text-xs text-stone-500 mt-0.5">Buat batasan belanja untuk menjaga pengeluaran bulanan Anda.</p>
      </div>
      <ComingSoonOverlay
        title="Anggaran Bulanan"
        description="Fitur budget limit per kategori sedang dalam pengembangan. Anda akan bisa menetapkan batas pengeluaran bulanan dan mendapat notifikasi ketika hampir habis."
      />
    </div>
  );
}
