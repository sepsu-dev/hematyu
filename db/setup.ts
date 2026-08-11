import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { pool } from "../src/lib/db";

async function setup() {
    console.log("🚀 Menjalankan schema.sql...");
    const schema = readFileSync(join(process.cwd(), "db", "schema.sql"), "utf-8");
    await pool.query(schema);
    console.log("✅ Schema berhasil dibuat!");

    console.log("🌱 Menjalankan seed.sql...");
    const seed = readFileSync(join(process.cwd(), "db", "seed.sql"), "utf-8");
    await pool.query(seed);
    console.log("✅ Seed data berhasil dimasukkan!");

    await pool.end();
    console.log("🎉 Setup database selesai!");
}

setup().catch((err) => {
    console.error("❌ Setup gagal:", err);
    process.exit(1);
});