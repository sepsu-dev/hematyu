"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";

// ─── Sample data ─────────────────────────────────────────────────
const MONTHLY_DATA = [
  { month: "Jun", income: 8500000,  expense: 5200000 },
  { month: "Jul", income: 9000000,  expense: 6800000 },
  { month: "Ags", income: 7800000,  expense: 4900000 },
  { month: "Sep", income: 11000000, expense: 7200000 },
  { month: "Okt", income: 15000000, expense: 2191000 },
];

const EXPENSE_BREAKDOWN = [
  { cat: "Makanan & Minuman", amount: 55000,   color: "bg-orange-400",  light: "bg-orange-50",  text: "text-orange-600" },
  { cat: "Tagihan & Listrik", amount: 750000,  color: "bg-yellow-400",  light: "bg-yellow-50",  text: "text-yellow-600" },
  { cat: "Belanja / Toko",    amount: 1200000, color: "bg-blue-400",    light: "bg-blue-50",    text: "text-blue-600"   },
  { cat: "Langganan / Media", amount: 186000,  color: "bg-purple-400",  light: "bg-purple-50",  text: "text-purple-600" },
];

const INCOME_BREAKDOWN = [
  { cat: "Gaji / Pendapatan", amount: 15000000, color: "bg-emerald-400", light: "bg-emerald-50", text: "text-emerald-600" },
];

function formatRp(n: number) {
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}jt`;
  if (n >= 1000) return `Rp ${(n / 1000).toFixed(0)}K`;
  return "Rp " + n.toLocaleString("id-ID");
}
function formatRpFull(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

type Period = "monthly" | "weekly";

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("monthly");

  const currentMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];
  const prevMonth = MONTHLY_DATA[MONTHLY_DATA.length - 2];

  const totalIncome = INCOME_BREAKDOWN.reduce((s, x) => s + x.amount, 0);
  const totalExpense = EXPENSE_BREAKDOWN.reduce((s, x) => s + x.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const incomeChange = prevMonth
    ? (((currentMonth.income - prevMonth.income) / prevMonth.income) * 100).toFixed(1)
    : "0";
  const expenseChange = prevMonth
    ? (((currentMonth.expense - prevMonth.expense) / prevMonth.expense) * 100).toFixed(1)
    : "0";

  // Chart scaling
  const maxVal = Math.max(...MONTHLY_DATA.flatMap(m => [m.income, m.expense]));

  return (
    <div className="space-y-6">

      {/* ─── Header ─── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Laporan Keuangan</h1>
          <p className="text-xs text-stone-500 mt-0.5">Ringkasan arus kas dan analisis pengeluaran Anda.</p>
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg border border-[#E7DED4]">
          {(["monthly", "weekly"] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-extrabold transition-all ${
                period === p ? "bg-white shadow-sm text-stone-900 border border-[#E7DED4]" : "text-stone-400 hover:text-stone-600"
              }`}>
              {p === "monthly" ? "Bulanan" : "Mingguan"}
            </button>
          ))}
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Net Balance */}
        <div className="sketch-card bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Net Bulan Ini</span>
          </div>
          <div>
            <p className={`text-2xl font-black tracking-tight ${netBalance >= 0 ? "text-stone-900" : "text-red-600"}`}>
              {formatRpFull(netBalance)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-emerald-600 font-bold">✓ Surplus bulan ini</span>
            </div>
          </div>
        </div>

        {/* Income */}
        <div className="sketch-card bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Pemasukan</span>
          </div>
          <div>
            <p className="text-2xl font-black text-stone-900 tracking-tight">{formatRpFull(totalIncome)}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] text-emerald-600 font-bold">+{incomeChange}% vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Expense */}
        <div className="sketch-card bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <TrendingDown className="w-4.5 h-4.5 text-[#E35B30]" />
            </div>
            <span className="text-[9px] font-black text-[#E35B30] uppercase tracking-widest">Pengeluaran</span>
          </div>
          <div>
            <p className="text-2xl font-black text-stone-900 tracking-tight">{formatRpFull(totalExpense)}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowDownRight className="w-3 h-3 text-red-400" />
              <span className="text-[10px] text-red-500 font-bold">{expenseChange}% vs bulan lalu</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Row: Bar Chart + Category Breakdown ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Bar Chart */}
        <div className="lg:col-span-7 sketch-card bg-white p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Tren Arus Kas 5 Bulan
              </h2>
              <p className="text-[11px] text-stone-400 mt-0.5">Perbandingan pemasukan & pengeluaran</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold text-stone-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />
                Masuk
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#E35B30] inline-block" />
                Keluar
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="flex items-end gap-4 h-52 pt-2">
            {MONTHLY_DATA.map((m) => {
              const incH = maxVal > 0 ? (m.income / maxVal) * 100 : 0;
              const expH = maxVal > 0 ? (m.expense / maxVal) * 100 : 0;
              const isLast = m === currentMonth;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
                  {/* Bars */}
                  <div className="w-full flex items-end justify-center gap-1 h-44">
                    <div className="relative flex-1 max-w-[24px] group/bar">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${isLast ? "bg-primary" : "bg-primary/25 group-hover:bg-primary/40"}`}
                        style={{ height: `${incH}%` }}
                      />
                      {/* Tooltip */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 bg-stone-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap transition-opacity pointer-events-none z-10">
                        {formatRp(m.income)}
                      </div>
                    </div>
                    <div className="relative flex-1 max-w-[24px] group/bar2">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${isLast ? "bg-[#E35B30]" : "bg-[#E35B30]/25 group-hover:bg-[#E35B30]/40"}`}
                        style={{ height: `${expH}%` }}
                      />
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar2:opacity-100 bg-stone-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap transition-opacity pointer-events-none z-10">
                        {formatRp(m.expense)}
                      </div>
                    </div>
                  </div>
                  {/* Month label */}
                  <span className={`text-[10px] font-extrabold ${isLast ? "text-primary" : "text-stone-400"}`}>
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Net per month mini row */}
          <div className="grid grid-cols-5 gap-2 pt-2 border-t border-[#E7DED4]">
            {MONTHLY_DATA.map(m => {
              const net = m.income - m.expense;
              return (
                <div key={m.month} className="text-center">
                  <p className={`text-[9px] font-black ${net >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {net >= 0 ? "+" : ""}{formatRp(net)}
                  </p>
                  <p className="text-[8px] text-stone-400 font-semibold">{m.month}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-5 space-y-4">

          {/* Expense Breakdown */}
          <div className="sketch-card bg-white p-6 space-y-4">
            <div>
              <h2 className="text-sm font-extrabold text-stone-900">Rincian Pengeluaran</h2>
              <p className="text-[11px] text-stone-400 mt-0.5">Breakdown pengeluaran per kategori</p>
            </div>
            <div className="space-y-3.5">
              {EXPENSE_BREAKDOWN.map(({ cat, amount, color, light, text }) => {
                const pct = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${color} inline-block shrink-0`} />
                        <span className="text-[11px] font-bold text-stone-700">{cat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black ${text}`}>{pct.toFixed(0)}%</span>
                        <span className="text-[10px] text-stone-500 font-bold">{formatRpFull(amount)}</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className={`h-1.5 ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Income Breakdown */}
          <div className="sketch-card bg-white p-6 space-y-4">
            <div>
              <h2 className="text-sm font-extrabold text-stone-900">Rincian Pemasukan</h2>
              <p className="text-[11px] text-stone-400 mt-0.5">Sumber pemasukan bulan ini</p>
            </div>
            <div className="space-y-3.5">
              {INCOME_BREAKDOWN.map(({ cat, amount, color, text }) => {
                const pct = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${color} inline-block shrink-0`} />
                        <span className="text-[11px] font-bold text-stone-700">{cat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black ${text}`}>{pct.toFixed(0)}%</span>
                        <span className="text-[10px] text-stone-500 font-bold">{formatRpFull(amount)}</span>
                      </div>
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

      {/* ─── Bottom: Month Summary Table ─── */}
      <div className="sketch-card bg-white overflow-hidden">
        <div className="p-5 border-b border-[#E7DED4]">
          <h2 className="text-sm font-extrabold text-stone-900">Ringkasan Bulanan</h2>
          <p className="text-[11px] text-stone-400 mt-0.5">Detail pemasukan, pengeluaran, dan saldo per bulan</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-bold text-left">
            <thead>
              <tr className="border-b border-[#E7DED4] text-[10px] text-stone-400 uppercase tracking-widest">
                <th className="px-5 py-3">Bulan</th>
                <th className="px-5 py-3 text-right text-emerald-600">Pemasukan</th>
                <th className="px-5 py-3 text-right text-[#E35B30]">Pengeluaran</th>
                <th className="px-5 py-3 text-right">Net / Saldo</th>
                <th className="px-5 py-3">Rasio Hemat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DED4]/40">
              {MONTHLY_DATA.map((m, i) => {
                const net = m.income - m.expense;
                const savingsRate = m.income > 0 ? ((net / m.income) * 100) : 0;
                const isLast = i === MONTHLY_DATA.length - 1;
                return (
                  <tr key={m.month} className={`hover:bg-stone-50/60 transition-colors ${isLast ? "bg-primary/5" : ""}`}>
                    <td className={`px-5 py-3.5 ${isLast ? "font-extrabold text-primary" : "text-stone-700"}`}>
                      {m.month} {isLast && <span className="ml-1 text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Ini</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right text-emerald-700 font-black">{formatRpFull(m.income)}</td>
                    <td className="px-5 py-3.5 text-right text-stone-800">{formatRpFull(m.expense)}</td>
                    <td className={`px-5 py-3.5 text-right font-black ${net >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {net >= 0 ? "+" : ""}{formatRpFull(net)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all ${savingsRate >= 30 ? "bg-emerald-400" : savingsRate >= 10 ? "bg-yellow-400" : "bg-red-400"}`}
                            style={{ width: `${Math.max(0, Math.min(savingsRate, 100))}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-stone-500">{savingsRate.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
