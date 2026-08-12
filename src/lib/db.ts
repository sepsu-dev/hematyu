import { Pool } from "pg";

const globalForDb = globalThis as unknown as {
    pool?: Pool;
};

export const pool = globalForDb.pool ?? createPool();

function createPool() {
    // Prioritaskan DATABASE_URL (mendukung sslmode & channel_binding dari Neon)
    if (process.env.DATABASE_URL) {
        return new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
        });
    }

    // Fallback: koneksi lokal via variabel POSTGRES_*
    return new Pool({
        host: process.env.POSTGRES_HOST || "localhost",
        port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
        user: process.env.POSTGRES_USER || "postgres",
        password: process.env.POSTGRES_PASSWORD || "",
        database: process.env.POSTGRES_DB || "hematyu",
    });
}

if (process.env.NODE_ENV !== "production") {
    globalForDb.pool = pool;
}

// ─── Demo user ID (auth menyusul) ────────────────────────────────
// User pertama di seed.sql (Jason David, superadmin) → id = 1
export const DEMO_USER_ID = "1";
