"use client";

import { useEffect, useState } from "react";
import { KeyRound } from "lucide-react";
import {
    getGroupsAction,
    getRbacMenusAction,
    getPrivilegesAction,
    setPrivilegeAction,
    getMenuActionsAction,
} from "@/app/dashboard/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface UserGroupRow {
    id: string;
    name: string;
    description: string | null;
    is_system: boolean;
    member_count: number;
}

interface RbacMenuRow {
    id: string;
    parent_id: string | null;
    label: string;
    path: string | null;
    icon_name: string;
    sort_order: number;
    is_active: boolean;
}

interface PrivilegeRow {
    group_id: string;
    menu_id: string;
    actions: string[];
    menu_label: string;
    menu_path: string | null;
}

export default function AdminUserPrivilegesPage() {
    const [groups, setGroups] = useState<UserGroupRow[]>([]);
    const [menus, setMenus] = useState<RbacMenuRow[]>([]);
    const [privileges, setPrivileges] = useState<PrivilegeRow[]>([]);
    const [allActions, setAllActions] = useState<{ id: string; code: string; label: string }[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getGroupsAction(), getRbacMenusAction(), getPrivilegesAction(), getMenuActionsAction()])
            .then(([g, m, p, a]) => {
                setGroups(g);
                setMenus(m);
                setPrivileges(p);
                setAllActions(a);
                if (g.length > 0) setSelectedGroup(g[0].id);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const currentPriv = (menuId: string) =>
        privileges.find((p) => p.group_id === selectedGroup && p.menu_id === menuId)?.actions ?? [];

    const menuParents = menus.filter((m) => m.parent_id === null && m.path === null);
    const childrenOf = (parentId: string) => menus.filter((m) => m.parent_id === parentId);

    const handleToggle = async (menuId: string, action: string) => {
        const current = currentPriv(menuId);
        const next = current.includes(action)
            ? current.filter((a) => a !== action)
            : [...current, action];
        try {
            await setPrivilegeAction(selectedGroup, menuId, next);
            toast.success("Hak akses berhasil diperbarui!");
            const fresh = await getPrivilegesAction();
            setPrivileges(fresh);
        } catch (err: any) {
            toast.error(err?.message || "Gagal memperbarui hak akses.");
        }
    };

    const handleAll = async (menuId: string, checked: boolean) => {
        try {
            await setPrivilegeAction(selectedGroup, menuId, checked ? allActions.map((a) => a.code) : []);
            toast.success("Semua hak akses menu berhasil diperbarui!");
            const fresh = await getPrivilegesAction();
            setPrivileges(fresh);
        } catch (err: any) {
            toast.error(err?.message || "Gagal memperbarui hak akses.");
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div>
                <h1 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-muted-foreground" />
                    User Privileges
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">Atur hak akses aksi per menu untuk setiap grup.</p>
            </div>

            <div className="rounded-xl bg-muted/50 p-6 border border-border/60">
                <div className="mb-6">
                    <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-1">Grup</p>
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Pilih grup..." />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((g) => (
                          <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>

                {loading ? (
                    <p className="text-xs font-bold text-muted-foreground text-center py-12">Memuat hak akses...</p>
                ) : (
                    <div className="space-y-6">
                        {menuParents.map((parent) => {
                            const kids = childrenOf(parent.id);
                            return (
                                <div key={parent.id} className="rounded-lg border border-border/60 bg-white p-4">
                                    <p className="text-[13px] font-extrabold text-foreground mb-3">{parent.label}</p>
                                    <div className="space-y-2">
                                        {kids.length > 0 ? kids.map((child) => (
                                            <div key={child.id} className="flex items-center justify-between gap-4 py-1.5 border-b border-border/40 last:border-0">
                                                <div>
                                                    <p className="text-xs font-bold text-foreground">{child.label}</p>
                                                    <p className="text-[10px] text-muted-foreground font-medium">{child.path}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={allActions.length > 0 && currentPriv(child.id).length === allActions.length}
                                                            onChange={(e) => handleAll(child.id, e.target.checked)}
                                                            className="accent-primary"
                                                        />
                                                        Semua
                                                    </label>
                                                    {allActions.map((act) => (
                                                        <label key={act.code} className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground capitalize cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={currentPriv(child.id).includes(act.code)}
                                                                onChange={() => handleToggle(child.id, act.code)}
                                                                className="accent-primary"
                                                            />
                                                            {act.label}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="flex items-center justify-between gap-4 py-1.5">
                                                <div>
                                                    <p className="text-xs font-bold text-foreground">{parent.label}</p>
                                                    <p className="text-[10px] text-muted-foreground font-medium">{parent.path ?? "Grup (induk)"}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={allActions.length > 0 && currentPriv(parent.id).length === allActions.length}
                                                            onChange={(e) => handleAll(parent.id, e.target.checked)}
                                                            className="accent-primary"
                                                        />
                                                        Semua
                                                    </label>
                                                    {allActions.map((act) => (
                                                        <label key={act.code} className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground capitalize cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={currentPriv(parent.id).includes(act.code)}
                                                                onChange={() => handleToggle(parent.id, act.code)}
                                                                className="accent-primary"
                                                            />
                                                            {act.label}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}