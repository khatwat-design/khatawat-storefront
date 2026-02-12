"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function NotFound() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");
  const domainQuery = domain ? `?domain=${encodeURIComponent(domain)}` : "";

  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center px-4"
      dir="rtl"
    >
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-black mb-3">
          عذراً، الصفحة غير موجودة
        </h1>
        <p className="text-gray-600 mb-10">
          يبدو أن الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
        </p>
        <Link
          href={domainQuery ? `/${domainQuery}` : "/"}
          className="inline-block px-8 py-4 text-base font-bold text-white bg-black hover:bg-gray-900 transition rounded-lg"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
