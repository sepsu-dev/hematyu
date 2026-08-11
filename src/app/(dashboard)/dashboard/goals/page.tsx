"use client";

import { Target, Plus } from "lucide-react";

export default function GoalsPage() {
  const goals = [
    { title: "Laptop Kerja Baru", target: "Rp 20,000,000", current: "Rp 17,000,000", progress: 85, date: "Dec 2023" },
    { title: "Dana Liburan Bali", target: "Rp 10,000,000", current: "Rp 4,000,000", progress: 40, date: "Jun 2024" },
    { title: "Dana Darurat", target: "Rp 15,000,000", current: "Rp 15,000,000", progress: 100, date: "Tercapai" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Rencana Menabung</h1>
          <p className="text-xs text-stone-500">Tentukan mimpi finansial Anda dan pantau tabungan secara berkala.</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-primary text-white hover:bg-primary/90 transition-all text-xs font-bold rounded-lg shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Rencana</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((g, idx) => (
          <div key={idx} className="sketch-card bg-white p-6 flex flex-col justify-between h-44">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-stone-900">{g.title}</h3>
                <p className="text-[10px] font-bold text-stone-400 mt-0.5">Target: {g.target} ({g.date})</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Target className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs font-bold text-stone-600">
                <span>Terkumpul: {g.current}</span>
                <span className="text-stone-900">{g.progress}%</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5 border border-stone-900/5">
                <div 
                  className={`h-1.5 rounded-full bg-emerald-500`} 
                  style={{ width: `${g.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
