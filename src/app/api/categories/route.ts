import { z } from "zod";
import { verifySession } from "@/lib/auth/session";
import { getCategories, createCategory } from "@/lib/services/categories";

const createSchema = z.object({
    name: z.string().trim().min(1),
    type: z.enum(["INCOME", "EXPENSE"]),
});

export async function GET() {
    const user = await verifySession();
    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const categories = await getCategories(user.userId);
    return Response.json({ categories });
}

export async function POST(request: Request) {
    const user = await verifySession();
    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
        return Response.json({ error: "Data tidak valid" }, { status: 400 });
    }

    const category = await createCategory({
        userId: user.userId,
        ...parsed.data,
    });
    return Response.json({ category }, { status: 201 });
}