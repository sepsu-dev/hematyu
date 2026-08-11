import { ComingSoonOverlay } from "../_components/coming-soon";

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Rencana Menabung</h1>
        <p className="text-xs text-stone-500 mt-0.5">Tentukan mimpi finansial Anda dan pantau tabungan secara berkala.</p>
      </div>
      <ComingSoonOverlay
        title="Rencana Menabung"
        description="Fitur target tabungan sedang dalam pengembangan. Anda akan bisa membuat target finansial, memantau progres, dan mendapat saran otomatis dari AI."
      />
    </div>
  );
}
