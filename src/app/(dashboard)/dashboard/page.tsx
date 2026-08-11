"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  TrendingDown,
  Trash2,
} from "lucide-react";

const INCOME_CATEGORIES = [
  "Gaji / Pendapatan",
  "Freelance / Projek",
  "Bonus",
  "Investasi",
  "Penjualan",
  "Lainnya",
];

const EXPENSE_CATEGORIES = [
  "Makanan & Minuman",
  "Tagihan & Listrik",
  "Belanja / Toko",
  "Transportasi",
  "Langganan / Media",
  "Kesehatan",
  "Hiburan",
  "Pendidikan",
  "Lainnya",
];

type TxType = "income" | "expense";

interface Transaction {
  id: number;
  date: string;
  desc: string;
  category: string;
  amount: number;
  type: TxType;
}

const initialTransactions: Transaction[] = [
  { id: 1, date: "28 Okt", desc: "Kopi & Snack", category: "Makanan & Minuman", amount: 55000, type: "expense" },
  { id: 2, date: "27 Okt", desc: "Gaji Bulanan", category: "Gaji / Pendapatan", amount: 15000000, type: "income" },
  { id: 3, date: "26 Okt", desc: "Tagihan Listrik", category: "Tagihan & Listrik", amount: 750000, type: "expense" },
  { id: 4, date: "25 Okt", desc: "Belanja Tokopedia", category: "Belanja / Toko", amount: 1200000, type: "expense" },
  { id: 5, date: "24 Okt", desc: "Netflix", category: "Langganan / Media", amount: 186000, type: "expense" },
];

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const CATEGORY_COLORS: Record<string, string> = {
  "Makanan & Minuman": "bg-orange-400",
  "Tagihan & Listrik": "bg-yellow-400",
  "Belanja / Toko": "bg-blue-400",
  "Transportasi": "bg-sky-400",
  "Langganan / Media": "bg-purple-400",
  "Kesehatan": "bg-rose-400",
  "Hiburan": "bg-pink-400",
  "Pendidikan": "bg-indigo-400",
  "Lainnya": "bg-stone-400",
  "Gaji / Pendapatan": "bg-emerald-400",
  "Freelance / Projek": "bg-teal-400",
  "Bonus": "bg-green-400",
  "Investasi": "bg-lime-400",
  "Penjualan": "bg-cyan-400",
};

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleDelete = (id: number) => setTransactions(prev => prev.filter(t => t.id !== id));

  // Expense breakdown by category
  const expenseByCategory = EXPENSE_CATEGORIES
    .map(cat => ({
      cat,
      total: transactions.filter(t => t.type === "expense" && t.category === cat).reduce((s, t) => s + t.amount, 0),
    }))
    .filter(x => x.total > 0)
    .sort((a, b) => b.total - a.total);

  const recentTx = transactions.slice(0, 6);

  return (
    <div className="space-y-6">

      {/* ─── Page Title ─── */}
      <div>
        <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Dashboard</h1>
        <p className="text-xs text-stone-500 mt-0.5">Pantau dan catat keuangan harian Anda.</p>
      </div>

      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Balance */}
        <div className="sketch-card bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Saldo Bersih</span>
          </div>
          <div>
            <p className={`text-2xl font-black tracking-tight ${balance >= 0 ? "text-stone-900" : "text-red-600"}`}>
              {formatRp(balance)}
            </p>
            <p className="text-[10px] text-stone-400 font-semibold mt-1">Total masuk − total keluar</p>
          </div>
          <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-1 bg-primary rounded-full transition-all"
              style={{ width: `${totalIncome > 0 ? Math.min((balance / totalIncome) * 100, 100) : 0}%` }}
            />
          </div>
        </div>

        {/* Income */}
        <div className="sketch-card bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Uang Masuk</span>
          </div>
          <div>
            <p className="text-2xl font-black text-stone-900 tracking-tight">{formatRp(totalIncome)}</p>
            <p className="text-[10px] text-stone-400 font-semibold mt-1">
              {transactions.filter(t => t.type === "income").length} transaksi pemasukan
            </p>
          </div>
          <div className="h-1 w-full bg-emerald-100 rounded-full" />
        </div>

        {/* Expense */}
        <div className="sketch-card bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <TrendingDown className="w-4.5 h-4.5 text-[#E35B30]" />
            </div>
            <span className="text-[9px] font-black text-[#E35B30] uppercase tracking-widest">Uang Keluar</span>
          </div>
          <div>
            <p className="text-2xl font-black text-stone-900 tracking-tight">{formatRp(totalExpense)}</p>
            <p className="text-[10px] text-stone-400 font-semibold mt-1">
              {transactions.filter(t => t.type === "expense").length} transaksi pengeluaran
            </p>
          </div>
          <div className="h-1 w-full bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-1 bg-[#E35B30] rounded-full transition-all"
              style={{ width: `${totalIncome > 0 ? Math.min((totalExpense / totalIncome) * 100, 100) : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─── Main Grid: Form + Tx List + Category Breakdown ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Quick Add CTAs */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-stone-900">Catat Transaksi</h2>
            <p className="text-[11px] text-stone-400 mt-0.5">Pilih jenis transaksi yang ingin dicatat.</p>
          </div>
          <Link
            href="/dashboard/transactions/new?type=expense"
            className="sketch-card bg-white p-5 flex items-center gap-4 group hover:border-orange-300 hover:bg-orange-50/30 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ArrowDownRight className="w-6 h-6 text-[#E35B30]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-stone-900">Uang Keluar</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Catat pengeluaran baru</p>
            </div>
            <div className="text-stone-300 group-hover:text-[#E35B30] transition-colors">→</div>
          </Link>
          <Link
            href="/dashboard/transactions/new?type=income"
            className="sketch-card bg-white p-5 flex items-center gap-4 group hover:border-emerald-300 hover:bg-emerald-50/30 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ArrowUpRight className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-stone-900">Uang Masuk</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Catat pemasukan baru</p>
            </div>
            <div className="text-stone-300 group-hover:text-emerald-600 transition-colors">→</div>
          </Link>
          <Link
            href="/dashboard/transactions"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#E7DED4] text-xs font-extrabold text-stone-500 hover:bg-stone-50 transition-colors"
          >
            Lihat Semua Transaksi →
          </Link>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-5 sketch-card bg-white p-6 space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-stone-900">Transaksi Terakhir</h2>
            <p className="text-[11px] text-stone-400 mt-0.5">{transactions.length} transaksi tercatat</p>
          </div>
          <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
            {recentTx.map(tx => (
              <div key={tx.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#FAF6F0] transition-all group cursor-default">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    tx.type === "income" ? "bg-emerald-50" : "bg-orange-50"
                  }`}>
                    {tx.type === "income"
                      ? <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                      : <ArrowDownRight className="w-4 h-4 text-[#E35B30]" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-stone-800 truncate">{tx.desc}</p>
                    <p className="text-[10px] text-stone-400">{tx.date} · {tx.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-black ${tx.type === "income" ? "text-emerald-600" : "text-stone-800"}`}>
                    {tx.type === "income" ? "+" : "−"}{formatRp(tx.amount)}
                  </span>
                  <button onClick={() => handleDelete(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 text-stone-300 hover:text-red-400 transition-all">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="text-center py-12 text-stone-300">
                <p className="text-sm font-bold">Belum ada transaksi</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-3 sketch-card bg-white p-6 space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-stone-900">Pengeluaran</h2>
            <p className="text-[11px] text-stone-400 mt-0.5">Breakdown per kategori</p>
          </div>
          <div className="space-y-3">
            {expenseByCategory.length === 0 ? (
              <p className="text-xs text-stone-300 text-center py-8">Belum ada pengeluaran</p>
            ) : expenseByCategory.map(({ cat, total }) => {
              const pct = totalExpense > 0 ? (total / totalExpense) * 100 : 0;
              const color = CATEGORY_COLORS[cat] ?? "bg-stone-400";
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-700 truncate max-w-[130px]">{cat}</span>
                    <span className="text-[10px] font-black text-stone-500">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`h-1.5 ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
