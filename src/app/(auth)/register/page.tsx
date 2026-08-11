"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Rocket } from "lucide-react";
import { registerAction } from "@/app/actions";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-black text-slate-900">Buat Akun</h1>
        <p className="text-xs font-bold text-slate-700">Daftar gratis untuk mulai mengelola aset</p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600 font-bold">{error}</p>
        </div>
      )}

      <form action={registerAction} className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama</label>
            <input
              type="text"
              name="name"
              placeholder="Budi Santoso"
              className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-xs font-bold text-slate-900 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              required
            />
          </div>

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
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Sandi</label>
            <input
              type="password"
              name="password"
              placeholder="Minimal 6 karakter"
              minLength={6}
              className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-xs font-bold text-slate-900 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-slate-900 text-white font-bold text-sm rounded-lg border border-transparent hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          Daftar
          <Rocket className="w-3.5 h-3.5" />
        </button>
      </form>

      <p className="text-center text-xs font-bold text-slate-600">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-black text-purple-600 hover:underline underline-offset-4">Masuk</Link>
      </p>
    </div>
  );
}