import { z } from "zod";
import { verifySession } from "@/lib/auth/session";
import { getTransactions, createTransaction } from "@/lib/services/transactions";

const createSchema = z.object({
    categoryId: z.string(),
    type: z.enum(["INCOME", "EXPENSE"]),
    amount: z.number().positive(),
    description: z.string().trim().min(1),
    note: z.string().trim().optional(),
    date: z.string().datetime().optional(),
});

export async function GET() {
    const user = await verifySession();
    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const transactions = await getTransactions(user.userId);
    return Response.json({ transactions });
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

    const transaction = await createTransaction({
        userId: user.userId,
        ...parsed.data,
        date: parsed.data.date ? new Date(parsed.data.date) : undefined,
    });
    return Response.json({ transaction }, { status: 201 });
}