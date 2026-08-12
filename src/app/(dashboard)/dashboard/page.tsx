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
}

const CATEGORY_HEX: Record<string, string> = {
  "Makanan & Minuman": "#18181b",
  "Tagihan & Listrik": "#27272a",
  "Belanja / Toko": "#3f3f46",
  "Transportasi": "#52525b",
  "Langganan / Media": "#71717a",
  "Kesehatan": "#a1a1aa",
  "Hiburan": "#d4d4d8",
  "Pendidikan": "#e4e4e7",
  "Lainnya": "#f4f4f5",
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
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Baris Pertama: 3 Summary Cards murni style shadcn (aspect-video bg-muted/50) */}
      <div className="grid auto-rows-min gap-6 md:grid-cols-3">
        {/* Card 1: Saldo Bersih */}
        <div className="aspect-video rounded-xl bg-muted/50 p-6 flex flex-col justify-between border border-border/60 hover:bg-muted/80 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Saldo Bersih</span>
            <Wallet className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-semibold tracking-tight ${balance >= 0 ? "text-foreground" : "text-destructive"}`}>
              {loading ? "..." : formatRp(balance)}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">Total pemasukan − pengeluaran</p>
          </div>
        </div>

        {/* Card 2: Uang Masuk */}
        <div className="aspect-video rounded-xl bg-muted/50 p-6 flex flex-col justify-between border border-border/60 hover:bg-muted/80 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Uang Masuk</span>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-foreground tracking-tight">
              {loading ? "..." : formatRp(totalIncome)}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">Total terakumulasi masuk</p>
          </div>
        </div>

        {/* Card 3: Uang Keluar */}
        <div className="aspect-video rounded-xl bg-muted/50 p-6 flex flex-col justify-between border border-border/60 hover:bg-muted/80 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Uang Keluar</span>
            <TrendingDown className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-foreground tracking-tight">
              {loading ? "..." : formatRp(totalExpense)}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">Total terakumulasi keluar</p>
          </div>
        </div>
      </div>

      {/* Baris Kedua: Tren Arus Kas & Navigasi Cepat (murni style shadcn) */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Cash Flow Chart */}
        <div className="md:col-span-8 min-h-[320px] rounded-xl bg-muted/50 p-6 border border-border/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Tren Arus Kas</h2>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Pemasukan vs pengeluaran 5 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-3 text-[9px] font-black text-muted-foreground uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />Masuk
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground inline-block" />Keluar
              </span>
            </div>
          </div>

          <div className="flex-1 h-full min-h-0">
            {loading ? (
              <p className="text-xs font-bold text-muted-foreground w-full text-center py-20">Memuat grafik...</p>
            ) : monthlyData.every((m) => m.income === 0 && m.expense === 0) ? (
              <p className="text-xs font-bold text-muted-foreground w-full text-center py-20">Belum ada data bulanan</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#18181b" stopOpacity={0.10} />
                      <stop offset="100%" stopColor="#18181b" stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#71717a" stopOpacity={0.10} />
                      <stop offset="100%" stopColor="#71717a" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#71717a", fontWeight: 700 }} axisLine={{ stroke: "#e4e4e7" }} tickLine={false} />
                  <YAxis tickFormatter={(v: number) => (v >= 1000000 ? `${(v / 1000000).toFixed(0)}jt` : `${(v / 1000).toFixed(0)}k`)} tick={{ fontSize: 9, fill: "#71717a", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => formatRp(Number(value ?? 0))}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 11, fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,0.03)", background: "#ffffff" }}
                  />
                  <Area type="monotone" dataKey="income" name="Masuk" stroke="#18181b" strokeWidth={2} fill="url(#gradIncome)" />
                  <Area type="monotone" dataKey="expense" name="Keluar" stroke="#71717a" strokeWidth={2} fill="url(#gradExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Actions / Navigation */}
        <div className="md:col-span-4 rounded-xl bg-muted/50 p-6 border border-border/60 flex flex-col justify-between h-full min-h-[320px]">
          <div>
            <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Navigasi Cepat</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Pencatatan & riwayat transaksi.</p>
          </div>

          <div className="space-y-2 flex-1 flex flex-col justify-center">
            <Button asChild variant="outline" className="w-full justify-start h-10 border-border bg-white text-xs font-bold hover:bg-muted transition-colors">
              <Link href="/dashboard/transactions/new?type=expense" className="flex items-center gap-3">
                <ArrowDownRight className="w-4 h-4 text-destructive shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">Uang Keluar</p>
                  <p className="text-[9px] text-muted-foreground font-normal">Catat transaksi pengeluaran</p>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-10 border-border bg-white text-xs font-bold hover:bg-muted transition-colors">
              <Link href="/dashboard/transactions/new?type=income" className="flex items-center gap-3">
                <ArrowUpRight className="w-4 h-4 text-primary shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">Uang Masuk</p>
                  <p className="text-[9px] text-muted-foreground font-normal">Catat transaksi pemasukan</p>
                </div>
              </Link>
            </Button>
          </div>

          <Button asChild variant="outline" className="w-full h-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            <Link href="/dashboard/transactions">Semua Transaksi →</Link>
          </Button>
        </div>
      </div>

      {/* Baris Ketiga: Transaksi Terakhir & Donut Kategori (murni style shadcn) */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Recent Transactions */}
        <div className="md:col-span-7 rounded-xl bg-muted/50 p-6 border border-border/60 flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Transaksi Terakhir</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">{totalCount} transaksi tercatat</p>
          </div>

          <div className="divide-y divide-border/60 max-h-[280px] overflow-y-auto pr-1 flex-1">
            {loading ? (
              <p className="text-center py-12 text-muted-foreground text-xs font-bold">Memuat daftar...</p>
            ) : recentTx.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2.5 hover:bg-white/40 transition-colors group px-2 rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 bg-white border border-border/60">
                    {tx.type === "INCOME" ? <ArrowUpRight className="w-4 h-4 text-primary" /> : <ArrowDownRight className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold text-foreground truncate leading-normal">{tx.description}</p>
                    <p className="text-[9px] text-muted-foreground font-semibold">{formatDate(tx.date)} · {tx.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className={`text-[11px] font-bold ${tx.type === "INCOME" ? "text-foreground" : "text-muted-foreground"}`}>
                    {tx.type === "INCOME" ? "+" : "−"}{formatRp(tx.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {!loading && transactions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-xs font-bold">Belum ada transaksi terekam.</p>
              </div>
            )}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="md:col-span-5 rounded-xl bg-muted/50 p-6 border border-border/60 flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Kategori Pengeluaran</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Komposisi pengeluaran</p>
          </div>

          {loading ? (
            <p className="text-xs font-bold text-muted-foreground text-center py-12">Memuat grafik...</p>
          ) : donutData.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-12">Belum ada pengeluaran bulanan</p>
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
                        <Cell key={entry.name} fill={CATEGORY_HEX[entry.name] ?? "#71717a"} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatRp(Number(value ?? 0))}
                      contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 10, fontWeight: 700 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
                {topDonut.map((item) => {
                  const pct = totalExpense > 0 ? (item.value / totalExpense) * 100 : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between text-[10px] font-bold">
                      <span className="flex items-center gap-2 text-foreground truncate">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: CATEGORY_HEX[item.name] ?? "#71717a" }} />
                        {item.name}
                      </span>
                      <span className="text-[9px] font-black text-muted-foreground shrink-0">{pct.toFixed(0)}%</span>
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
