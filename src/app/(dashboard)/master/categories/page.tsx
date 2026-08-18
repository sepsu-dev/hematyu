"use client";

import { useEffect, useState } from "react";
import { Tag, Plus, Trash2, Check, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  getMasterCategoriesAction,
  createMasterCategoryAction,
  deleteMasterCategoryAction,
} from "@/app/dashboard/actions";
import { IconListGrid, getIcon } from "@/components/icon-list";
import {
  ConfirmDialog,
} from "@/components/confirm-dialog";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MasterCategory {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  icon_name?: string;
  color_hex?: string;
  created_at: string;
}

export default function MasterCategoriesPage() {
  const [categories, setCategories] = useState<MasterCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [newIconName, setNewIconName] = useState("circle");
  const [adding, setAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const load = () => {
    getMasterCategoriesAction()
      .then(setCategories)
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openModal = () => {
    setNewName("");
    setNewType("EXPENSE");
    setNewIconName("circle");
    setShowModal(true);
  };

  const closeModal = () => {
    if (adding) return;
    setShowModal(false);
  };

  const handleAdd = async () => {
    const val = newName.trim();
    if (!val) return;
    setAdding(true);
    try {
      await createMasterCategoryAction({ name: val, type: newType, iconName: newIconName });
      toast.success("Kategori master berhasil ditambahkan!");
      setNewName("");
      closeModal();
      load();
    } catch (err: any) {
      toast.error(err?.message || "Gagal menambahkan kategori master.");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setConfirmOpen(false);
    try {
      await deleteMasterCategoryAction(deleteId);
      toast.success("Kategori master berhasil dihapus!");
      load();
    } catch (err: any) {
      toast.error(err?.message || "Gagal menghapus kategori master.");
    } finally {
      setDeleteId(null);
    }
  };

  const income = categories.filter((c) => c.type === "INCOME");
  const expense = categories.filter((c) => c.type === "EXPENSE");

  return (
    <div className="space-y-6 p-6 relative">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Kategori</h1>
          <p className="text-xs text-stone-500 mt-0.5">Kelola kategori global yang tersedia untuk semua user.</p>
        </div>
        <button onClick={openModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white hover:bg-amber-600 transition-all rounded-lg shadow-sm text-xs font-extrabold">
          <Plus className="w-3.5 h-3.5" />
          Tambah Kategori
        </button>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-stone-900">Tambah Kategori Baru</h2>
              <button type="button" onClick={closeModal} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Nama Kategori</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Makanan, Gaji..."
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 text-stone-900 text-xs font-bold placeholder:text-stone-300" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Tipe</label>
                <Select value={newType} onValueChange={(val) => setNewType(val as "INCOME" | "EXPENSE")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih tipe..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Uang Masuk</SelectItem>
                    <SelectItem value="EXPENSE">Uang Keluar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">Ikon</label>
                <IconListGrid selected={newIconName} onSelect={(name) => setNewIconName(name)} />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal}
                  className="px-4 py-2.5 rounded-lg border border-[#E7DED4] text-xs font-extrabold text-stone-500 hover:bg-stone-50 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={adding || !newName.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white hover:bg-amber-600 rounded-lg text-xs font-extrabold disabled:opacity-60">
                  {adding ? <Spinner size={14} /> : <Plus className="w-3.5 h-3.5" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Two-table layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income */}
        <div className="sketch-card bg-white overflow-hidden">
          <div className="p-5 border-b border-[#E7DED4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                <span className="text-xs">🟢</span>
              </div>
              <h2 className="text-sm font-extrabold text-stone-900">Uang Masuk</h2>
            </div>
            <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{income.length} kategori</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#FAF6F0] border-b border-[#E7DED4]">
                  <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">No</th>
                  <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Nama</th>
                  <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="text-center py-8 text-stone-300 font-bold">Memuat...</td></tr>
                ) : income.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-8 text-stone-300 font-bold">Belum ada kategori masuk</td></tr>
                ) : income.map((c, i) => {
                  const Icon = getIcon(c.icon_name ?? 'circle');
                  return (
                    <tr key={c.id} className="border-b border-[#E7DED4] last:border-0 hover:bg-[#FAF6F0] transition-colors group">
                      <td className="px-5 py-3.5 text-stone-400 font-bold">{i + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="font-bold text-stone-700">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={() => handleDeleteClick(c.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-stone-300 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">Hapus</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense */}
        <div className="sketch-card bg-white overflow-hidden">
          <div className="p-5 border-b border-[#E7DED4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-orange-50 flex items-center justify-center">
                <span className="text-xs">🔴</span>
              </div>
              <h2 className="text-sm font-extrabold text-stone-900">Uang Keluar</h2>
            </div>
            <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{expense.length} kategori</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#FAF6F0] border-b border-[#E7DED4]">
                  <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">No</th>
                  <th className="text-left px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Nama</th>
                  <th className="text-right px-5 py-3 font-extrabold text-stone-500 uppercase tracking-wider text-[10px]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="text-center py-8 text-stone-300 font-bold">Memuat...</td></tr>
                ) : expense.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-8 text-stone-300 font-bold">Belum ada kategori keluar</td></tr>
                ) : expense.map((c, i) => {
                  const Icon = getIcon(c.icon_name ?? 'circle');
                  return (
                    <tr key={c.id} className="border-b border-[#E7DED4] last:border-0 hover:bg-[#FAF6F0] transition-colors group">
                      <td className="px-5 py-3.5 text-stone-400 font-bold">{i + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-[#E35B30] shrink-0" />
                          <span className="font-bold text-stone-700">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={() => handleDeleteClick(c.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-stone-300 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">Hapus</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Hapus Kategori Master"
        message="Hapus kategori master ini secara permanen?"
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        variant="danger"
      />
    </div>
  );
}