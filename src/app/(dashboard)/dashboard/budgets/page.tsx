"use client";

import { PiggyBank, Plus } from "lucide-react";

export default function BudgetsPage() {
  const budgets = [
    { category: "Makanan & Minuman", limit: "Rp 2,500,000", spent: "Rp 1,450,000", left: "Rp 1,050,000", progress: 58 },
    { category: "Tagihan & Utilitas", limit: "Rp 1,800,000", spent: "Rp 1,200,000", left: "Rp 600,000", progress: 66 },
    { category: "Hiburan & Rekreasi", limit: "Rp 1,000,000", spent: "Rp 950,000", left: "Rp 50,000", progress: 95 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Anggaran Bulanan</h1>
          <p className="text-xs text-stone-500">Buat batasan belanja untuk menjaga pengeluaran bulanan Anda.</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-primary text-white hover:bg-primary/90 transition-all text-xs font-bold rounded-lg shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Anggaran</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {budgets.map((b, idx) => (
          <div key={idx} className="sketch-card bg-white p-6 flex flex-col justify-between h-44">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-stone-900">{b.category}</h3>
                <p className="text-[10px] font-bold text-stone-400 mt-0.5">Batas: {b.limit}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <PiggyBank className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs font-bold text-stone-600">
                <span>Terpakai: {b.spent}</span>
                <span className={b.progress > 90 ? "text-red-500" : "text-stone-900"}>{b.progress}%</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5 border border-stone-900/5">
                <div 
                  className={`h-1.5 rounded-full ${b.progress > 90 ? "bg-red-500" : "bg-primary"}`} 
                  style={{ width: `${b.progress}%` }}
                ></div>
              </div>
              <p className="text-[10px] font-bold text-stone-400 mt-1">Sisa Anggaran: {b.left}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
