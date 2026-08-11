"use client";

import Link from "next/link";
import { Star, ShieldAlert, Heart, Calendar, Compass, AppWindow } from "lucide-react";

// ─── Cartoon Leaning Character SVG (Top-Right Features) ──────────────────────────────
const LeaningCharacterIllustration = () => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[140px] md:max-w-[170px] drop-shadow-sm">
    {/* Hair Back */}
    <path d="M70 45 C55 15 145 15 130 45 Z" fill="#E35B30" stroke="#1C1917" strokeWidth="2" />
    
    {/* Head */}
    <rect x="80" y="35" width="40" height="40" rx="12" fill="#FAF6F0" stroke="#1C1917" strokeWidth="2" />
    <circle cx="92" cy="52" r="2.5" fill="#1C1917" />
    <circle cx="108" cy="52" r="2.5" fill="#1C1917" />
    <path d="M96 62 Q100 66 104 62" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    
    {/* Hair Front/Bangs */}
    <path d="M78 38 C85 30 115 30 122 38 C115 42 85 42 78 38 Z" fill="#E35B30" stroke="#1C1917" strokeWidth="2" />

    {/* Torso/Blue Shirt */}
    <path d="M65 75 C65 75 70 120 100 120 C130 120 135 75 135 75 Z" fill="#1D4ED8" stroke="#1C1917" strokeWidth="2" />

    {/* Arms leaning forward */}
    <path d="M50 115 C55 105 145 105 150 115" fill="none" stroke="#1C1917" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M50 110 L150 110" stroke="#1C1917" strokeWidth="2" />
  </svg>
);

export function Features() {
  return (
    <section id="fitur" className="px-6 md:px-12 py-24 bg-[#FAF6F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* ─── Top Heading & Illustration row ─── */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-4">
          <div className="text-left space-y-4 max-w-lg">
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
              Semua yang Anda <br />
              butuhkan, tetap <br />
              <span className="text-[#E35B30]">100% gratis</span>
            </h2>
            <p className="text-sm md:text-base text-stone-600 font-semibold leading-relaxed">
              Kami menyajikan kemudahan pencatatan finansial tanpa biaya tersembunyi.
            </p>
          </div>
          <div className="hidden md:block shrink-0">
            <LeaningCharacterIllustration />
          </div>
        </div>

        {/* ─── Main 3-Column Card Box ─── */}
        <div className="sketch-card-flat bg-transparent p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Column 1 */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center border-1.5 border-stone-900">
              <Compass className="w-5 h-5 text-[#E35B30]" />
            </div>
            <h3 className="text-base font-extrabold text-stone-900 uppercase tracking-wider">Catat Cepat</h3>
            <p className="text-xs text-stone-600 font-semibold leading-relaxed max-w-[240px]">
              Masukkan pengeluaran dan pemasukan Anda hanya dalam beberapa detik secara manual.
            </p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center text-center space-y-4 border-y md:border-y-0 md:border-x border-stone-900/10 py-8 md:py-0">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center border-1.5 border-stone-900">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-base font-extrabold text-stone-900 uppercase tracking-wider">Pantau Arus Kas</h3>
            <p className="text-xs text-stone-600 font-semibold leading-relaxed max-w-[240px]">
              Visualisasikan aliran uang masuk dan keluar secara real-time dengan grafik yang intuitif.
            </p>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center border-1.5 border-stone-900">
              <Star className="w-5 h-5 text-amber-500 fill-current" />
            </div>
            <h3 className="text-base font-extrabold text-stone-900 uppercase tracking-wider">Anggaran Terarah</h3>
            <p className="text-xs text-stone-600 font-semibold leading-relaxed max-w-[240px]">
              Tentukan batas belanja bulanan untuk setiap kategori guna menghindari pemborosan.
            </p>
          </div>

        </div>

        {/* ─── Bottom Layout: Feature Showcase Cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card A */}
          <div className="sketch-card bg-[#FAF6F0] p-8 flex flex-col justify-between text-left h-full">
            <div className="space-y-4">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#E35B30]">Tabungan</span>
              <h4 className="text-lg font-extrabold text-stone-900 leading-tight">Target Menabung</h4>
              <p className="text-xs text-stone-600 font-semibold leading-relaxed">
                Tetapkan goals & tantangan menabung secara teratur dengan grafik pencapaian yang presisi.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/dashboard" className="text-xs font-bold text-[#E35B30] hover:opacity-85 inline-flex items-center gap-1.5 group">
                Pelajari Selengkapnya 
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Card B */}
          <div className="sketch-card bg-[#FAF6F0] p-8 flex flex-col justify-between text-left h-full">
            <div className="space-y-4">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#E35B30]">Asisten AI</span>
              <div className="flex items-center gap-1.5">
                <h4 className="text-lg font-extrabold text-stone-900 leading-tight">Review & Roast AI</h4>
                <span className="px-1.5 py-0.5 text-[8px] bg-purple-50 text-purple-600 rounded font-black border border-purple-200 uppercase tracking-widest text-center">Soon</span>
              </div>
              <p className="text-xs text-stone-600 font-semibold leading-relaxed">
                Asisten AI akan menilai gaya hidup Anda dengan nada santai & lucu agar terpikir dua kali sebelum boros.
              </p>
            </div>
            <div className="pt-6">
              <Link href="#fitur" className="text-xs font-bold text-[#E35B30] hover:opacity-85 inline-flex items-center gap-1.5 group">
                Pelajari Selengkapnya 
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Card C */}
          <div className="sketch-card bg-[#FAF6F0] p-8 flex flex-col justify-between text-left h-full">
            <div className="space-y-4">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#E35B30]">Integrasi</span>
              <div className="flex items-center gap-1.5">
                <h4 className="text-lg font-extrabold text-stone-900 leading-tight">WhatsApp Logger</h4>
                <span className="px-1.5 py-0.5 text-[8px] bg-purple-50 text-purple-600 rounded font-black border border-purple-200 uppercase tracking-widest text-center">Soon</span>
              </div>
              <p className="text-xs text-stone-600 font-semibold leading-relaxed">
                Cukup ketik nominal & keterangan transaksi lewat chat WhatsApp, AI kami akan memilah kategori secara otomatis.
              </p>
            </div>
            <div className="pt-6">
              <Link href="#fitur" className="text-xs font-bold text-[#E35B30] hover:opacity-85 inline-flex items-center gap-1.5 group">
                Pelajari Selengkapnya 
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
