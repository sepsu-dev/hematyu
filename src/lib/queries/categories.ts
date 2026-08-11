import { pool, DEMO_USER_ID } from "../db";
import type { TxType } from "./transactions";

export interface CategoryRow {
    id: string;
    name: string;
    type: TxType;
    is_default: boolean;
}

export async function getCategories(userId: string = DEMO_USER_ID): Promise<CategoryRow[]> {
    const { rows } = await pool.query(
        `SELECT id, name, type, is_default
         FROM categories
         WHERE user_id = $1
         ORDER BY type, name`,
        [userId]
    );
    return rows;
}

export async function getCategoriesByType(type: TxType, userId: string = DEMO_USER_ID): Promise<CategoryRow[]> {
    const { rows } = await pool.query(
        `SELECT id, name, type, is_default
         FROM categories
         WHERE user_id = $1 AND type = $2
         ORDER BY name`,
        [userId, type]
    );
    return rows;
}

export async function createCategory(data: {
    userId?: string;
    name: string;
    type: TxType;
}): Promise<CategoryRow> {
    const { rows } = await pool.query(
        `INSERT INTO categories (user_id, name, type)
         VALUES ($1, $2, $3)
         RETURNING id, name, type, is_default`,
        [data.userId ?? DEMO_USER_ID, data.name, data.type]
    );
    return rows[0];
}

export async function deleteCategory(id: string, userId: string = DEMO_USER_ID): Promise<boolean> {
    const { rowCount } = await pool.query(
        `DELETE FROM categories WHERE id = $1 AND user_id = $2 AND is_default = FALSE`,
        [id, userId]
    );
    return (rowCount ?? 0) > 0;
}