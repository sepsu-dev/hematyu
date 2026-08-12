import { z } from "zod";
import { verifySession } from "@/lib/auth/session";
import { getProfile, updateProfile } from "@/lib/services/profile";
import { createSession } from "@/lib/auth/session";

const updateSchema = z.object({
    name: z.string().trim().min(1),
    email: z.string().email(),
    phone: z.string().trim().nullable().optional(),
});

export async function GET() {
    const user = await verifySession();
    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const profile = await getProfile(user.userId);
    if (!profile) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ profile });
}

export async function PATCH(request: Request) {
    const user = await verifySession();
    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
        return Response.json({ error: "Data tidak valid" }, { status: 400 });
    }

    // Re-issue session so cookie payload reflects new name/email
    const session = await createSession({
        userId: user.userId,
        name: parsed.data.name,
        email: parsed.data.email,
        role: user.role ?? "user",
    });
    const cookieStore = await (await import("next/headers")).cookies();
    cookieStore.set(session.name, session.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: session.maxAge,
    });

    const profile = await updateProfile(user.userId, {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone ?? undefined,
    });
    return Response.json({ profile });
}