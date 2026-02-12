import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import { Cairo, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import AppShell from "@/components/app-shell";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import { StoreProvider } from "@/components/store-context";
import { Suspense } from "react";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const title = "تاجر | الرئيسية";
  const description =
    "تجربة شراء سهلة داخل العراق مع خيارات دفع مريحة وتوصيل سريع.";
  return {
    title,
    description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ar_IQ",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar-IQ" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          <StoreProvider>
            <AnalyticsScripts />
            <CartProvider>
              <AppShell>{children}</AppShell>
            </CartProvider>
          </StoreProvider>
        </Suspense>
      </body>
    </html>
  );
}
