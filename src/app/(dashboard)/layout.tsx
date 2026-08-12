import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/session";
import { getMenusForUser } from "@/lib/services/menus";
import { DashboardLayoutClient } from "./layout-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session) redirect("/login");

  const menus = await getMenusForUser(session.userId);

  return (
    <DashboardLayoutClient
      user={{ id: session.userId, name: session.name, email: session.email, phone: null }}
      menus={menus}
    >
      {children}
    </DashboardLayoutClient>
  );
}
