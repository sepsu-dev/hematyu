import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.SESSION_SECRET || "dev-secret-change-me"
);
const COOKIE_NAME = "hematyu_session";

const PROTECTED_PREFIX = "/dashboard";
const AUTH_PAGES = ["/login", "/register", "/forgot-password"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(COOKIE_NAME)?.value;
    let valid = false;

    if (token) {
        try {
            await jwtVerify(token, secret);
            valid = true;
        } catch {
            valid = false;
        }
    }

    const isProtected = pathname.startsWith(PROTECTED_PREFIX);
    const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

    if (isProtected && !valid) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    if (isAuthPage && valid) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password"],
};