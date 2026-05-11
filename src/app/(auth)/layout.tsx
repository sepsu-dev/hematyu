import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFB] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Background Sophistication */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] -z-10 rounded-full"></div>

      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <Link href="/" className="group">
            <div className="flex items-center justify-center h-14 transition-transform group-hover:scale-105 duration-300">
              <Logo className="h-full" />
            </div>
          </Link>
          <div className="space-y-1.5">
            <h2 className="text-xl font-black tracking-tight text-[#1E1B4B]">Hematyu</h2>
            <p className="text-xs font-medium text-[#6B7280]">Solusi Manajemen Keuangan Modern</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
          {children}
        </div>

        <p className="text-center text-[10px] font-medium text-gray-400 uppercase tracking-widest">
          © {new Date().getFullYear()} Hematyu • Keamanan Terjamin
        </p>
      </div>
    </div>
  );
}
