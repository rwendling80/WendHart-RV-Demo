import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChatWidget } from "@/components/ChatWidget";
import { getCurrentDealer, PATHNAME_HEADER } from "@/lib/dealer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const dealer = await getCurrentDealer();
  return {
    title: dealer.name,
    description: `${dealer.name} — a demonstration used-RV dealership website.`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dealer = await getCurrentDealer();
  const headerList = await headers();
  const pathname = headerList.get(PATHNAME_HEADER) ?? "";
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {!isAdminRoute && <ChatWidget dealerName={dealer.name} />}
      </body>
    </html>
  );
}
