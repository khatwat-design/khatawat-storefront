"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/products";
import { useCartStore } from "@/lib/store";
import { useStore } from "@/components/store-context";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const { domainQuery } = useStore();
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const cartItems = items.map((product) => ({
    ...product,
    subtotal: product.quantity * product.price,
  }));

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const deliveryFee = subtotal > 0 ? 5000 : 0;
  const total = subtotal + deliveryFee;
  const hasItems = items.length > 0;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-black">سلة التسوق</h1>
              <Link href={domainQuery ? `/${domainQuery}` : "/"} className="text-sm text-black/70 hover:text-primary transition-colors">
                العودة للتسوق
              </Link>
            </div>

            <div className="space-y-4">
              {cartItems.length ? (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-black">{item.name}</h3>
                        <p className="text-sm font-bold text-primary mt-2">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          item.quantity <= 1
                            ? removeItem(item.id)
                            : updateQuantity(item.id, item.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-black/70 hover:border-black hover:text-black transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          if (Number.isNaN(value)) {
                            return;
                          }
                          updateQuantity(item.id, Math.max(1, value));
                        }}
                        className="w-16 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm focus:border-black focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => addItem(item, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white hover:opacity-90 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-black">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                  <div className="text-black/40 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-sm text-black/70">
                    سلتك فارغة حالياً. تصفح المنتجات وأضف ما يناسبك.
                  </p>
                  <Link 
                    href={domainQuery ? `/${domainQuery}` : "/"} 
                    className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-colors"
                  >
                    تسوق الآن
                  </Link>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="text-xl font-bold text-black mb-6">ملخص الطلب</h2>
              <div className="space-y-3 text-sm text-black/70">
                <div className="flex items-center justify-between">
                  <span>المجموع الفرعي</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>رسوم التوصيل</span>
                  <span className="font-semibold">{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between text-base font-bold text-black">
                    <span>الإجمالي</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/checkout${domainQuery}`}
                className={`mt-6 block w-full rounded-xl px-6 py-3 text-center text-sm font-semibold text-white transition ${
                  cartItems.length
                    ? "bg-primary hover:opacity-90"
                    : "cursor-not-allowed border border-black/20 bg-white text-black/40"
                }`}
              >
                {cartItems.length ? "إتمام الطلب" : "السلة فارغة"}
              </Link>
            </div>

            <div className="rounded-2xl bg-primary p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-2">معلومات التوصيل</h3>
              <p className="text-sm text-white/90">
                التوصيل داخل العراق خلال 24-48 ساعة حسب المدينة.
              </p>
              <p className="text-sm text-white/90 mt-2">
                الدفع عند الاستلام فقط.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
