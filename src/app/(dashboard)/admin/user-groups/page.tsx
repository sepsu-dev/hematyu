"use client";

import { useEffect, useState } from "react";
import { UserCog, Plus, Pencil, Trash2, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
    getGroupsAction,
    createGroupAction,
    updateGroupAction,
    deleteGroupAction,
} from "@/app/dashboard/actions";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface UserGroupRow {
    id: string;
    name: string;
    description: string | null;
    is_system: boolean;
    member_count: number;
}

export default function AdminUserGroupsPage() {
    const [groups, setGroups] = useState<UserGroupRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: "", description: "" });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteName, setDeleteName] = useState("");

    const reload = async () => setGroups(await getGroupsAction());

    useEffect(() => {
        getGroupsAction().then((g) => {
            setGroups(g);
            setLoading(false);
        });
    }, []);

    const openModal = () => {
        setEditingId(null);
        setForm({ name: "", description: "" });
        setShowModal(true);
    };

    const openEditModal = (g: UserGroupRow) => {
        setEditingId(g.id);
        setForm({ name: g.name, description: g.description ?? "" });
        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) return;
        setShowModal(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || saving) return;
        setSaving(true);
        try {
            if (editingId) {
                await updateGroupAction(editingId, form);
                toast.success("Grup berhasil diperbarui!");
            } else {
                await createGroupAction(form);
                toast.success("Grup berhasil dibuat!");
            }
            setShowModal(false);
            await reload();
        } catch (err: any) {
            toast.error(err?.message || "Gagal menyimpan grup.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (g: UserGroupRow) => {
        if (g.is_system) return;
        setDeleteId(g.id);
        setDeleteName(g.name);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setConfirmOpen(false);
        try {
            await deleteGroupAction(deleteId);
            toast.success("Grup berhasil dihapus!");
            await reload();
        } catch (err: any) {
            toast.error(err?.message || "Gagal menghapus grup.");
        } finally {
            setDeleteId(null);
            setDeleteName("");
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                        <UserCog className="w-5 h-5 text-muted-foreground" />
                        User Group
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Kelola grup pengguna untuk pengaturan hak akses (privileges).</p>
                </div>
                <button
                    onClick={openModal}
                    className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" /> Tambah Grup
                </button>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-extrabold text-foreground">{editingId ? "Ubah Grup" : "Tambah Grup Baru"}</h2>
                            <button type="button" onClick={closeModal} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">Nama Grup <span className="text-destructive">*</span></label>
                                <input
                                    autoFocus
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="mis. Finance"
                                    className="h-9 w-full rounded-md border border-border bg-white px-3 text-xs font-semibold"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">Deskripsi</label>
                                <input
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Opsional"
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
                                    {saving ? <Spinner size={14} /> : editingId ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                    {editingId ? "Simpan Perubahan" : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="rounded-xl bg-muted/50 p-6 border border-border/60">
                <div className="space-y-2">
                    {loading ? (
                        <div className="flex items-center justify-center py-12"><Spinner size={24} /></div>
                    ) : (
                        groups.map((g) => (
                            <div key={g.id} className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-white p-4">
                                <div className="min-w-0">
                                    <p className="text-[13px] font-extrabold text-foreground flex items-center gap-2">
                                        {g.name}
                                        {g.is_system && (
                                            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                                System
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">{g.description ?? "—"}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-[10px] font-bold text-muted-foreground">{g.member_count} anggota</span>
                                    <button
                                        onClick={() => openEditModal(g)}
                                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                        title="Ubah"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    {!g.is_system && (
                                        <button
                                            onClick={() => handleDeleteClick(g)}
                                            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={confirmOpen}
                title="Hapus User Group"
                message={`Hapus grup pengguna "${deleteName}" secara permanen?`}
                confirmText="Hapus"
                cancelText="Batal"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmOpen(false)}
                variant="danger"
            />
        </div>
    );
}