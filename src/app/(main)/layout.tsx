import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF6F0] text-slate-900 font-sans selection:bg-yellow-200 overflow-x-hidden flex flex-col relative">
      {/* Soft Grid Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#11182706_1px,transparent_1px),linear-gradient(to_bottom,#11182706_1px,transparent_1px)] bg-[size:32px_32px] opacity-100"></div>
      
      <SiteHeader name="hemat.yu" />
      <main className="flex-1 relative z-10 pt-20">{children}</main>
      <SiteFooter author="hemat.yu" />
    </div>
  );
}
