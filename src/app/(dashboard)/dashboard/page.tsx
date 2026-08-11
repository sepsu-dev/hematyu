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
      getRecentTransactionsAction(6),
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

  const donutData = expenseBreakdown.map(({ category, total }) => ({
    name: category,
    value: total,
  }));
  const topDonut = donutData.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* ─── Page Title ─── */}
      <div>
        <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Dashboard</h1>
        <p className="text-xs text-stone-500 mt-0.5">Pantau dan catat keuangan harian Anda.</p>
      </div>

      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sketch-card bg-white p-5 space-y-4">
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
            <p className="text-[10px] text-stone-400 font-semibold mt-1">Total masuk − total keluar</p>
          </div>
          <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-1 bg-primary rounded-full transition-all"
              style={{ width: `${totalIncome > 0 ? Math.min((balance / totalIncome) * 100, 100) : 0}%` }}
            />
          </div>
        </div>

        <div className="sketch-card bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Uang Masuk</span>
          </div>
          <div>
            <p className="text-2xl font-black text-stone-900 tracking-tight">{loading ? "..." : formatRp(totalIncome)}</p>
            <p className="text-[10px] text-stone-400 font-semibold mt-1">
              {summary?.totalCount ? "Total semua transaksi" : "0 transaksi pemasukan"}
            </p>
          </div>
          <div className="h-1 w-full bg-emerald-100 rounded-full" />
        </div>

        <div className="sketch-card bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <TrendingDown className="w-4.5 h-4.5 text-[#E35B30]" />
            </div>
            <span className="text-[9px] font-black text-[#E35B30] uppercase tracking-widest">Uang Keluar</span>
          </div>
          <div>
            <p className="text-2xl font-black text-stone-900 tracking-tight">{loading ? "..." : formatRp(totalExpense)}</p>
            <p className="text-[10px] text-stone-400 font-semibold mt-1">
              {summary?.totalCount ? "Total semua transaksi" : "0 transaksi pengeluaran"}
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

      {/* ─── Main Grid ─── */}
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

        {/* Cash Flow Area Chart */}
        <div className="lg:col-span-8 sketch-card bg-white p-6 space-y-4">
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
          <div className="h-56">
            {loading ? (
              <p className="text-sm font-bold text-stone-300 w-full text-center py-20">Memuat...</p>
            ) : monthlyData.every((m) => m.income === 0 && m.expense === 0) ? (
              <p className="text-sm font-bold text-stone-300 w-full text-center py-20">Belum ada data</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E35B30" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#E35B30" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFE7DD" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#A8A29E", fontWeight: 700 }} axisLine={{ stroke: "#E7DED4" }} tickLine={false} />
                  <YAxis tickFormatter={(v: number) => (v >= 1000000 ? `${(v / 1000000).toFixed(0)}jt` : `${(v / 1000).toFixed(0)}k`)} tick={{ fontSize: 10, fill: "#A8A29E", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => formatRp(Number(value ?? 0))}
                    contentStyle={{ borderRadius: 12, border: "1px solid #E7DED4", fontSize: 12, fontWeight: 700, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                  />
                  <Area type="monotone" dataKey="income" name="Masuk" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#gradIncome)" />
                  <Area type="monotone" dataKey="expense" name="Keluar" stroke="#E35B30" strokeWidth={2.5} fill="url(#gradExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* ─── Bottom Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-7 sketch-card bg-white p-6 space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-stone-900">Transaksi Terakhir</h2>
            <p className="text-[11px] text-stone-400 mt-0.5">{totalCount} transaksi tercatat</p>
          </div>
          <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
            {loading ? (
              <p className="text-center py-12 text-stone-300 text-sm font-bold">Memuat...</p>
            ) : recentTx.map((tx) => (
              <div key={tx.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#FAF6F0] transition-all group cursor-default">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tx.type === "INCOME" ? "bg-emerald-50" : "bg-orange-50"
                    }`}>
                    {tx.type === "INCOME"
                      ? <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                      : <ArrowDownRight className="w-4 h-4 text-[#E35B30]" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-stone-800 truncate">{tx.description}</p>
                    <p className="text-[10px] text-stone-400">{formatDate(tx.date)} · {tx.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-black ${tx.type === "INCOME" ? "text-emerald-600" : "text-stone-800"}`}>
                    {tx.type === "INCOME" ? "+" : "−"}{formatRp(tx.amount)}
                  </span>
                  <button onClick={() => handleDelete(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 text-stone-300 hover:text-red-400 transition-all">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {!loading && transactions.length === 0 && (
              <div className="text-center py-12 text-stone-300">
                <p className="text-sm font-bold">Belum ada transaksi</p>
              </div>
            )}
          </div>
        </div>

        {/* Expense Donut */}
        <div className="lg:col-span-5 sketch-card bg-white p-6 space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-stone-900">Pengeluaran</h2>
            <p className="text-[11px] text-stone-400 mt-0.5">Komposisi per kategori</p>
          </div>
          {loading ? (
            <p className="text-sm font-bold text-stone-300 text-center py-12">Memuat...</p>
          ) : donutData.length === 0 ? (
            <p className="text-xs text-stone-300 text-center py-12">Belum ada pengeluaran</p>
          ) : (
            <>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topDonut}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {topDonut.map((entry) => (
                        <Cell key={entry.name} fill={CATEGORY_HEX[entry.name] ?? "#a8a29e"} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatRp(Number(value ?? 0))}
                      contentStyle={{ borderRadius: 12, border: "1px solid #E7DED4", fontSize: 12, fontWeight: 700 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {topDonut.map((item) => {
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
      </div>
    </div>
  );
}