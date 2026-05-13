import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/tooltip";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export function generateMetadata(): Metadata {
  return {
    title: {
      default: "Hematyu",
      template: `%s — Hematyu`,
    },
    description: "Hematyu membantu Anda memonitoring pemasukan dan pengeluaran uang agar bisa lebih hemat dan teratur.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${caveat.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased font-sans min-h-screen flex flex-col bg-background text-foreground">
        <NextTopLoader showSpinner={false} color="#10b981" />
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
