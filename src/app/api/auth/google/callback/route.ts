import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { createSession, verifySession } from "@/lib/auth/session";
import { ensureDefaultAccount } from "@/lib/services/accounts";

interface GoogleTokenResult {
    access_token: string;
    id_token: string;
}

interface GoogleUserResult {
    email: string;
    name: string;
    picture: string;
}

async function getGoogleOAuthTokens(code: string): Promise<GoogleTokenResult> {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`,
        grant_type: "authorization_code",
    };

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(values),
    });

    if (!res.ok) {
        throw new Error("Failed to fetch Google OAuth tokens");
    }

    return res.json();
}

async function getGoogleUser(accessToken: string, idToken: string): Promise<GoogleUserResult> {
    const res = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
        {
            headers: { Authorization: `Bearer ${idToken}` },
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch Google user profile");
    }

    return res.json();
}

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(new URL("/login?error=Google auth failed", req.url));
    }

    // Check if user is already logged in (wants to link Google account)
    const sessionPayload = await verifySession();

    const client = await pool.connect();
    try {
        // 1. Exchange OAuth code for tokens
        const { access_token, id_token } = await getGoogleOAuthTokens(code);

        // 2. Fetch user profile from Google
        const googleUser = await getGoogleUser(access_token, id_token);

        if (!googleUser.email) {
            return NextResponse.redirect(new URL("/login?error=Email not provided by Google", req.url));
        }

        // --- LINK GOOGLE ACCOUNT FLOW ---
        if (sessionPayload?.userId) {
            await client.query("BEGIN");
            // Check if Google email matches or link anyway (typically we link if logged in)
            await client.query(
                `UPDATE users SET google_linked = TRUE WHERE id = $1`,
                [sessionPayload.userId]
            );
            await client.query("COMMIT");
            return NextResponse.redirect(new URL("/dashboard/settings?success=Google account linked successfully", req.url));
        }
        // ---------------------------------

        // 3. Query DB for existing user
        await client.query("BEGIN");
        let userResult = await client.query(
            `SELECT id, name, email, google_linked FROM users WHERE email = $1`,
            [googleUser.email.toLowerCase()]
        );

        let user = userResult.rows[0];

        // 4. Register new user if not exist
        if (!user) {
            const insertResult = await client.query(
                `INSERT INTO users (name, email, password_hash, google_linked)
                 VALUES ($1, $2, NULL, TRUE)
                 RETURNING id, name, email, google_linked`,
                [googleUser.name, googleUser.email.toLowerCase()]
            );
            user = insertResult.rows[0];

            // Default group: User (role = group — satu-satunya sumber seragam dengan register)
            await client.query(
                `INSERT INTO user_group_members (user_id, group_id)
                 SELECT $1, id FROM user_groups WHERE name = 'User'`,
                [user.id]
            );

            // Copy default categories (global master rows, user_id NULL)
            await client.query(
                `INSERT INTO categories (user_id, name, type, is_default)
                 SELECT $1, name, type, TRUE
                 FROM categories
                 WHERE user_id IS NULL AND is_default = TRUE`,
                [user.id]
            );
        } else {
            // User exists — Google already verified email ownership, so log them in.
            // Link the account if it was created manually (email/password).
            if (!user.google_linked) {
                await client.query(
                    `UPDATE users SET google_linked = TRUE WHERE id = $1`,
                    [user.id]
                );
                user.google_linked = true;
            }
        }
        // Ensure every user has at least one pocket (new or existing, idempotent)
        await ensureDefaultAccount(user.id, client);

        await client.query("COMMIT");

        // 5. Generate session payload
        const session = await createSession({
            userId: user.id,
            email: user.email,
            name: user.name,
        }, true);

        // 6. Redirect to dashboard with session cookie
        const response = NextResponse.redirect(new URL("/dashboard", req.url));
        response.cookies.set(session.name, session.value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: session.maxAge,
        });

        return response;
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Google Auth Error:", error);
        return NextResponse.redirect(new URL("/login?error=Authentication error", req.url));
    } finally {
        client.release();
    }
}