"use client";

import { Rocket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-bold text-[#1E1B4B]">Buat Akun</h1>
        <p className="text-xs text-[#6B7280]">Daftar gratis untuk mulai mengelola aset</p>
      </div>

      <div className="flex flex-col gap-3">
        <button className="flex items-center justify-center gap-3 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-xs text-[#1E1B4B] shadow-sm w-full">
          <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
          Daftar dengan Google
        </button>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-50"></div>
        </div>
        <span className="relative px-3 bg-white text-[9px] font-black text-gray-300 uppercase tracking-widest">Atau</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama</label>
            <input 
              type="text" 
              placeholder="Budi Santoso"
              className="w-full px-4 py-2.5 bg-[#FAFAFB] border border-gray-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/5 focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              placeholder="nama@email.com"
              className="w-full px-4 py-2.5 bg-[#FAFAFB] border border-gray-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/5 focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Sandi</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#FAFAFB] border border-gray-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/5 focus:border-primary outline-none transition-all"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-3 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              Daftar
              <Rocket className="w-3 h-3" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs font-medium text-[#6B7280]">
        Sudah punya akun? {" "}
        <Link href="/login" className="font-black text-primary hover:underline underline-offset-4">Masuk</Link>
      </p>
    </div>
  );
}
