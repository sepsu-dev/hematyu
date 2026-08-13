import { unstable_cache } from "next/cache";
import { pool } from "@/lib/db";

export interface MenuRow {
    id: string;
    parent_id: string | null;
    label: string;
    path: string | null;
    icon_name: string;
    sort_order: number;
    children?: MenuRow[];
}

export interface MenuNode {
    id: string;
    label: string;
    path: string | null;
    icon_name: string;
    sort_order: number;
    children: MenuNode[];
}

export async function getMenusForUser(userId: string): Promise<MenuNode[]> {
    // Cache server: revalidate 60s supaya navigasi SPA tidak query DB lagi.
    // (Menu juga tersimpan di Zustand client setelah load pertama — lihat menu-store.ts)
    return unstable_cache(
        async () => {
            const { rows } = await pool.query<MenuRow>(
                `WITH privilege_menus AS (
                   SELECT DISTINCT p.menu_id
                   FROM user_privileges p
                   JOIN users u ON u.group_id = p.group_id
                   WHERE u.id = $1
                 )
                 SELECT m.id, m.parent_id, m.label, m.path, m.icon_name, m.sort_order
                 FROM menus m
                 WHERE m.deleted_at IS NULL AND m.is_active
                   AND (m.id IN (SELECT menu_id FROM privilege_menus)
                        OR m.parent_id IN (SELECT menu_id FROM privilege_menus))
                 ORDER BY m.sort_order ASC, m.label ASC`,
                [userId]
            );
            return buildTree(rows);
        },
        [userId],
        { revalidate: 60 }
    )();
}

function buildTree(rows: MenuRow[]): MenuNode[] {
    const map = new Map<string, MenuNode>();
    for (const r of rows) {
        map.set(r.id, {
            id: r.id,
            label: r.label,
            path: r.path,
            icon_name: r.icon_name,
            sort_order: r.sort_order,
            children: [],
        });
    }
    const roots: MenuNode[] = [];
    for (const r of rows) {
        const node = map.get(r.id)!;
        if (r.parent_id && map.has(r.parent_id)) {
            map.get(r.parent_id)!.children.push(node);
        } else {
            roots.push(node);
        }
    }
    const sort = (nodes: MenuNode[]) => nodes.sort((a, b) => a.sort_order - b.sort_order);
    const rec = (nodes: MenuNode[]) => {
        sort(nodes);
        for (const n of nodes) rec(n.children);
    };
    rec(roots);
    return roots.filter((n) => n.children.length > 0 || n.path !== null);
}