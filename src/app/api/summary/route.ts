import { verifySession } from "@/lib/auth/session";
import { getSummary } from "@/lib/services/transactions";

export async function GET() {
    const user = await verifySession();
    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const summary = await getSummary(user.userId);
    return Response.json({ summary });
}