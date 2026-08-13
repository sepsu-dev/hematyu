"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  TrendingDown,
  Trash2,
  LayoutDashboard,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getRecentTransactionsAction,
  getSummaryAction,
  deleteTransactionAction,
  getMonthlySummaryAction,
  getExpenseBreakdownAction,
} from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";

type TxType = "INCOME" | "EXPENSE";

interface Transaction {
  id: string;
  date: string | Date;
  description: string;
  category: string;
  amount: number;
  type: TxType;
  note: string | null;
}

interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalCount: number;
}

interface MonthlyRow {
  month: string;
  month_start: string;
  income: number;
  expense: number;
}

interface BreakdownItem {
  category: string;
  total: number;
  color_hex: string;
}

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
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(d: string | Date) {
  const date = new Date(d);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyRow[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<BreakdownItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getRecentTransactionsAction(5),
      getSummaryAction(),
      getMonthlySummaryAction(),
      getExpenseBreakdownAction(),
    ])
      .then(([tx, sum, monthly, breakdown]) => {
        setTransactions(tx);
        setSummary(sum);
        setMonthlyData(monthly);
        setExpenseBreakdown(breakdown);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalIncome = summary?.totalIncome ?? 0;
  const totalExpense = summary?.totalExpense ?? 0;
  const balance = summary?.balance ?? 0;
  const totalCount = summary?.totalCount ?? 0;

  const handleDelete = async (id: string) => {
    await deleteTransactionAction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    const sum = await getSummaryAction();
    setSummary(sum);
  };

  const recentTx = transactions;

  const donutData = expenseBreakdown.map(({ category, total, color_hex }) => ({
    name: category,
    value: total,
    color: color_hex,
  }));
  const topDonut = donutData.slice(0, 6);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">Ringkasan keuangan Anda hari ini.</p>
        </div>
      </div>

      {/* Baris Pertama: 3 KPI Cards matching reports page style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Saldo Bersih */}
        <div className="sketch-card bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Saldo Bersih</span>
          </div>
          <div>
            <p className={`text-2xl font-black tracking-tight ${balance >= 0 ? "text-stone-900" : "text-red-600"}`}>
              {loading ? "..." : formatRp(balance)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-stone-500 font-bold">Total pemasukan − pengeluaran</span>
            </div>
          </div>
        </div>

        {/* Card 2: Uang Masuk */}
        <div className="sketch-card bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Uang Masuk</span>
          </div>
          <div>
            <p className="text-2xl font-black text-stone-900 tracking-tight">
              {loading ? "..." : formatRp(totalIncome)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-stone-500 font-bold">Total terakumulasi masuk</span>
            </div>
          </div>
        </div>

        {/* Card 3: Uang Keluar */}
        <div className="sketch-card bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <TrendingDown className="w-4.5 h-4.5 text-[#E35B30]" />
            </div>
            <span className="text-[9px] font-black text-[#E35B30] uppercase tracking-widest">Uang Keluar</span>
          </div>
          <div>
            <p className="text-2xl font-black text-stone-900 tracking-tight">
              {loading ? "..." : formatRp(totalExpense)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-stone-500 font-bold">Total terakumulasi keluar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Baris Kedua: Tren Arus Kas & Navigasi Cepat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-8 sketch-card bg-white p-6 flex flex-col justify-between min-h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-extrabold text-stone-900">Tren Arus Kas</h2>
              <p className="text-[11px] text-stone-400 mt-0.5">Pemasukan vs pengeluaran 5 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold text-stone-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />Masuk
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#E35B30] inline-block" />Keluar
              </span>
            </div>
          </div>

          <div className="flex-1 h-full min-h-0">
            {loading ? (
              <p className="text-xs font-bold text-stone-300 w-full text-center py-20">Memuat grafik...</p>
            ) : monthlyData.every((m) => m.income === 0 && m.expense === 0) ? (
              <p className="text-xs font-bold text-stone-300 w-full text-center py-20">Belum ada data bulanan</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E35B30" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#E35B30" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFE7DD" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#A8A29E", fontWeight: 700 }} axisLine={{ stroke: "#E7DED4" }} tickLine={false} />
                  <YAxis tickFormatter={(v: number) => (v >= 1000000 ? `${(v / 1000000).toFixed(0)}jt` : `${(v / 1000).toFixed(0)}k`)} tick={{ fontSize: 10, fill: "#A8A29E", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => formatRp(Number(value ?? 0))}
                    contentStyle={{ borderRadius: 12, border: "1px solid #E7DED4", fontSize: 11, fontWeight: 700, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", background: "#ffffff" }}
                  />
                  <Area type="monotone" dataKey="income" name="Masuk" stroke="#8B5CF6" strokeWidth={2} fill="url(#gradIncome)" />
                  <Area type="monotone" dataKey="expense" name="Keluar" stroke="#E35B30" strokeWidth={2} fill="url(#gradExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Actions / Navigation */}
        <div className="lg:col-span-4 sketch-card bg-white p-6 flex flex-col justify-between min-h-[320px]">
          <div>
            <h2 className="text-sm font-extrabold text-stone-900">Navigasi Cepat</h2>
            <p className="text-[11px] text-stone-400 mt-0.5">Pencatatan & riwayat transaksi.</p>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <Button asChild variant="outline" className="w-full justify-start h-12 border-[#E7DED4] bg-white text-xs font-bold hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-none rounded-xl">
              <Link href="/transactions?create=expense" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                  <ArrowDownRight className="w-4 h-4 text-[#E35B30]" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-stone-800">Uang Keluar</p>
                  <p className="text-[9px] text-stone-400 font-normal">Catat transaksi pengeluaran</p>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-12 border-[#E7DED4] bg-white text-xs font-bold hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-none rounded-xl">
              <Link href="/transactions?create=income" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-stone-800">Uang Masuk</p>
                  <p className="text-[9px] text-stone-400 font-normal">Catat transaksi pemasukan</p>
                </div>
              </Link>
            </Button>
          </div>

          <Button asChild variant="outline" className="w-full h-9 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-700 hover:bg-stone-50 border-[#E7DED4] rounded-xl shadow-none">
            <Link href="/transactions">Semua Transaksi →</Link>
          </Button>
        </div>
      </div>

      {/* Baris Ketiga: Transaksi Terakhir & Donut Kategori */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-7 sketch-card bg-white p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-sm font-extrabold text-stone-900">Transaksi Terakhir</h2>
            <p className="text-[11px] text-stone-400 mt-0.5">{totalCount} transaksi tercatat</p>
          </div>

          <div className="divide-y divide-[#E7DED4]/60 max-h-[280px] overflow-y-auto pr-1 flex-1">
            {loading ? (
              <p className="text-center py-12 text-stone-300 text-xs font-bold">Memuat daftar...</p>
            ) : recentTx.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2.5 hover:bg-stone-50/60 transition-colors group px-2 rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white border border-[#E7DED4] ${tx.type === "INCOME" ? "bg-emerald-50/50" : "bg-orange-50/50"}`}>
                    {tx.type === "INCOME" ? <ArrowUpRight className="w-4 h-4 text-emerald-600" /> : <ArrowDownRight className="w-4 h-4 text-[#E35B30]" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold text-stone-900 truncate leading-normal">{tx.description}</p>
                    <p className="text-[9px] text-stone-400 font-semibold">{formatDate(tx.date)} · {tx.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className={`text-[11px] font-black ${tx.type === "INCOME" ? "text-emerald-600" : "text-stone-900"}`}>
                    {tx.type === "INCOME" ? "+" : "−"}{formatRp(tx.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50 text-stone-400 hover:text-red-600 transition-all cursor-pointer border-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {!loading && transactions.length === 0 && (
              <div className="text-center py-12 text-stone-300">
                <p className="text-xs font-bold">Belum ada transaksi terekam.</p>
              </div>
            )}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="lg:col-span-5 sketch-card bg-white p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-sm font-extrabold text-stone-900">Kategori Pengeluaran</h2>
            <p className="text-[11px] text-stone-400 mt-0.5">Komposisi pengeluaran</p>
          </div>

          {loading ? (
            <p className="text-xs font-bold text-stone-300 text-center py-12">Memuat grafik...</p>
          ) : donutData.length === 0 ? (
            <p className="text-xs text-stone-300 text-center py-12">Belum ada pengeluaran bulanan</p>
          ) : (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topDonut}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={48}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {topDonut.map((entry) => (
                        <Cell key={entry.name} fill={CATEGORY_HEX[entry.name] ?? entry.color ?? "#a8a29e"} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatRp(Number(value ?? 0))}
                      contentStyle={{ borderRadius: 12, border: "1px solid #E7DED4", fontSize: 10, fontWeight: 700 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
                {topDonut.map((item) => {
                  const pct = totalExpense > 0 ? (item.value / totalExpense) * 100 : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between text-[11px] font-bold py-0.5">
                      <span className="flex items-center gap-2 text-stone-700 truncate">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: CATEGORY_HEX[item.name] ?? item.color ?? "#a8a29e" }} />
                        {item.name}
                      </span>
                      <span className="text-[9px] font-black text-stone-500 shrink-0">{pct.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
