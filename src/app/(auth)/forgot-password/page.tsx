"use client";

import { ArrowLeft, Mail, Rocket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate sending reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-500">
          <Mail className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[#1E1B4B]">Periksa Email Anda</h1>
          <p className="text-xs text-[#6B7280] leading-relaxed px-4">
            Kami telah mengirimkan tautan pemulihan kata sandi ke alamat email Anda.
          </p>
        </div>
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:underline"
        >
          <ArrowLeft className="w-3 h-3" /> Kembali ke Masuk
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-bold text-[#1E1B4B]">Lupa Sandi?</h1>
        <p className="text-xs text-[#6B7280]">Masukkan email Anda untuk menerima tautan pemulihan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5 text-left">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Terdaftar</label>
          <input 
            type="email" 
            placeholder="nama@email.com"
            className="w-full px-4 py-2.5 bg-[#FAFAFB] border border-gray-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/5 focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-3 bg-[#1E1B4B] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-indigo-900/10 hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              Kirim Tautan
              <Rocket className="w-3 h-3" />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Kembali ke Masuk
        </Link>
      </div>
    </div>
  );
}
