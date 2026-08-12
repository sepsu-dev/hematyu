import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/session";
import { DashboardLayoutClient } from "./layout-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session) redirect("/login");

  return (
    <DashboardLayoutClient
      user={{ id: session.userId, name: session.name, email: session.email, phone: null, role: session.role ?? "user" }}
    >
      {children}
    </DashboardLayoutClient>
  );
}