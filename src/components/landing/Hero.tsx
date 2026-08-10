"use client";

import Link from "next/link";
import { Zap, CreditCard, Box, Shield } from "lucide-react";
import { Highlighter } from "@/components/highlighter";

// ─── Cartoon Desk Illustration (Center Hero SVG) ──────────────────────────────
const HeroDeskIllustration = () => (
  <svg viewBox="0 0 400 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[340px] md:max-w-[380px] drop-shadow-sm">
    {/* Floating background elements */}
    <path d="M50 80 L65 72 L60 90 Z" fill="#FEE2E2" stroke="#1C1917" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="340" cy="110" r="10" fill="#FEF3C7" stroke="#1C1917" strokeWidth="1.5" />
    <path d="M30 200 Q45 190 60 205" stroke="#E35B30" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M360 220 L375 235 M375 220 L360 235" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />

    {/* Main Desk Box/Panel */}
    <rect x="100" y="160" width="220" height="150" rx="20" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.5" />

    {/* Desk Panel Inner Grid Lines & Chart UI */}
    {/* Screen Line header */}
    <path d="M100 190 L320 190" stroke="#1C1917" strokeWidth="2.5" />
    <circle cx="120" cy="175" r="4" fill="#E35B30" stroke="#1C1917" strokeWidth="1.5" />
    <circle cx="132" cy="175" r="4" fill="#3B82F6" stroke="#1C1917" strokeWidth="1.5" />
    <circle cx="144" cy="175" r="4" fill="#10B981" stroke="#1C1917" strokeWidth="1.5" />

    {/* Chart Bars */}
    <rect x="125" y="220" width="16" height="70" rx="4" fill="#10B981" stroke="#1C1917" strokeWidth="2" />
    <rect x="150" y="205" width="16" height="85" rx="4" fill="#3B82F6" stroke="#1C1917" strokeWidth="2" />
    <rect x="175" y="240" width="16" height="50" rx="4" fill="#E35B30" stroke="#1C1917" strokeWidth="2" />
    <rect x="200" y="215" width="16" height="75" rx="4" fill="#F59E0B" stroke="#1C1917" strokeWidth="2" />

    {/* Checkboxes/Buttons on right side of panel */}
    <rect x="235" y="210" width="30" height="30" rx="8" fill="#FEE2E2" stroke="#1C1917" strokeWidth="2" />
    <path d="M243 225 L248 230 L257 218" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

    <rect x="235" y="250" width="30" height="30" rx="8" fill="#FEF3C7" stroke="#1C1917" strokeWidth="2" />
    <path d="M243 265 L248 270 L257 258" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

    {/* Pie Chart / Gear Circle */}
    <circle cx="288" cy="235" r="20" fill="#3B82F6" stroke="#1C1917" strokeWidth="2" />
    <path d="M288 215 A 20 20 0 0 1 308 235 L 288 235 Z" fill="#F59E0B" stroke="#1C1917" strokeWidth="2" />
    <path d="M288 235 L 273 248" stroke="#1C1917" strokeWidth="2" />

    {/* Character (Sitting behind desk) */}
    {/* Hair Back */}
    <path d="M170 85 C160 55 240 55 230 85 Z" fill="#1E3A8A" stroke="#1C1917" strokeWidth="2.5" />
    {/* Head/Face */}
    <rect x="180" y="75" width="40" height="45" rx="15" fill="#FAF6F0" stroke="#1C1917" strokeWidth="2.5" />
    {/* Eyes */}
    <circle cx="192" cy="92" r="2.5" fill="#1C1917" />
    <circle cx="208" cy="92" r="2.5" fill="#1C1917" />
    {/* Smile */}
    <path d="M196 102 Q200 106 204 102" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Hair Front/Bangs */}
    <path d="M178 78 C185 70 200 70 205 76 C210 70 220 72 222 80 C210 82 195 82 178 78 Z" fill="#1E3A8A" stroke="#1C1917" strokeWidth="2.5" />

    {/* Torso/Orange Shirt */}
    <path d="M165 120 C165 120 170 162 200 162 C230 162 235 120 235 120 Z" fill="#E35B30" stroke="#1C1917" strokeWidth="2.5" />
    <path d="M170 120 L230 120" stroke="#1C1917" strokeWidth="2.5" />

    {/* Left Arm leaning on desk */}
    <path d="M230 125 C245 130 252 145 250 162 C248 178 220 185 205 185 C190 185 190 170 205 170 C220 170 235 162 235 150" fill="#FAF6F0" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export function Hero() {
  return (
    <section id="tentang" className="pt-32 pb-20 px-6 md:px-12 relative overflow-hidden bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

        {/* ─── Left Column: Title & Action ─── */}
        <div className="lg:col-span-5 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#E35B30]/10 text-[#E35B30] text-[10px] font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Asisten Keuangan WhatsApp AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-stone-900">
            Kelola semua <br />
            uang dengan <br />
            <span className="relative inline-block text-stone-900 z-10 px-2 py-0.5">
              langkah tepat
              <Highlighter
                variant={9}
                className="text-[#FDE047]/70 -bottom-0.5 -left-1 w-[105%] h-[100%] rounded-lg"
                animated
              />
            </span>
          </h1>

          <p className="text-sm md:text-base text-stone-600 font-semibold leading-relaxed max-w-md">
            Butuh asisten pintar, info terpercaya, & alat praktis untuk menjawab kebutuhan finansialmu? Hubungi hemat.yu untuk mencatat pengeluaran instan via WA.
          </p>

          <div className="flex flex-row items-center gap-4 pt-2">
            <Link
              href="/register"
              className="px-7 py-3.5 bg-[#2563EB] text-white font-extrabold text-sm rounded-lg hover:bg-[#1D4ED8] transition-all shadow-sm active:translate-y-0.5"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>

        {/* ─── Center Column: Playful Cartoon Illustration ─── */}
        <div className="lg:col-span-4 flex justify-center items-center py-6">
          <HeroDeskIllustration />
        </div>

        {/* ─── Right Column: Featured Cards Column ─── */}
        <div className="lg:col-span-3 text-left space-y-6">
          {/* Card 1 */}
          <div className="flex gap-4 items-start group">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center border-1.5 border-stone-900 shrink-0 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5 text-[#E35B30]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">Catat Otomatis</h3>
              <p className="text-xs text-stone-500 font-semibold mt-1 leading-relaxed">
                Kirim pesan transaksi via WhatsApp, asisten AI langsung memproses pengeluaran Anda.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex gap-4 items-start group">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center border-1.5 border-stone-900 shrink-0 group-hover:scale-105 transition-transform">
              <Box className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">Batasi Kategori</h3>
              <p className="text-xs text-stone-500 font-semibold mt-1 leading-relaxed">
                Tetapkan limit budget bulanan per pos belanja agar tidak boros di tengah bulan.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex gap-4 items-start group">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center border-1.5 border-stone-900 shrink-0 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">Tips Finansial</h3>
              <p className="text-xs text-stone-500 font-semibold mt-1 leading-relaxed">
                Dapatkan evaluasi bulanan & saran hemat personal langsung ke HP Anda.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ─── Trust Indicators ─── */}
      <div className="mt-20 pt-10 border-t border-stone-900/5 max-w-7xl mx-auto">
        <p className="text-center text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-6">Dipercaya oleh ribuan pengguna di seluruh Indonesia</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-stone-900">10.000+</p>
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Pengguna Aktif</p>
          </div>
          <div className="w-px h-10 bg-stone-900/10 hidden sm:block"></div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-stone-900">500.000+</p>
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Transaksi Tercatat</p>
          </div>
          <div className="w-px h-10 bg-stone-900/10 hidden sm:block"></div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[#10B981]">100%</p>
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Gratis Selamanya</p>
          </div>
          <div className="w-px h-10 bg-stone-900/10 hidden sm:block"></div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-stone-900">⭐ 4.8</p>
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Rating Pengguna</p>
          </div>
        </div>
      </div>
    </section>
  );
}
