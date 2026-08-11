"use client";

import { BarChart3, PieChart, TrendingUp, ArrowUpRight } from "lucide-react";

export default function ReportsPage() {
  const categories = [
    { name: "Makanan & Minuman", pct: 45, amount: "Rp 1,450,000", color: "bg-primary" },
    { name: "Tagihan & Utilitas", pct: 30, amount: "Rp 1,200,000", color: "bg-[#E35B30]" },
    { name: "Belanja", pct: 15, amount: "Rp 600,000", color: "bg-emerald-500" },
    { name: "Hiburan", pct: 10, amount: "Rp 400,000", color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Laporan Keuangan</h1>
        <p className="text-xs text-stone-500">Analisis pengeluaran dan pertumbuhan aset Anda secara visual.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly comparison bar chart */}
        <div className="sketch-card bg-white p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Perbandingan Bulanan</h3>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">Pemasukan vs Pengeluaran</p>
            </div>
            <BarChart3 className="w-4 h-4 text-stone-450" />
          </div>

          <div className="h-44 w-full flex items-end gap-4 pt-4 border-b border-stone-100 pb-2">
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className="flex items-end gap-1 h-32 w-full justify-center">
                <div className="w-2.5 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm h-[50%]"></div>
                <div className="w-2.5 bg-[#E35B30]/20 hover:bg-[#E35B30] transition-colors rounded-t-sm h-[40%]"></div>
              </div>
              <span className="text-[10px] font-bold text-stone-400">Agt</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className="flex items-end gap-1 h-32 w-full justify-center">
                <div className="w-2.5 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm h-[65%]"></div>
                <div className="w-2.5 bg-[#E35B30]/20 hover:bg-[#E35B30] transition-colors rounded-t-sm h-[55%]"></div>
              </div>
              <span className="text-[10px] font-bold text-stone-400">Sep</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className="flex items-end gap-1 h-32 w-full justify-center">
                <div className="w-2.5 bg-primary hover:bg-primary transition-colors rounded-t-sm h-[90%]"></div>
                <div className="w-2.5 bg-[#E35B30] hover:bg-[#E35B30] transition-colors rounded-t-sm h-[45%]"></div>
              </div>
              <span className="text-[10px] font-bold text-stone-900">Okt</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-bold text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Pemasukan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E35B30]"></span>
              Pengeluaran
            </span>
          </div>
        </div>

        {/* Categories Analysis */}
        <div className="sketch-card bg-white p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Distribusi Kategori</h3>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">Alokasi Anggaran Belanja</p>
            </div>
            <PieChart className="w-4 h-4 text-stone-450" />
          </div>

          <div className="space-y-4">
            {categories.map((c, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-stone-600">
                  <span className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${c.color}`}></span>
                    {c.name}
                  </span>
                  <span>{c.amount} ({c.pct}%)</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5 border border-stone-900/5">
                  <div className={`h-1.5 rounded-full ${c.color}`} style={{ width: `${c.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
