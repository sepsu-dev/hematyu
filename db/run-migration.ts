import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { pool } from "../src/lib/db";

const file = process.argv[2] ?? "migrate-soft-delete.sql";

async function migrate() {
    console.log(`🚀 Menjalankan ${file}...`);
    const sql = readFileSync(join(process.cwd(), "db", file), "utf-8");
    await pool.query(sql);
    console.log(`✅ Migration ${file} berhasil!`);
    await pool.end();
}

migrate().catch((err) => {
    console.error("❌ Migration gagal:", err);
    process.exit(1);
});
