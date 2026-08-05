import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF6F0] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden text-slate-900">
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px] opacity-100"></div>

      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <Link href="/" className="group">
            <div className="flex items-center justify-center h-14 transition-transform group-hover:scale-105 duration-300">
              <Logo className="h-full" />
            </div>
          </Link>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">hemat.yu</h2>
            <p className="text-xs font-bold text-slate-700">Asisten Keuangan Pintar & Otomatis</p>
          </div>
        </div>

        <div className="bg-white p-8 brutal-card">
          {children}
        </div>

        <p className="text-center text-[10px] font-black text-slate-900/60 uppercase tracking-widest">
          © {new Date().getFullYear()} hemat.yu • Keamanan Terjamin
        </p>
      </div>
    </div>
  );
}
