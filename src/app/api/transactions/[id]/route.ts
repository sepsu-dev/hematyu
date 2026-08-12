import { z } from "zod";
import { verifySession } from "@/lib/auth/session";
import { deleteTransaction } from "@/lib/services/transactions";

const paramsSchema = z.object({ id: z.string() });

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await verifySession();
    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = paramsSchema.parse(await params);
    const ok = await deleteTransaction(id, user.userId);
    if (!ok) {
        return Response.json(
            { error: "Transaksi tidak ditemukan" },
            { status: 404 }
        );
    }
    return Response.json({ ok: true });
}