import { pool } from "@/lib/db";

export type CatType = "INCOME" | "EXPENSE";

export interface CategoryRow {
    id: string;
    name: string;
    type: CatType;
    is_default: boolean;
}

export async function getCategories(userId: string): Promise<CategoryRow[]> {
    const { rows } = await pool.query(
        `SELECT id, name, type, is_default
         FROM categories
         WHERE user_id = $1
           AND deleted_at IS NULL
         ORDER BY is_default DESC, type, name ASC`,
        [userId]
    );
    return rows;
}

export async function createCategory(data: {
    userId: string;
    name: string;
    type: CatType;
}): Promise<CategoryRow> {
    const { rows } = await pool.query(
        `INSERT INTO categories (user_id, name, type)
         VALUES ($1, $2, $3)
         RETURNING id, name, type, is_default`,
        [data.userId, data.name.trim(), data.type]
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