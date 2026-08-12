import { pool } from "@/lib/db";

export type CatType = "INCOME" | "EXPENSE";

export interface CategoryRow {
    id: string;
    name: string;
    type: CatType;
    is_default: boolean;
    icon_name?: string;
    color_hex?: string;
}

export async function getCategories(userId: string): Promise<CategoryRow[]> {
    const { rows } = await pool.query(
        `WITH merged AS (
           SELECT DISTINCT ON (name, type) id, name, type, is_default, icon_name, color_hex
           FROM categories
           WHERE (user_id = $1 OR user_id IS NULL)
             AND deleted_at IS NULL
           ORDER BY name, type, user_id NULLS LAST
         )
         SELECT id, name, type, is_default, icon_name, color_hex
         FROM merged
         ORDER BY is_default DESC, type, name ASC`,
        [userId]
    );
    return rows;
}

export async function createCategory(data: {
    userId: string;
    name: string;
    type: CatType;
    iconName?: string;
    colorHex?: string;
}): Promise<CategoryRow> {
    const { rows } = await pool.query(
        `INSERT INTO categories (user_id, name, type, icon_name, color_hex)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, type, is_default, icon_name, color_hex`,
        [data.userId, data.name.trim(), data.type, data.iconName || 'circle', data.colorHex || '#71717a']
    );
    return rows[0];
}

export async function deleteCategory(id: string, userId: string): Promise<boolean> {
    // Guard: never soft-delete default categories
    const { rowCount } = await pool.query(
        `UPDATE categories
         SET deleted_at = NOW()
         WHERE id = $1 AND user_id = $2 AND is_default = FALSE AND deleted_at IS NULL`,
        [id, userId]
    );
    return (rowCount ?? 0) > 0;
}