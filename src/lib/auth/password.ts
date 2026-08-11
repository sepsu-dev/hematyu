import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LEN = 64;

// Node stdlib scrypt (format: scrypt:<saltHex>:<hashHex>) — replaces Bun.password (Bun-runtime only)
export function hashPassword(password: string): string {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, KEY_LEN).toString("hex");
    return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
    const [scheme, salt, hash] = stored.split(":");
    if (scheme !== "scrypt" || !salt || !hash) return false;
    const actual = scryptSync(password, salt, KEY_LEN);
    const expected = Buffer.from(hash, "hex");
    return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Self-check: hash/verify round-trip
if (require.main === module) {
    const h = hashPassword("password123");
    if (!verifyPassword("password123", h) || verifyPassword("wrong", h)) {
        throw new Error("scrypt round-trip failed");
    }
    console.log("scrypt round-trip OK");
}