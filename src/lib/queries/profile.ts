import { pool, DEMO_USER_ID } from "../db";

export interface ProfileRow {
    id: string;
    name: string;
    email: string;
    phone: string | null;
}

export async function getProfile(userId: string = DEMO_USER_ID): Promise<ProfileRow | null> {
    const { rows } = await pool.query(
        `SELECT id, name, email, phone FROM users WHERE id = $1`,
        [userId]
    );
    return rows[0] ?? null;
}

export async function updateProfile(
    data: { name: string; email: string; phone?: string },
    userId: string = DEMO_USER_ID
): Promise<ProfileRow> {
    const { rows } = await pool.query(
        `UPDATE users
         SET name = $1, email = $2, phone = $3
         WHERE id = $4
         RETURNING id, name, email, phone`,
        [data.name, data.email, data.phone ?? null, userId]
    );
    return rows[0];
}