import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader name="Hematyu" />
      <main className="flex-1">{children}</main>
      <SiteFooter author="Hematyu" />
    </>
  );
}
