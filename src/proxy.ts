import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.SESSION_SECRET || "dev-secret-change-me"
);
const COOKIE_NAME = "hematyu_session";

const PROTECTED_PREFIXES = [
    "/dashboard",
    "/transactions",
    "/wallets",
    "/budgets",
    "/goals",
    "/reports",
    "/settings",
    "/master",
];
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

    const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    const isAuthPage = AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

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
    matcher: [
        "/dashboard/:path*",
        "/transactions/:path*",
        "/wallets/:path*",
        "/budgets/:path*",
        "/goals/:path*",
        "/reports/:path*",
        "/settings/:path*",
        "/master/:path*",
        "/login",
        "/register",
        "/forgot-password",
    ],
};