"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, Mail, Rocket } from "lucide-react";
import { loginAction } from "@/app/actions";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-black text-slate-900">Masuk ke Akun</h1>
        <p className="text-xs font-bold text-slate-700">Masukkan email untuk mengakses dasbor Anda</p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600 font-bold">{error}</p>
        </div>
      )}

      <form action={loginAction} className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="nama@email.com"
              className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-xs font-bold text-slate-900 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sandi</label>
              <Link href="/forgot-password" className="text-[9px] font-black text-purple-600 uppercase tracking-widest hover:underline">Lupa?</Link>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-xs font-bold text-slate-900 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 cursor-pointer ml-1">
            <input type="checkbox" name="remember" className="accent-purple-600" />
            Ingat saya selama 30 hari
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-slate-900 text-white font-bold text-sm rounded-lg border border-transparent hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          Masuk
          <Rocket className="w-3.5 h-3.5" />
        </button>
      </form>

      <p className="text-center text-xs font-bold text-slate-600">
        Belum punya akun?{" "}
        <Link href="/register" className="font-black text-purple-600 hover:underline underline-offset-4">Daftar</Link>
      </p>

      <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
        <p className="text-[10px] font-bold text-emerald-700">
          Demo: jason.david@example.com / password123
        </p>
      </div>
    </div>
  );
}