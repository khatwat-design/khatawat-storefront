"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CartDrawer from "@/components/layout/CartDrawer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-8">
        {children}
      </main>
      <CartDrawer />
      <Footer />
    </>
  );
}
