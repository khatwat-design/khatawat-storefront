"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { useStore } from "@/components/store-context";
import { useMetaPixelTrack } from "@/components/analytics/MetaPixel";

export default function ThankYouPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const { domainQuery } = useStore();
  const { trackPurchase } = useMetaPixelTrack();

  useEffect(() => {
    clearCart();
    try {
      const stored = sessionStorage.getItem("meta_pixel_purchase");
      if (stored) {
        const { value, orderId } = JSON.parse(stored) as { value: number; orderId?: string };
        trackPurchase(value, orderId);
        sessionStorage.removeItem("meta_pixel_purchase");
      }
    } catch {
      // ignore
    }
  }, [clearCart, trackPurchase]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16" dir="rtl">
      <div className="max-w-md w-full text-center">
        {/* Green checkmark icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-black mb-4">
          تم استلام طلبك بنجاح!
        </h1>
        <p className="text-gray-600 leading-relaxed mb-10">
          شكراً لثقتك بنا. تم إرسال طلبك للتاجر وسيتم التواصل معك قريباً لتأكيد التوصيل.
        </p>

        <Link
          href={domainQuery ? `/${domainQuery}` : "/"}
          className="inline-block w-full sm:w-auto px-10 py-4 text-base font-bold text-white bg-black hover:bg-gray-900 transition rounded-lg"
        >
          العودة للتسوق
        </Link>
      </div>
    </div>
  );
}
