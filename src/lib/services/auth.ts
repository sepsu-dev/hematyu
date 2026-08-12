import { pool } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { ensureDefaultAccount } from "@/lib/services/accounts";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    phone: string | null;
}

export async function getUserByEmail(email: string): Promise<AuthUser | null> {
    const { rows } = await pool.query(
        `SELECT id, name, email, phone FROM users WHERE email = $1`,
        [email.toLowerCase()]
    );
    return rows[0] ?? null;
}

export async function getUserWithPassword(email: string) {
    const { rows } = await pool.query(
        `SELECT id, name, email, phone, password_hash FROM users WHERE email = $1`,
        [email.toLowerCase()]
    );
    return rows[0] ?? null;
}

export async function registerUser(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
}): Promise<AuthUser> {
    const hash = await hashPassword(data.password);
    // Auto-create default categories for the new user
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const { rows } = await client.query(
            `INSERT INTO users (name, email, password_hash, phone)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, phone`,
            [data.name.trim(), data.email.toLowerCase(), hash, data.phone ?? null]
        );
        const user = rows[0];

        // Default group: User (role = group — satu-satunya sumber)
        await client.query(
            `INSERT INTO user_group_members (user_id, group_id)
             SELECT $1, id FROM user_groups WHERE name = 'User'`,
            [user.id]
        );

        // Copy default categories from a global template user
        // Template: the seed demo user's categories (is_default = true)
        await client.query(
            `INSERT INTO categories (user_id, name, type, is_default)
             SELECT $1, name, type, TRUE
             FROM categories
             WHERE user_id IS NULL AND is_default = TRUE`,
            [user.id]
        );

        await ensureDefaultAccount(user.id, client);

        await client.query("COMMIT");
        return user;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

export async function loginWithPassword(email: string, password: string): Promise<AuthUser | null> {
    const user = await getUserWithPassword(email);
    if (!user || !user.password_hash) return null;
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return null;
    return { id: user.id, name: user.name, email: user.email, phone: user.phone };
}