"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname.startsWith("/admin/login");

  if (isLogin) {
    return (
      <div className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto w-full max-w-lg">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-[240px,1fr] gap-6 px-6 py-8">
        <aside className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-lg font-bold text-white">
              ت
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">تاجر</p>
              <p className="text-xs text-[var(--color-muted)]">لوحة التحكم</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2 text-sm text-[var(--color-muted)]">
            <Link
              href="/admin"
              className="flex items-center justify-between rounded-2xl px-4 py-2 transition hover:bg-slate-50 hover:text-slate-900"
            >
              نظرة عامة
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center justify-between rounded-2xl px-4 py-2 transition hover:bg-slate-50 hover:text-slate-900"
            >
              المنتجات
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center justify-between rounded-2xl px-4 py-2 transition hover:bg-slate-50 hover:text-slate-900"
            >
              الطلبات
            </Link>
          </nav>

          <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-xs text-[var(--color-muted)]">
            لإدارة المتجر بالكامل تأكد من حماية رمز الإدارة وعدم مشاركته.
          </div>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
