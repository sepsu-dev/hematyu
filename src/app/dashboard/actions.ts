"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/session";
import {
    createTransaction,
    deleteTransaction,
    getTransactions,
    getSummary,
    getExpenseByCategory,
    getMonthlySummary,
    getWeeklySummary,
} from "@/lib/services/transactions";
import {
    createCategory,
    deleteCategory,
} from "@/lib/services/categories";
import {
    getAccounts,
    createAccount,
    deleteAccount,
} from "@/lib/services/accounts";
import {
    getBudgets,
    createBudget,
    deleteBudget,
} from "@/lib/services/budgets";
import {
    getGoals,
    createGoal,
    updateGoalAmount,
    deleteGoal,
} from "@/lib/services/goals";
import { updateProfile, getProfile } from "@/lib/services/profile";
import { getCategories } from "@/lib/services/categories";

async function requireUser() {
    const session = await verifySession();
    if (!session) redirect("/login");
    return session;
}

export async function getTransactionsAction() {
    const session = await requireUser();
    return await getTransactions(session.userId);
}

export async function getCategoriesAction() {
    const session = await requireUser();
    return await getCategories(session.userId);
}

export async function getSummaryAction() {
    const session = await requireUser();
    return await getSummary(session.userId);
}

export async function getExpenseBreakdownAction() {
    const session = await requireUser();
    return await getExpenseByCategory(session.userId);
}

export async function getMonthlySummaryAction() {
    const session = await requireUser();
    return await getMonthlySummary(session.userId);
}

export async function getWeeklySummaryAction() {
    const session = await requireUser();
    return await getWeeklySummary(session.userId);
}

export async function getProfileAction() {
    const session = await requireUser();
    return await getProfile(session.userId);
}

export async function createTransactionAction(input: {
    categoryId: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
    description: string;
    note?: string;
    date?: string;
    accountId?: string;
}) {
    const session = await requireUser();
    await createTransaction({
        userId: session.userId,
        categoryId: input.categoryId,
        type: input.type,
        amount: input.amount,
        description: input.description.trim(),
        note: input.note?.trim() || undefined,
        date: input.date ? new Date(input.date) : undefined,
        accountId: input.accountId,
    });
    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/reports");
    revalidatePath("/dashboard/wallets");
}

export async function deleteTransactionAction(id: string) {
    const session = await requireUser();
    await deleteTransaction(id, session.userId);
    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard");
}

export async function createCategoryAction(input: { name: string; type: "INCOME" | "EXPENSE" }) {
    const session = await requireUser();
    await createCategory({ userId: session.userId, name: input.name, type: input.type });
    revalidatePath("/dashboard/settings");
}

export async function deleteCategoryAction(id: string) {
    const session = await requireUser();
    await deleteCategory(id, session.userId);
    revalidatePath("/dashboard/settings");
}

export async function updateProfileAction(input: { name: string; email: string; phone?: string }) {
    const session = await requireUser();
    await updateProfile(session.userId, input);
    revalidatePath("/dashboard/settings");
}

// ─── Accounts ────────────────────────────────────────────────────

export async function getAccountsAction() {
    const session = await requireUser();
    return await getAccounts(session.userId);
}

export async function createAccountAction(input: {
    name: string;
    type: "BANK" | "E_WALLET" | "CASH";
    balance?: number;
}) {
    const session = await requireUser();
    await createAccount({
        userId: session.userId,
        name: input.name,
        type: input.type,
        balance: input.balance,
    });
    revalidatePath("/dashboard/wallets");
}

export async function deleteAccountAction(id: string) {
    const session = await requireUser();
    await deleteAccount(id, session.userId);
    revalidatePath("/dashboard/wallets");
}

// ─── Budgets ─────────────────────────────────────────────────────

export async function getBudgetsAction() {
    const session = await requireUser();
    return await getBudgets(session.userId);
}

export async function createBudgetAction(input: { categoryId: string; amount: number }) {
    const session = await requireUser();
    await createBudget({
        userId: session.userId,
        categoryId: input.categoryId,
        amount: input.amount,
    });
    revalidatePath("/dashboard/budgets");
}

export async function deleteBudgetAction(id: string) {
    const session = await requireUser();
    await deleteBudget(id, session.userId);
    revalidatePath("/dashboard/budgets");
}

// ─── Goals ───────────────────────────────────────────────────────

export async function getGoalsAction() {
    const session = await requireUser();
    return await getGoals(session.userId);
}

export async function createGoalAction(input: {
    name: string;
    targetAmount: number;
    deadline?: string;
}) {
    const session = await requireUser();
    await createGoal({
        userId: session.userId,
        name: input.name,
        targetAmount: input.targetAmount,
        deadline: input.deadline ? new Date(input.deadline) : undefined,
    });
    revalidatePath("/dashboard/goals");
}

export async function updateGoalAmountAction(input: { id: string; amount: number }) {
    const session = await requireUser();
    await updateGoalAmount(input.id, session.userId, input.amount);
    revalidatePath("/dashboard/goals");
}

export async function deleteGoalAction(id: string) {
    const session = await requireUser();
    await deleteGoal(id, session.userId);
    revalidatePath("/dashboard/goals");
}
