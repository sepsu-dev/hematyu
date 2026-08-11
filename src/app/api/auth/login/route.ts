import { cookies } from "next/headers";
import { z } from "zod";
import { loginWithPassword } from "@/lib/services/auth";
import { createSession } from "@/lib/auth/session";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
        return Response.json(
            { error: "Email atau sandi tidak valid" },
            { status: 400 }
        );
    }

    const user = await loginWithPassword(
        parsed.data.email,
        parsed.data.password
    );
    if (!user) {
        return Response.json(
            { error: "Email atau sandi salah" },
            { status: 401 }
        );
    }

    const session = await createSession(
        { userId: user.id, email: user.email, name: user.name },
        // "remember" — default tidak dicentang = 7 hari
        false
    );
    const cookieStore = await cookies();
    cookieStore.set(session.name, session.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: session.maxAge,
    });

    return Response.json({ user });
}