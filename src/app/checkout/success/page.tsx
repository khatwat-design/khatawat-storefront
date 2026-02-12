"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/components/store-context";

function SuccessContent() {
  const searchParams = useSearchParams();
  const invoice = searchParams.get("invoice");
  const { domainQuery } = useStore();

  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-[var(--color-border)] bg-white p-10 text-center shadow-[var(--shadow-soft)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-black/20 bg-white text-black">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-black">
          شكراً لك! تم استلام طلبك
        </h1>
        <p className="text-sm text-black/70">
          سنقوم بالتواصل معك قريباً لتأكيد التفاصيل والتوصيل.
        </p>
        {invoice ? (
          <p className="text-xs text-black/70">
            رقم الطلب:{" "}
            <span className="font-semibold text-black">{invoice}</span>
          </p>
        ) : null}
      </div>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={`/products${domainQuery}`}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          مواصلة التسوق
        </Link>
        <Link
          href={domainQuery ? `/${domainQuery}` : "/"}
          className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-black/70 transition hover:border-black"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl rounded-3xl border border-[var(--color-border)] bg-white p-10 text-center shadow-[var(--shadow-soft)]">
          <p className="text-sm text-black/70">
            جارٍ تحميل تفاصيل الطلب...
          </p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
