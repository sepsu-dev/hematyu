import { COOKIE_NAME } from "@/lib/auth/session";

export async function POST() {
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    const response = Response.json({ ok: true });
    response.headers.set(
        "Set-Cookie",
        `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
    );
    return response;
}