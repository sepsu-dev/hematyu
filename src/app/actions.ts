"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginWithPassword, registerUser } from "@/lib/services/auth";
import { createSession, clearSessionCookie } from "@/lib/auth/session";

export async function loginAction(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const remember = formData.get("remember") === "on";

    const user = await loginWithPassword(email, password);
    if (!user) {
        redirect("/login?error=Email+atau+sandi+salah");
    }

    const session = await createSession(
        { userId: user.id, email: user.email, name: user.name, role: user.role ?? "user" },
        remember
    );
    const cookieStore = await cookies();
    cookieStore.set(session.name, session.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: session.maxAge,
    });

    redirect("/dashboard");
}

export async function registerAction(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!name || !email || !password) {
        redirect("/register?error=Semua+kolom+wajib+diisi");
    }
    if (password.length < 6) {
        redirect("/register?error=Sandi+minimal+6+karakter");
    }

    try {
        const user = await registerUser({ name, email, password });
        const session = await createSession({ userId: user.id, email: user.email, name: user.name, role: user.role ?? "user" });
        const cookieStore = await cookies();
        cookieStore.set(session.name, session.value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: session.maxAge,
        });
    } catch (err: unknown) {
        const msg = err instanceof Error && err.message.includes("duplicate")
            ? "/register?error=Email+sudah+terdaftar"
            : "/register?error=Gagal+mendaftar";
        redirect(msg);
    }

    redirect("/dashboard");
}

export async function logoutAction() {
    await clearSessionCookie();
    redirect("/login");
}
