"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  Users,
  ArrowLeftRight,
  TrendingUp,
  Activity,
  Crown,
  Calendar,
  BadgeCheck,
  User,
  RefreshCw,
} from "lucide-react";
import { getAdminStatsAction, getAdminUserListAction } from "@/app/dashboard/actions";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  thisMonthTransactions: number;
  totalVolume: number;
  thisMonthVolume: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  group_names: string[];
  created_at: string;
  total_transactions: number;
  total_income: number;
  total_expense: number;
  last_transaction: string | null;
}

function formatRp(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminLaporanPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = async () => {
    setLoading(true);
    try {
      const [s, u] = await Promise.all([getAdminStatsAction(), getAdminUserListAction()]);
      setStats(s);
      setUsers(u);
      setLastRefresh(new Date());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const statCards = stats ? [
    {
      label: "Total User", value: stats.totalUsers, icon: Users,
      color: "text-primary", bg: "bg-primary/10",
      sub: `${stats.activeUsers} aktif 30 hari ini`,
    },
    {
      label: "User Aktif", value: stats.activeUsers, icon: Activity,
      color: "text-emerald-600", bg: "bg-emerald-50",
      sub: `${stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% dari total user`,
    },
    {
      label: "Total Transaksi", value: stats.totalTransactions.toLocaleString("id-ID"), icon: ArrowLeftRight,
      color: "text-[#E35B30]", bg: "bg-orange-50",
      sub: `${stats.thisMonthTransactions} transaksi bulan ini`,
    },
  ] : [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-black rounded border border-amber-200 uppercase tracking-widest">Superadmin</span>
          </div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Laporan Admin</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Statistik seluruh platform hemat.yu. Terakhir diperbarui: {formatDateTime(lastRefresh.toISOString())}
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E7DED4] hover:bg-stone-50 transition-all rounded-lg shadow-sm text-xs font-extrabold text-stone-600 disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading && !stats ? Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="sketch-card bg-white p-5 animate-pulse">
            <div className="h-3 bg-stone-100 rounded w-2/3 mb-3" />
            <div className="h-7 bg-stone-100 rounded w-1/2 mb-2" />
            <div className="h-2.5 bg-stone-100 rounded w-full" />
          </div>
        )) : statCards.map((s) => (
          <div key={s.label} className="sketch-card bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{s.label}</p>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-black tracking-tight ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-stone-400 font-semibold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* User Table */}
      <div className="sketch-card bg-white overflow-hidden">
        <div className="p-5 border-b border-[#E7DED4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-extrabold text-stone-900">Daftar Semua User</h2>
          </div>
          <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
            {users.length} user
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-[#E7DED4]">
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">No</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">User</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Role</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Tgl Daftar</th>
                <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Transaksi</th>
                <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Transaksi Terakhir</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12"><div className="flex items-center justify-center"><Spinner size={24} /></div></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-stone-300 font-bold">Belum ada user</td></tr>
              ) : users.map((u, i) => {
                const isAdmin = u.group_names.includes("Superadmin");
                const isActive = u.last_transaction && new Date(u.last_transaction) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                return (
                  <tr key={u.id} className={`border-b border-[#E7DED4] last:border-0 transition-colors ${isAdmin ? "bg-amber-50/50" : "hover:bg-[#FAF6F0]"}`}>
                    <td className="px-5 py-4 text-stone-400 font-bold">{i + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isAdmin ? "bg-amber-100" : "bg-primary/10"}`}>
                          {isAdmin
                            ? <Crown className="w-3.5 h-3.5 text-amber-600" />
                            : <User className="w-3.5 h-3.5 text-primary" />
                          }
                        </div>
                        <div>
                          <p className="font-bold text-stone-700">{u.name}</p>
                          <p className="text-[10px] text-stone-400">{u.email}</p>
                        </div>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Aktif 30 hari" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {u.group_names.length === 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-stone-100 text-stone-500">
                            Tanpa grup
                          </span>
                        ) : (
                          u.group_names.map((gn) => (
                            <span key={gn} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${gn === "Superadmin" ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-500"}`}>
                              {gn === "Superadmin" && <BadgeCheck className="w-3 h-3" />}
                              {gn}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-stone-500 font-bold">
                        <Calendar className="w-3 h-3 text-stone-300" />
                        {formatDate(u.created_at)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-black text-stone-700">{u.total_transactions.toLocaleString("id-ID")}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-stone-400 font-bold">{formatDateTime(u.last_transaction)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Net Total Row */}
            {users.length > 0 && !loading && (
              <tfoot>
                <tr className="bg-stone-50 border-t-2 border-[#E7DED4]">
                  <td colSpan={4} className="px-5 py-3 text-xs font-extrabold text-stone-500">Total Platform</td>
                  <td className="px-5 py-3 text-right font-black text-stone-700">
                    {users.reduce((s, u) => s + u.total_transactions, 0).toLocaleString("id-ID")}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
