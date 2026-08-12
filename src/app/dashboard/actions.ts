"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/session";
import {
    createTransaction,
    deleteTransaction,
    getTransactions,
    getTransactionsCount,
    getRecentTransactions,
    getSummary,
    getExpenseByCategory,
    getIncomeByCategory,
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
import { updateProfile, getProfile, setPassword } from "@/lib/services/profile";
import { hashPassword } from "@/lib/auth/password";
import { getCategories } from "@/lib/services/categories";
import { getAccountTypes } from "@/lib/services/accounts";
import {
    getMasterCategories,
    createMasterCategory,
    deleteMasterCategory,
    getMasterAccountTypes,
    createMasterAccountType,
    deleteMasterAccountType,
} from "@/lib/services/master";
import { getAdminStats, getAdminUserList } from "@/lib/services/admin";
import {
    getRbacUsers,
    setUserGroups,
    getGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    getPrivileges,
    setPrivilege,
    getRbacMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    getMenuActions,
    createMenuAction as createMenuActionService,
    deleteMenuAction as deleteMenuActionService,
} from "@/lib/services/rbac";
import { isSuperadmin } from "@/lib/services/rbac";

async function requireUser() {
    const session = await verifySession();
    if (!session) redirect("/login");
    return session;
}

async function requireSuperadmin() {
    const session = await verifySession();
    if (!session) redirect("/login");
    if (!(await isSuperadmin(session.userId))) redirect("/dashboard");
    return session;
}

export async function getTransactionsAction(params?: {
    limit?: number;
    offset?: number;
    type?: "INCOME" | "EXPENSE";
}) {
    const session = await requireUser();
    return await getTransactions(session.userId, params);
}

export async function getTransactionsCountAction(type?: "INCOME" | "EXPENSE") {
    const session = await requireUser();
    return await getTransactionsCount(session.userId, type);
}

export async function getRecentTransactionsAction(limit = 5) {
    const session = await requireUser();
    return await getRecentTransactions(session.userId, limit);
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

export async function getIncomeBreakdownAction() {
    const session = await requireUser();
    return await getIncomeByCategory(session.userId);
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
    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/reports");
    revalidatePath("/wallets");
}

export async function deleteTransactionAction(id: string) {
    const session = await requireUser();
    await deleteTransaction(id, session.userId);
    revalidatePath("/transactions");
    revalidatePath("/dashboard");
}

export async function createCategoryAction(input: { name: string; type: "INCOME" | "EXPENSE"; iconName?: string; colorHex?: string }) {
    const session = await requireUser();
    await createCategory({ userId: session.userId, name: input.name, type: input.type, iconName: input.iconName, colorHex: input.colorHex });
    revalidatePath("/settings");
}

export async function deleteCategoryAction(id: string) {
    const session = await requireUser();
    await deleteCategory(id, session.userId);
    revalidatePath("/settings");
}

export async function updateProfileAction(input: { name: string; email: string; phone?: string }) {
    const session = await requireUser();
    await updateProfile(session.userId, input);
    revalidatePath("/settings");
}

export async function createPasswordAction(input: { password: string }) {
    const session = await requireUser();
    const password = input.password;
    if (!password || password.length < 6) {
        throw new Error("Password minimal 6 karakter");
    }
    const hash = await hashPassword(password);
    await setPassword(session.userId, hash);
    revalidatePath("/settings");
}

// ─── Rekening ────────────────────────────────────────────────────

export async function getAccountsAction() {
    const session = await requireUser();
    return await getAccounts(session.userId);
}

export async function createAccountAction(input: {
    name: string;
    type: string;
    balance?: number;
}) {
    const session = await requireUser();
    await createAccount({
        userId: session.userId,
        name: input.name,
        type: input.type,
        balance: input.balance,
    });
    revalidatePath("/wallets");
}

export async function deleteAccountAction(id: string) {
    const session = await requireUser();
    await deleteAccount(id, session.userId);
    revalidatePath("/wallets");
}

// ─── Anggaran ────────────────────────────────────────────────────

export async function getBudgetsAction(month?: string) {
    const session = await requireUser();
    return await getBudgets(session.userId, month);
}

export async function createBudgetAction(input: { categoryId: string; amount: number }) {
    const session = await requireUser();
    await createBudget({
        userId: session.userId,
        categoryId: input.categoryId,
        amount: input.amount,
    });
    revalidatePath("/budgets");
}

export async function deleteBudgetAction(id: string) {
    const session = await requireUser();
    await deleteBudget(id, session.userId);
    revalidatePath("/budgets");
}

// ─── Tujuan ──────────────────────────────────────────────────────

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
    revalidatePath("/goals");
}

export async function updateGoalAmountAction(input: { id: string; amount: number }) {
    const session = await requireUser();
    await updateGoalAmount(input.id, session.userId, input.amount);
    revalidatePath("/goals");
}

export async function deleteGoalAction(id: string) {
    const session = await requireUser();
    await deleteGoal(id, session.userId);
    revalidatePath("/goals");
}

// ─── Jenis Rekening (Dinamis) ─────────────────────────────────────────┐

export async function getAccountTypesAction() {
    await requireUser();
    return await getAccountTypes();
}

// ─── Admin — Kategori ──────────────────────────────────────────────────

export async function getMasterCategoriesAction() {
    await requireSuperadmin();
    return await getMasterCategories();
}

export async function createMasterCategoryAction(input: { name: string; type: "INCOME" | "EXPENSE"; iconName?: string; colorHex?: string }) {
    await requireSuperadmin();
    await createMasterCategory({ name: input.name, type: input.type, iconName: input.iconName, colorHex: input.colorHex });
    revalidatePath("/master/categories");
}

export async function deleteMasterCategoryAction(id: string) {
    await requireSuperadmin();
    await deleteMasterCategory(id);
    revalidatePath("/master/categories");
}

// ─── Admin — Jenis Rekening ───────────────────────────────────────────┐

export async function getMasterAccountTypesAction() {
    await requireSuperadmin();
    return await getMasterAccountTypes();
}

export async function createMasterAccountTypeAction(input: {
    code: string;
    label: string;
    icon_name?: string;
    color?: string;
}) {
    await requireSuperadmin();
    await createMasterAccountType(input);
    revalidatePath("/master/account-types");
    revalidatePath("/wallets");
}

export async function deleteMasterAccountTypeAction(id: string) {
    await requireSuperadmin();
    await deleteMasterAccountType(id);
    revalidatePath("/master/account-types");
}

// ─── Admin — Statistik & Daftar User ─────────────────────────────────

export async function getAdminStatsAction() {
    await requireSuperadmin();
    return await getAdminStats();
}

export async function getAdminUserListAction() {
    await requireSuperadmin();
    return await getAdminUserList();
}

// ─── Admin — User Management (RBAC) ─────────────────────────────

export async function getRbacUsersAction() {
    await requireSuperadmin();
    return await getRbacUsers();
}

export async function setUserGroupsAction(userId: string, groupIds: string[]) {
    await requireSuperadmin();
    await setUserGroups(userId, groupIds);
    revalidatePath("/admin/users");
}

export async function getGroupsAction() {
    await requireSuperadmin();
    return await getGroups();
}

export async function createGroupAction(input: { name: string; description?: string }) {
    await requireSuperadmin();
    await createGroup(input);
    revalidatePath("/admin/user-groups");
    revalidatePath("/admin/user-privileges");
}

export async function updateGroupAction(id: string, input: { name: string; description?: string }) {
    await requireSuperadmin();
    await updateGroup(id, input);
    revalidatePath("/admin/user-groups");
    revalidatePath("/admin/user-privileges");
}

export async function deleteGroupAction(id: string) {
    await requireSuperadmin();
    await deleteGroup(id);
    revalidatePath("/admin/user-groups");
    revalidatePath("/admin/user-privileges");
}

export async function getPrivilegesAction(groupId?: string) {
    await requireSuperadmin();
    return await getPrivileges(groupId);
}

export async function setPrivilegeAction(groupId: string, menuId: string, actions: string[]) {
    await requireSuperadmin();
    await setPrivilege(groupId, menuId, actions);
    revalidatePath("/admin/user-privileges");
}

export async function getRbacMenusAction() {
    await requireSuperadmin();
    return await getRbacMenus();
}

export async function createMenuAction(input: {
    label: string;
    parent_id?: string | null;
    path?: string | null;
    icon_name?: string;
    sort_order?: number;
    is_active?: boolean;
}) {
    await requireSuperadmin();
    await createMenu(input);
    revalidatePath("/admin/menus");
    revalidatePath("/admin/menu-actions");
}

export async function updateMenuAction(id: string, input: {
    label: string;
    parent_id?: string | null;
    path?: string | null;
    icon_name?: string;
    sort_order?: number;
    is_active?: boolean;
}) {
    await requireSuperadmin();
    await updateMenu(id, input);
    revalidatePath("/admin/menus");
    revalidatePath("/admin/menu-actions");
}

export async function deleteMenuAction(id: string) {
    await requireSuperadmin();
    await deleteMenu(id);
    revalidatePath("/admin/menus");
    revalidatePath("/admin/menu-actions");
}

export async function getMenuActionsAction() {
    await requireSuperadmin();
    return await getMenuActions();
}

export async function createMenuActionAction(input: { menu_id: string; code: string; label: string }) {
    await requireSuperadmin();
    await createMenuActionService(input.menu_id, input.code, input.label);
    revalidatePath("/admin/menu-actions");
}

export async function deleteMenuActionAction(id: string) {
    await requireSuperadmin();
    await deleteMenuActionService(id);
    revalidatePath("/admin/menu-actions");
}