"use client";

import { useState } from "react";

// ─── Cartoon Cards SVG ──────────────────────────────
const CardsIllustration = () => (
  <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px] md:max-w-[320px]">
    {/* Floating sketchy background shapes */}
    <path d="M40 70 Q55 60 70 75" stroke="#E35B30" strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="280" cy="80" r="6" fill="#FBBF24" stroke="#1C1917" strokeWidth="1.5" />
    <rect x="250" y="240" width="12" height="12" rx="3" transform="rotate(15 250 240)" fill="none" stroke="#E35B30" strokeWidth="2" />
    <path d="M30 190 L42 178 L38 196 Z" fill="#FEE2E2" stroke="#1C1917" strokeWidth="1.5" />

    {/* Back Card (Orange) */}
    <g transform="rotate(18 160 140)">
      <rect x="70" y="60" width="120" height="180" rx="14" fill="#E35B30" stroke="#1C1917" strokeWidth="2.5" />
      <rect x="85" y="80" width="25" height="18" rx="4" fill="#FEF3C7" stroke="#1C1917" strokeWidth="2" />
      <line x1="85" y1="130" x2="160" y2="130" stroke="#FAF6F0" strokeWidth="4" strokeLinecap="round" />
      <line x1="85" y1="150" x2="130" y2="150" stroke="#FAF6F0" strokeWidth="4" strokeLinecap="round" />
      <circle cx="160" cy="210" r="10" fill="#FAF6F0" opacity="0.3" />
    </g>

    {/* Middle Card (Yellow) */}
    <g transform="rotate(5 150 150)">
      <rect x="80" y="70" width="120" height="180" rx="14" fill="#FBBF24" stroke="#1C1917" strokeWidth="2.5" />
      <rect x="95" y="90" width="25" height="18" rx="4" fill="#FAF6F0" stroke="#1C1917" strokeWidth="2" />
      <line x1="95" y1="140" x2="170" y2="140" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
      <line x1="95" y1="160" x2="140" y2="160" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" />
      <circle cx="170" cy="220" r="10" fill="#FAF6F0" opacity="0.5" />
    </g>

    {/* Front Card (Blue) */}
    <g transform="rotate(-12 140 160)">
      <rect x="70" y="80" width="120" height="180" rx="14" fill="#1D4ED8" stroke="#1C1917" strokeWidth="2.5" />
      {/* Card chip */}
      <rect x="85" y="100" width="25" height="18" rx="4" fill="#FEF3C7" stroke="#1C1917" strokeWidth="2" />
      {/* Card lines */}
      <line x1="85" y1="150" x2="160" y2="150" stroke="#FAF6F0" strokeWidth="4" strokeLinecap="round" />
      <line x1="85" y1="170" x2="130" y2="170" stroke="#FAF6F0" strokeWidth="4" strokeLinecap="round" />
      {/* Logo circle */}
      <circle cx="160" cy="230" r="10" fill="#FAF6F0" opacity="0.3" />
    </g>

    {/* Hand holding the cards */}
    <path d="M120 230 C120 230 110 240 110 255 C110 270 125 315 155 315 C185 315 185 270 185 255 M140 250 C140 250 148 240 155 240 C162 240 170 250 170 250 M155 250 C155 250 162 245 168 245" fill="none" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" />
    <path d="M110 255 C110 240 135 240 135 255 C135 270 110 270 110 255 Z" fill="#FAF6F0" stroke="#1C1917" strokeWidth="2.5" />
    <path d="M132 258 C132 243 155 243 155 258 C155 273 132 273 132 258 Z" fill="#FAF6F0" stroke="#1C1917" strokeWidth="2.5" />
    <path d="M152 260 C152 245 175 245 175 260 C175 275 152 275 152 260 Z" fill="#FAF6F0" stroke="#1C1917" strokeWidth="2.5" />
    <path d="M172 265 C172 250 192 250 192 265 C192 280 172 280 172 265 Z" fill="#FAF6F0" stroke="#1C1917" strokeWidth="2.5" />
  </svg>
);

export function CalculatorSection() {
  const [limit, setLimit] = useState("3jt");
  const [category, setCategory] = useState("makanan");
  const [result, setResult] = useState<string | null>(null);

  const handleCalculate = () => {
    let estimation = "";
    if (category === "makanan") {
      estimation = limit === "1jt" ? "Rp 33.000 / hari" : limit === "3jt" ? "Rp 100.000 / hari" : "Rp 166.000 / hari";
    } else if (category === "transportasi") {
      estimation = limit === "1jt" ? "Rp 15.000 / perjalanan" : limit === "3jt" ? "Rp 45.000 / perjalanan" : "Rp 75.000 / perjalanan";
    } else {
      estimation = limit === "1jt" ? "Rp 100.000 / hiburan" : limit === "3jt" ? "Rp 300.000 / hiburan" : "Rp 500.000 / hiburan";
    }
    setResult(`Rekomendasi alokasi maksimal Anda: ${estimation}`);
  };

  return (
    <section id="kalkulator" className="py-24 px-6 md:px-12 bg-[#FAF6F0] relative overflow-hidden border-t border-stone-900/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* ─── Left Column: Custom SVG Illustration ─── */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <CardsIllustration />
        </div>

        {/* ─── Right Column: Dropdowns & Action ─── */}
        <div className="lg:col-span-7 text-left space-y-8">
          <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
            Lihat limit anggaran & <br />
            opsi paling {" "}
            <span className="relative inline-block text-[#E35B30]">
              hemat di sini
              {/* Hand drawn loop circle */}
              <svg className="absolute -bottom-1 -left-1 w-[105%] h-5 text-[#E35B30]" viewBox="0 0 160 20" fill="none">
                <path d="M3 10 C50 -2 120 -2 157 8 C110 18 40 18 5 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="text-sm md:text-base text-stone-600 font-semibold max-w-xl">
            Gunakan kalkulator simulasi instan ini untuk melihat berapa batasan harian ideal belanja Anda berdasarkan target limit bulanan dan kategori pos pengeluaran.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            {/* Filter 1 */}
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Limit Bulanan</label>
              <select
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full bg-white border border-stone-900/20 rounded-xl px-4 py-3 text-xs font-bold text-stone-900 focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="1jt">Rp 1.000.000</option>
                <option value="3jt">Rp 3.000.000</option>
                <option value="5jt">Rp 5.000.000</option>
              </select>
            </div>

            {/* Filter 2 */}
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Kategori Belanja</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-stone-900/20 rounded-xl px-4 py-3 text-xs font-bold text-stone-900 focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="makanan">Makanan & Minuman</option>
                <option value="transportasi">Transportasi</option>
                <option value="hiburan">Hiburan & Coffee</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleCalculate}
              className="px-8 py-3.5 bg-[#2563EB] text-white font-extrabold text-xs rounded-full hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              Hitung Simulasi
            </button>
          </div>

          {result && (
            <div className="mt-4 p-5 bg-[#FAF6F0] border-1.5 border-stone-900 rounded-2xl max-w-lg animate-fade-in shadow-[4px_4px_0px_#1C1917]">
              <p className="text-xs md:text-sm font-extrabold text-stone-950">{result}</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
