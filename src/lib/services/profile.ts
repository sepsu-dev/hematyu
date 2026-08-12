import { pool } from "@/lib/db";

export interface Profile {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    google_linked: boolean;
    has_password: boolean;
}

export async function getProfile(userId: string): Promise<Profile | null> {
    const { rows } = await pool.query(
        `SELECT id, name, email, phone, google_linked,
                (password_hash IS NOT NULL) AS has_password
         FROM users WHERE id = $1`,
        [userId]
    );
    return rows[0] ?? null;
}

export async function setPassword(userId: string, hashedPassword: string): Promise<void> {
    await pool.query(
        `UPDATE users SET password_hash = $1 WHERE id = $2`,
        [hashedPassword, userId]
    );
}

export async function updateProfile(userId: string, data: {
    name: string;
    email: string;
    phone?: string;
}): Promise<Profile> {
    const { rows } = await pool.query(
        `UPDATE users SET name = $1, email = $2, phone = $3
     WHERE id = $4
     RETURNING id, name, email, phone, google_linked,
               (password_hash IS NOT NULL) AS has_password`,
        [data.name.trim(), data.email.toLowerCase(), data.phone ?? null, userId]
    );
    return rows[0];
}