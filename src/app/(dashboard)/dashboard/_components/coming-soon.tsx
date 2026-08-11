import { Clock } from "lucide-react";

interface ComingSoonOverlayProps {
  title: string;
  description?: string;
}

export function ComingSoonOverlay({ title, description }: ComingSoonOverlayProps) {
  return (
    <div className="relative min-h-[400px] flex items-center justify-center">
      {/* Blurred preview background */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none select-none opacity-20">
        <div className="h-full w-full bg-[repeating-linear-gradient(45deg,#E7DED4_0,#E7DED4_1px,transparent_0,transparent_50%)] bg-[length:8px_8px]" />
      </div>

      {/* Coming soon card */}
      <div className="relative z-10 sketch-card bg-white p-10 flex flex-col items-center text-center gap-5 max-w-sm mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center">
          <Clock className="w-7 h-7 text-purple-500" />
        </div>
        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-lg font-extrabold text-stone-900">{title}</h2>
            <span className="px-2 py-0.5 text-[9px] bg-purple-50 text-purple-600 rounded font-black border border-purple-200 uppercase tracking-widest">
              Soon
            </span>
          </div>
          <p className="text-xs text-stone-500 font-semibold leading-relaxed">
            {description ?? "Fitur ini sedang dalam pengembangan. Nantikan update berikutnya!"}
          </p>
        </div>
        <div className="w-full h-px bg-[#E7DED4]" />
        <p className="text-[10px] text-stone-400 font-semibold">
          Untuk saat ini, gunakan menu <span className="font-black text-stone-600">Dashboard</span> untuk mencatat transaksi Anda.
        </p>
      </div>
    </div>
  );
}
