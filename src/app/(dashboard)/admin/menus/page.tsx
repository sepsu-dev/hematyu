"use client";

import React, { useEffect, useState } from "react";
import { Menu as MenuIcon, Plus, X, Pencil, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
    getRbacMenusAction,
    createMenuAction,
    updateMenuAction,
    deleteMenuAction,
} from "@/app/dashboard/actions";
import { IconListGrid, getIcon } from "@/components/icon-list";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface RbacMenuRow {
    id: string;
    parent_id: string | null;
    label: string;
    path: string | null;
    icon_name: string;
    sort_order: number;
    is_active: boolean;
}

const EMPTY_FORM = { label: "", parent_id: "", path: "", icon_name: "circle", sort_order: 0 };

export default function AdminMenusPage() {
    const [menus, setMenus] = useState<RbacMenuRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const reload = async () => setMenus(await getRbacMenusAction());

    useEffect(() => {
        reload().then(() => setLoading(false));
    }, []);

    const openModal = (menu?: RbacMenuRow) => {
        if (menu) {
            setEditId(menu.id);
            setForm({
                label: menu.label,
                parent_id: menu.parent_id ?? "",
                path: menu.path ?? "",
                icon_name: menu.icon_name || "circle",
                sort_order: menu.sort_order,
            });
        } else {
            setEditId(null);
            setForm(EMPTY_FORM);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) return;
        setShowModal(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.label.trim() || saving) return;
        setSaving(true);
        try {
            if (editId) {
                await updateMenuAction(editId, {
                    label: form.label,
                    parent_id: form.parent_id || null,
                    path: form.path?.trim() || null,
                    icon_name: form.icon_name || "circle",
                    sort_order: Number(form.sort_order) || 0,
                });
                toast.success("Menu berhasil diperbarui!");
            } else {
                await createMenuAction({
                    label: form.label,
                    parent_id: form.parent_id || null,
                    path: form.path?.trim() || null,
                    icon_name: form.icon_name || "circle",
                    sort_order: Number(form.sort_order) || 0,
                });
                toast.success("Menu berhasil dibuat!");
            }
            setShowModal(false);
            await reload();
        } catch (err: any) {
            toast.error(err?.message || "Gagal menyimpan menu.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setConfirmOpen(false);
        setLoading(true);
        try {
            await deleteMenuAction(deleteId);
            toast.success("Menu berhasil dihapus!");
            await reload();
        } catch (err: any) {
            toast.error(err?.message || "Gagal menghapus menu.");
        } finally {
            setLoading(false);
            setDeleteId(null);
        }
    };

    const parents = menus.filter((m) => m.parent_id === null);
    const childrenOf = (pid: string) => menus.filter((m) => m.parent_id === pid);

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                        <MenuIcon className="w-5 h-5 text-muted-foreground" />
                        Menu
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Kelola menu navigasi sidebar (sumber kebenaran dari DB).</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" /> Tambah Menu
                </button>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-extrabold text-foreground">
                                {editId ? "Ubah Menu" : "Tambah Menu Baru"}
                            </h2>
                            <button type="button" onClick={closeModal} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">Label <span className="text-destructive">*</span></label>
                                <input
                                    autoFocus
                                    value={form.label}
                                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                                    placeholder="mis. Pengaturan"
                                    className="h-9 w-full rounded-md border border-border bg-white px-3 text-xs font-semibold"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">Induk</label>
                                <Select value={form.parent_id || "none"} onValueChange={(val) => setForm({ ...form, parent_id: val === "none" ? "" : val })}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih induk..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">— Tanpa Induk (menu utama) —</SelectItem>
                                    {parents.filter(p => p.id !== editId).map((p) => (
                                      <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">Path</label>
                                <input
                                    value={form.path}
                                    onChange={(e) => setForm({ ...form, path: e.target.value })}
                                    placeholder="/admin/pengaturan"
                                    className="h-9 w-full rounded-md border border-border bg-white px-3 text-xs font-semibold"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">Icon</label>
                                <IconListGrid
                                    selected={form.icon_name}
                                    onSelect={(name) => setForm({ ...form, icon_name: name })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">Urutan</label>
                                <input
                                    type="number"
                                    value={form.sort_order}
                                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                                    className="h-9 w-full rounded-md border border-border bg-white px-3 text-xs font-semibold"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-1">
                                <button type="button" onClick={closeModal}
                                    className="px-4 py-2.5 rounded-lg border border-border text-xs font-extrabold text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
                                    Batal
                                </button>
                                <button type="submit" disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs font-extrabold disabled:opacity-60 cursor-pointer">
                                    {saving ? <Spinner size={14} /> : <Plus className="w-3.5 h-3.5" />}
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="rounded-xl bg-muted/50 p-6 border border-border/60">
                {loading ? (
                    <div className="flex items-center justify-center py-12"><Spinner size={24} /></div>
                ) : (
                    <div className="space-y-2">
                        {parents.map((p) => {
                            const kids = childrenOf(p.id);
                            const ParentIcon = getIcon(p.icon_name);
                            return (
                                <div key={p.id} className="rounded-lg border border-border/60 bg-white p-4 group">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[13px] font-extrabold text-foreground flex items-center gap-2">
                                            <ParentIcon className="w-4 h-4 text-stone-500" />
                                            {p.label}
                                            <span className="text-[9px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded font-bold">{p.icon_name}</span>
                                            {p.path && <span className="text-[10px] font-semibold text-primary">{p.path}</span>}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openModal(p)}
                                                className="p-1 hover:bg-stone-100 text-stone-400 hover:text-stone-700 rounded transition-colors cursor-pointer border-none bg-transparent">
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => handleDeleteClick(p.id)}
                                                className="p-1 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded transition-colors cursor-pointer border-none bg-transparent">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    {kids.length > 0 && (
                                        <div className="mt-2 ml-6 space-y-1">
                                            {kids.map((c) => {
                                                const ChildIcon = getIcon(c.icon_name);
                                                return (
                                                    <div key={c.id} className="flex items-center justify-between py-0.5 group/child">
                                                        <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                                                            <ChildIcon className="w-3.5 h-3.5 text-stone-400" />
                                                            {c.label}
                                                            <span className="text-[9px] bg-stone-100/60 text-stone-400 px-1.5 py-0.5 rounded font-bold">{c.icon_name}</span>
                                                            <span className="text-[10px] font-semibold text-primary">{c.path}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-0 group-hover/child:opacity-100 transition-opacity">
                                                            <button onClick={() => openModal(c)}
                                                                className="p-1 hover:bg-stone-100 text-stone-400 hover:text-stone-700 rounded transition-colors cursor-pointer border-none bg-transparent">
                                                                <Pencil className="w-3 h-3" />
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(c.id)}
                                                                className="p-1 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded transition-colors cursor-pointer border-none bg-transparent">
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={confirmOpen}
                title="Hapus Menu"
                message="Apakah Anda yakin ingin menghapus menu ini? Semua sub-menu juga akan ikut terhapus secara permanen."
                confirmText="Hapus"
                cancelText="Batal"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmOpen(false)}
                variant="danger"
            />
        </div>
    );
}