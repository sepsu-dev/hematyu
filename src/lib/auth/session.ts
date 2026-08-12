import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.SESSION_SECRET || "dev-secret-change-me"
);
export const COOKIE_NAME = "hematyu_session";
const SEVEN_DAYS = 60 * 60 * 24 * 7;
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export interface SessionPayload {
    userId: string;
    email: string;
    name: string;
    role: string;
}

export async function createSession(
    payload: SessionPayload,
    remember = false
): Promise<{ name: string; value: string; maxAge: number }> {
    const maxAge = remember ? THIRTY_DAYS : SEVEN_DAYS;
    const token = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + maxAge)
        .sign(secret);

    return {
        name: COOKIE_NAME,
        value: token,
        maxAge,
    };
}

export async function verifySession(): Promise<SessionPayload | null> {
    try {
        const cookieStore = await (await import("next/headers")).cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        if (!token) return null;
        const { payload } = await jwtVerify(token, secret);
        return {
            userId: payload.userId as string,
            email: payload.email as string,
            name: payload.name as string,
            role: (payload.role as string) ?? "user",
        };
    } catch {
        return null;
    }
}

export async function clearSessionCookie() {
    const { cookies } = await import("next/headers");
    (await cookies()).set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}
