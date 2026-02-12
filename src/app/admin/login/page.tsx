"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const saved = window.localStorage.getItem("tajer-admin-token");
    if (saved) {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token.trim()) {
      return;
    }
    window.localStorage.setItem("tajer-admin-token", token.trim());
    router.replace("/admin");
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-soft)]">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          تسجيل دخول الإدارة
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          أدخل رمز الإدارة للوصول إلى لوحة التحكم.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="رمز الإدارة"
          className="w-full rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100"
        />
        <button
          type="submit"
          className="w-full rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-600)]"
        >
          دخول
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/" className="text-xs text-[var(--color-muted)]">
          العودة للمتجر
        </Link>
      </div>
    </div>
  );
}
