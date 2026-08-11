"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getMonthlySummaryAction,
  getWeeklySummaryAction,
  getExpenseBreakdownAction,
  getTransactionsAction,
} from "@/app/dashboard/actions";

interface MonthlyRow {
  month: string;
  month_start: string;
  income: number;
  expense: number;
}
interface WeeklyRow {
  week_label: string;
  week_start: string;
  income: number;
  expense: number;
}
interface BreakdownItem {
  category: string;
  total: number;
}
type ChartRow = (MonthlyRow | WeeklyRow) & {
  month?: string;
  month_start?: string;
  week_label?: string;
  week_start?: string;
};

const CATEGORY_HEX: Record<string, string> = {
  "Makanan & Minuman": "#fb923c",
  "Tagihan & Listrik": "#facc15",
  "Belanja / Toko": "#60a5fa",
  "Transportasi": "#0ea5e9",
  "Langganan / Media": "#a78bfa",
  "Kesehatan": "#fb7185",
  "Hiburan": "#f472b6",
  "Pendidikan": "#818cf8",
  "Lainnya": "#a8a29e",
};

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
  const [monthlyData, setMonthlyData] = useState<MonthlyRow[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyRow[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<BreakdownItem[]>([]);
  const [incomeBreakdown, setIncomeBreakdown] = useState<BreakdownItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMonthlySummaryAction(),
      getWeeklySummaryAction(),
      getExpenseBreakdownAction(),
      getTransactionsAction(),
    ])
      .then(([monthly, weekly, breakdown, allTx]) => {
        setMonthlyData(monthly);
        setWeeklyData(weekly);
        setExpenseBreakdown(breakdown);
        const incomeMap = (allTx as { type: string; category: string; amount: number }[])
          .filter((t) => t.type === "INCOME")
          .reduce<Record<string, number>>((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
          }, {});
        setIncomeBreakdown(
          Object.entries(incomeMap)
            .map(([category, total]) => ({ category, total }))
            .sort((a, b) => b.total - a.total)
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const chartData: ChartRow[] = period === "monthly" ? monthlyData : weeklyData;
  const chartKey = period === "monthly" ? "month" : "week_label";
  const chartTitle = period === "monthly" ? "Tren Arus Kas 5 Bulan" : "Tren Arus Kas 7 Minggu";

  const currentMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData[monthlyData.length - 2];
  const totalIncome = incomeBreakdown.reduce((s, x) => s + x.total, 0);
  const totalExpense = expenseBreakdown.reduce((s, x) => s + x.total, 0);
  const netBalance = totalIncome - totalExpense;

  const incomeChange = prevMonth && prevMonth.income > 0
    ? (((currentMonth.income - prevMonth.income) / prevMonth.income) * 100).toFixed(1)
    : "0";
  const expenseChange = prevMonth && prevMonth.expense > 0
    ? (((currentMonth.expense - prevMonth.expense) / prevMonth.expense) * 100).toFixed(1)
    : "0";

  const donutData = expenseBreakdown.map(({ category, total }) => ({
    name: category,
    value: total,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Laporan Keuangan</h1>
          <p className="text-xs text-stone-500 mt-0.5">Ringkasan arus kas dan analisis pengeluaran Anda.</p>
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg border border-[#E7DED4]">
          {(["monthly", "weekly"] as Period[]).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-extrabold transition-all ${period === p ? "bg-white shadow-sm text-stone-900 border border-[#E7DED4]" : "text-stone-400 hover:text-stone-600"
                }`}>
              {p === "monthly" ? "Bulanan" : "Mingguan"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sketch-card bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Net Bulan Ini</span>
          </div>
          <div>
            <p className={`text-2xl font-black tracking-tight ${netBalance >= 0 ? "text-stone-900" : "text-red-600"}`}>
              {loading ? "..." : formatRpFull(netBalance)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-emerald-600 font-bold">✓ Surplus bulan ini</span>
            </div>
          </div>
        </div>
        <div className="sketch-card bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Pemasukan</span>
          </div>
          <div>
            <p className="text-2xl font-black text-stone-900 tracking-tight">{loading ? "..." : formatRpFull(totalIncome)}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] text-emerald-600 font-bold">+{incomeChange}% vs bulan lalu</span>
            </div>
          </div>
        </div>
        <div className="sketch-card bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <TrendingDown className="w-4.5 h-4.5 text-[#E35B30]" />
            </div>
            <span className="text-[9px] font-black text-[#E35B30] uppercase tracking-widest">Pengeluaran</span>
          </div>
          <div>
            <p className="text-2xl font-black text-stone-900 tracking-tight">{loading ? "..." : formatRpFull(totalExpense)}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowDownRight className="w-3 h-3 text-red-400" />
              <span className="text-[10px] text-red-500 font-bold">{expenseChange}% vs bulan lalu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart + Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-7 sketch-card bg-white p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                {chartTitle}
              </h2>
              <p className="text-[11px] text-stone-400 mt-0.5">Perbandingan pemasukan & pengeluaran</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold text-stone-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />Masuk</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#E35B30] inline-block" />Keluar</span>
            </div>
          </div>
          <div className="h-56">
            {loading ? (
              <p className="text-sm font-bold text-stone-300 w-full text-center py-20">Memuat...</p>
            ) : chartData.length === 0 ? (
              <p className="text-sm font-bold text-stone-300 w-full text-center py-20">Belum ada data</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData as any} margin={{ top: 5, right: 5, left: -18, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFE7DD" vertical={false} />
                  <XAxis dataKey={chartKey} tick={{ fontSize: 10, fill: "#A8A29E", fontWeight: 700 }} axisLine={{ stroke: "#E7DED4" }} tickLine={false} />
                  <YAxis tickFormatter={(v: number) => (v >= 1000000 ? `${(v / 1000000).toFixed(0)}jt` : `${(v / 1000).toFixed(0)}k`)} tick={{ fontSize: 10, fill: "#A8A29E", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => formatRpFull(Number(value ?? 0))}
                    contentStyle={{ borderRadius: 12, border: "1px solid #E7DED4", fontSize: 12, fontWeight: 700, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                  <Bar dataKey="income" name="Masuk" fill="#8B5CF6" radius={[6, 6, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="expense" name="Keluar" fill="#E35B30" radius={[6, 6, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2 pt-2 border-t border-[#E7DED4]">
            {chartData.map((m) => {
              const net = m.income - m.expense;
              return (
                <div key={m.week_start || m.month_start} className="text-center">
                  <p className={`text-[9px] font-black ${net >= 0 ? "text-emerald-600" : "text-red-500"}`}>{net >= 0 ? "+" : ""}{formatRp(net)}</p>
                  <p className="text-[8px] text-stone-400 font-semibold">{(m as any)[chartKey]}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdowns */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sketch-card bg-white p-6 space-y-4">
            <div>
              <h2 className="text-sm font-extrabold text-stone-900">Komposisi Pengeluaran</h2>
              <p className="text-[11px] text-stone-400 mt-0.5">Distribusi pengeluaran per kategori</p>
            </div>
            {loading ? (
              <p className="text-sm font-bold text-stone-300 text-center py-8">Memuat...</p>
            ) : donutData.length === 0 ? (
              <p className="text-xs text-stone-300 text-center py-8">Belum ada pengeluaran</p>
            ) : (
              <>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={2}
                        strokeWidth={0}
                      >
                        {donutData.map((entry) => (
                          <Cell key={entry.name} fill={CATEGORY_HEX[entry.name] ?? "#a8a29e"} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatRpFull(Number(value ?? 0))}
                        contentStyle={{ borderRadius: 12, border: "1px solid #E7DED4", fontSize: 12, fontWeight: 700 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {donutData.map((item) => {
                    const pct = totalExpense > 0 ? (item.value / totalExpense) * 100 : 0;
                    return (
                      <div key={item.name} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-[11px] font-bold text-stone-700 truncate">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: CATEGORY_HEX[item.name] ?? "#a8a29e" }} />
                          {item.name}
                        </span>
                        <span className="text-[10px] font-black text-stone-500">{pct.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div className="sketch-card bg-white p-6 space-y-4">
            <div>
              <h2 className="text-sm font-extrabold text-stone-900">Rincian Pemasukan</h2>
              <p className="text-[11px] text-stone-400 mt-0.5">Sumber pemasukan bulan ini</p>
            </div>
            <div className="space-y-3.5">
              {incomeBreakdown.length === 0 ? (
                <p className="text-xs text-stone-300 text-center py-8">Belum ada pemasukan</p>
              ) : incomeBreakdown.map(({ category, total }) => {
                const pct = totalIncome > 0 ? (total / totalIncome) * 100 : 0;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0" />
                        <span className="text-[11px] font-bold text-stone-700">{category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-emerald-600">{pct.toFixed(0)}%</span>
                        <span className="text-[10px] text-stone-500 font-bold">{formatRpFull(total)}</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-1.5 bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Month Summary Table */}
      <div className="sketch-card bg-white overflow-hidden">
        <div className="p-5 border-b border-[#E7DED4]">
          <h2 className="text-sm font-extrabold text-stone-900">Ringkasan {period === "monthly" ? "Bulanan" : "Mingguan"}</h2>
          <p className="text-[11px] text-stone-400 mt-0.5">Detail pemasukan, pengeluaran, dan saldo per {period === "monthly" ? "bulan" : "minggu"}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-bold text-left">
            <thead>
              <tr className="border-b border-[#E7DED4] text-[10px] text-stone-400 uppercase tracking-widest">
                <th className="px-5 py-3">{period === "monthly" ? "Bulan" : "Minggu"}</th>
                <th className="px-5 py-3 text-right text-emerald-600">Pemasukan</th>
                <th className="px-5 py-3 text-right text-[#E35B30]">Pengeluaran</th>
                <th className="px-5 py-3 text-right">Net / Saldo</th>
                <th className="px-5 py-3">Rasio Hemat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DED4]/40">
              {chartData.map((m, i) => {
                const net = m.income - m.expense;
                const savingsRate = m.income > 0 ? (net / m.income) * 100 : 0;
                const isLast = i === chartData.length - 1;
                return (
                  <tr key={m.week_start || m.month_start} className={`hover:bg-stone-50/60 transition-colors ${isLast ? "bg-primary/5" : ""}`}>
                    <td className={`px-5 py-3.5 ${isLast ? "font-extrabold text-primary" : "text-stone-700"}`}>
                      {(m as any)[chartKey]}{isLast && <span className="ml-1 text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Ini</span>}
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