"use client";

import { useState } from "react";
import { ArrowLeftRight, Download, Filter, Search } from "lucide-react";

export default function TransactionsPage() {
  const transactions = [
    { date: "Oct 28, 2023", desc: "Kopi", category: "Food & Drink", account: "Dompet Utama", amount: "-Rp 55,000", isIncome: false },
    { date: "Oct 27, 2023", desc: "Gaji Bulanan", category: "Salary", account: "Bank BCA", amount: "+Rp 15,000,000", isIncome: true },
    { date: "Oct 26, 2023", desc: "Tagihan Listrik", category: "Utilities", account: "Bank Mandiri", amount: "-Rp 750,000", isIncome: false },
    { date: "Oct 25, 2023", desc: "Belanja Tokopedia", category: "Shopping", account: "Dompet Utama", amount: "-Rp 1,200,000", isIncome: false },
    { date: "Oct 24, 2023", desc: "Langganan Netflix", category: "Subscr.", account: "Bank BCA", amount: "-Rp 186,000", isIncome: false },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Riwayat Transaksi</h1>
          <p className="text-xs text-stone-500">Lihat semua aliran masuk dan keluar dana Anda secara transparan.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E7DED4] hover:bg-stone-50 rounded-lg text-xs font-bold text-stone-600 shadow-sm transition-colors">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E7DED4] hover:bg-stone-50 rounded-lg text-xs font-bold text-stone-600 shadow-sm transition-colors">
            <Download className="w-3.5 h-3.5 text-stone-400" />
            <span>Ekspor</span>
          </button>
        </div>
      </div>

      <div className="sketch-card bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold">
            <thead>
              <tr className="border-b border-[#E7DED4] text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="p-4">Tanggal</th>
                <th className="p-4">Deskripsi</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Akun</th>
                <th className="p-4 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DED4]/40 text-stone-700">
              {transactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                  <td className="p-4 text-stone-500">{tx.date}</td>
                  <td className="p-4 font-bold text-stone-900">{tx.desc}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded-md text-[10px]">
                      {tx.category}
                    </span>
                  </td>
                  <td className="p-4 text-stone-500">{tx.account}</td>
                  <td className={`p-4 text-right font-black ${tx.isIncome ? "text-emerald-600" : "text-stone-900"}`}>
                    {tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
