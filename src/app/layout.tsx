import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/tooltip";
import "@/app/globals.css";

export function generateMetadata(): Metadata {
  return {
    title: {
      default: "hemat.yu",
      template: `%s — hemat.yu`,
    },
    description: "hemat.yu membantu Anda memonitoring pemasukan dan pengeluaran uang agar bisa lebih hemat dan teratur.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body className="antialiased font-sans min-h-screen flex flex-col bg-background text-foreground">
        <NextTopLoader showSpinner={false} color="#111827" />
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
