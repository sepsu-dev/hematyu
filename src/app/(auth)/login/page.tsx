"use client";

import { Lock, Mail, Rocket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-black text-slate-900">Masuk ke Akun</h1>
        <p className="text-xs font-bold text-slate-700">Masukkan email untuk mengakses dasbor Anda</p>
      </div>

      <div className="flex flex-col gap-3">
        <button className="flex items-center justify-center gap-3 py-3 border border-slate-900 rounded-full hover:bg-slate-50 transition-all font-bold text-sm text-slate-900 w-full bg-white">
          <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
          Lanjutkan dengan Google
        </button>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-900/10"></div>
        </div>
        <span className="relative px-3 bg-white text-[9px] font-black text-slate-500 uppercase tracking-widest">Or</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              placeholder="nama@email.com"
              className="w-full px-4 py-2.5 bg-white border border-slate-900 rounded-full text-xs font-bold text-slate-900 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
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
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white border border-slate-900 rounded-full text-xs font-bold text-slate-900 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-3.5 bg-slate-900 text-white font-bold text-sm rounded-full border border-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              Masuk
              <Rocket className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs font-bold text-slate-600">
        Belum punya akun? {" "}
        <Link href="/register" className="font-black text-purple-600 hover:underline underline-offset-4">Daftar</Link>
      </p>
    </div>
  );
}
