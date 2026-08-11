"use client";

import { CreditCard, Landmark, Wallet, Plus } from "lucide-react";

export default function AccountsPage() {
  const accounts = [
    { name: "Dompet Utama", type: "Cash", balance: "Rp 14,250,000", color: "bg-blue-600", no: "Cash Wallet" },
    { name: "Bank BCA", type: "Bank Account", balance: "Rp 8,450,000", color: "bg-sky-500", no: "xxxx-8920" },
    { name: "Bank Mandiri", type: "Bank Account", balance: "Rp 5,800,000", color: "bg-emerald-600", no: "xxxx-4412" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Akun & Rekening</h1>
          <p className="text-xs text-stone-500">Kelola rekening bank, kartu kredit, dan dompet tunai Anda.</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-primary text-white hover:bg-primary/90 transition-all text-xs font-bold rounded-lg shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Akun</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map((acc, idx) => (
          <div key={idx} className="sketch-card bg-white p-6 flex flex-col justify-between h-40">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">{acc.type}</span>
                <h3 className="text-sm font-extrabold text-stone-900 mt-0.5">{acc.name}</h3>
              </div>
              <div className={`w-8 h-8 rounded-lg ${acc.color} flex items-center justify-center text-white`}>
                {acc.type === "Cash" ? <Wallet className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{acc.no}</p>
              <p className="text-xl font-black text-stone-900 mt-1">{acc.balance}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
