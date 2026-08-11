import { cookies } from "next/headers";
import { z } from "zod";
import { registerUser } from "@/lib/services/auth";
import { createSession } from "@/lib/auth/session";

const schema = z.object({
    name: z.string().trim().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().trim().optional(),
});

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
        return Response.json({ error: "Data tidak valid" }, { status: 400 });
    }

    let user;
    try {
        user = await registerUser(parsed.data);
    } catch (err: unknown) {
        const duplicate =
            err instanceof Error && err.message.includes("duplicate");
        return Response.json(
            { error: duplicate ? "Email sudah terdaftar" : "Gagal mendaftar" },
            { status: duplicate ? 409 : 500 }
        );
    }

    const session = await createSession({
        userId: user.id,
        email: user.email,
        name: user.name,
    });
    const cookieStore = await cookies();
    cookieStore.set(session.name, session.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: session.maxAge,
    });

    return Response.json({ user }, { status: 201 });
}