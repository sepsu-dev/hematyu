import "dotenv/config";
import { getTransactions, getMonthlySummary, getExpenseByCategory, createTransaction, deleteTransaction } from "../src/lib/queries/transactions";
import { getCategories, createCategory, deleteCategory } from "../src/lib/queries/categories";
import { getProfile, updateProfile } from "../src/lib/queries/profile";

async function verify() {
    console.log("── Transactions ──");
    const txs = await getTransactions();
    console.log("count:", txs.length);
    const monthly = await getMonthlySummary();
    console.log("monthly:", JSON.stringify(monthly));
    const breakdown = await getExpenseByCategory();
    console.log("breakdown:", JSON.stringify(breakdown));

    const newTx = await createTransaction({
        categoryId: (await getCategories()).find((c: any) => c.type === "EXPENSE")!.id,
        type: "EXPENSE",
        amount: 15000,
        description: "Test Verify",
        note: "auto-check",
    });
    console.log("created tx:", newTx.id);
    await deleteTransaction(newTx.id);
    console.log("deleted tx ok");

    console.log("── Categories ──");
    const cats = await getCategories();
    console.log("count:", cats.length);
    const newCat = await createCategory({ name: "Test Kategori", type: "EXPENSE" });
    console.log("created cat:", newCat.id);
    await deleteCategory(newCat.id);
    console.log("deleted cat ok");

    console.log("── Profile ──");
    const prof = await getProfile();
    if (!prof) throw new Error("Profile null");
    console.log("profile:", JSON.stringify(prof));
    await updateProfile({ name: prof.name, email: prof.email, phone: "08123456789" });
    const prof2 = await getProfile();
    if (!prof2) throw new Error("Profile null after update");
    console.log("updated phone:", prof2.phone);

    console.log("✅ ALL VERIFICATIONS PASSED");
}

verify().catch((err) => {
    console.error("❌ Verification failed:", err);
    process.exit(1);
});