"use client";

import { useEffect, useState } from "react";
import { ListChecks, Plus, Trash2, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";
import {
    getMenuActionsAction,
    createMenuActionAction,
    deleteMenuActionAction,
} from "@/app/dashboard/actions";

interface MenuActionRow {
    id: string;
    code: string;
    label: string;
}

const EMPTY_FORM = { code: "", label: "" };

export default function AdminMenuActionsPage() {
    const [actions, setActions] = useState<MenuActionRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const reload = async () => setActions(await getMenuActionsAction());

    useEffect(() => {
        getMenuActionsAction()
            .then((a) => {
                setActions(a);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const openModal = () => {
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) return;
        setShowModal(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.code.trim() || !form.label.trim() || saving) return;
        setSaving(true);
        try {
            await createMenuActionAction(form);
            toast.success("Aksi menu berhasil dibuat!");
            setShowModal(false);
            await reload();
        } catch (err: any) {
            toast.error(err?.message || "Gagal menyimpan aksi menu.");
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
            await deleteMenuActionAction(deleteId);
            toast.success("Aksi menu berhasil dihapus!");
            await reload();
        } catch (err: any) {
            toast.error(err?.message || "Gagal menghapus aksi menu.");
        } finally {
            setLoading(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                        <ListChecks className="w-5 h-5 text-muted-foreground" />
                        Menu Action
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Kelola daftar master aksi CRUD global yang tersedia.</p>
                </div>
                <button
                    onClick={openModal}
                    className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" /> Tambah Aksi
                </button>
            </div>

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-extrabold text-foreground">Tambah Aksi Baru</h2>
                            <button type="button" onClick={closeModal} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">Nama Aksi <span className="text-destructive">*</span></label>
                                <input
                                    type="text"
                                    value={form.label}
                                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                                    placeholder="Contoh: Tambah, Ubah, Ekspor..."
                                    className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold placeholder:text-stone-300"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">Kode Aksi <span className="text-destructive">*</span></label>
                                <input
                                    type="text"
                                    value={form.code}
                                    onChange={(e) => setForm({ ...form, code: e.target.value.toLowerCase().replace(/\s+/g, "_") })}
                                    placeholder="Contoh: create, update, export..."
                                    className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#E7DED4] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-stone-900 text-xs font-bold placeholder:text-stone-300"
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
                    <p className="text-xs font-bold text-muted-foreground text-center py-12">Memuat aksi...</p>
                ) : (
                    <div className="space-y-2">
                        {actions.map((a) => (
                            <div key={a.id} className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-white p-4">
                                <div className="min-w-0">
                                    <p className="text-[13px] font-extrabold text-foreground">{a.label}</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        Kode: <span className="text-primary font-bold">{a.code}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteClick(a.id)}
                                    className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                    title="Hapus"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={confirmOpen}
                title="Hapus Aksi Menu"
                message="Apakah Anda yakin ingin menghapus aksi menu ini? Ini akan membatalkan hak akses terkait pada kelompok hak akses."
                confirmText="Hapus"
                cancelText="Batal"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmOpen(false)}
                variant="danger"
            />
        </div>
    );
}