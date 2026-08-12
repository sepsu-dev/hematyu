import { Pool } from "pg";
import fs from "fs";
import path from "path";

const globalForDb = globalThis as unknown as {
    pool?: Pool;
};

export const pool = globalForDb.pool ?? createPool();

function createPool() {
    // Prioritaskan DATABASE_URL (mendukung sslmode & channel_binding dari Neon)
    if (process.env.DATABASE_URL) {
        let connStr = process.env.DATABASE_URL;
        // Ganti sslmode=require dengan sslmode=verify-full untuk menghilangkan warning keamanan pg
        if (connStr.includes("sslmode=require") && !connStr.includes("uselibpqcompat")) {
            connStr = connStr.replace("sslmode=require", "sslmode=verify-full");
        }
        return new Pool({
            connectionString: connStr,
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

// Fungsi otomatisasi inisialisasi database jika tabel belum ada
async function checkAndInitDatabase() {
    try {
        const { rows } = await pool.query(`
            SELECT EXISTS (
                SELECT FROM pg_tables 
                WHERE schemaname = 'public' 
                AND tablename  = 'user_privileges'
            );
        `);
        const exists = rows[0]?.exists;
        if (!exists) {
            console.log("Database tables missing on Vercel. Initializing schema...");
            const schemaSql = fs.readFileSync(path.join(process.cwd(), "db/schema.sql"), "utf8");
            await pool.query(schemaSql);
            console.log("Schema initialized. Seeding initial database data...");
            const seedSql = fs.readFileSync(path.join(process.cwd(), "db/seed.sql"), "utf8");
            await pool.query(seedSql);
            console.log("Database auto-initialization completed successfully!");
        }
    } catch (err) {
        console.error("Database auto-init failed:", err);
    }
}

if (process.env.NODE_ENV !== "production") {
    globalForDb.pool = pool;
} else if (process.env.VERCEL === "1") {
    // Jalankan pengecekan database di production secara asinkronus saat startup di Vercel
    checkAndInitDatabase();
}

// ─── Demo user ID (auth menyusul) ────────────────────────────────
// User pertama di seed.sql (Jason David, superadmin) → id = 1
export const DEMO_USER_ID = "1";
