"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/products";
import { useCartStore } from "@/lib/store";
import { useProducts } from "@/lib/use-products";
import { useStore } from "@/components/store-context";

export default function ProductsPage() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const { products, loading } = useProducts();
  const { domainQuery } = useStore();
  const quantities = new Map(items.map((item) => [item.id, item.quantity]));

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-sm text-black/70">منتجات متنوعة</p>
        <h1 className="text-3xl font-bold text-black">كل المنتجات</h1>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [0, 1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="h-32 rounded-2xl border border-gray-200 bg-white" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-32 rounded-full border border-gray-200 bg-white" />
                  <div className="h-3 w-44 rounded-full border border-gray-200 bg-white" />
                </div>
              </div>
            ))
          : products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col justify-between rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="relative h-32 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">
                  {product.name}
                </h3>
                <p className="text-sm leading-6 text-black/70">
                  {product.description}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-base font-semibold text-black">
                {formatCurrency(product.price)}
              </p>
              <Link
                href={`/products/${product.id}${domainQuery}`}
                className="text-xs font-semibold text-primary"
              >
                عرض التفاصيل
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  updateQuantity(
                    product.id,
                    (quantities.get(product.id) ?? 0) - 1,
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] text-sm font-semibold text-black/70 transition hover:border-black hover:text-black"
                aria-label={`إزالة ${product.name}`}
              >
                -
              </button>
              <span className="min-w-6 text-center text-sm text-black/70">
                {quantities.get(product.id) ?? 0}
              </span>
              <button
                type="button"
                onClick={() => addItem(product, 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition hover:opacity-90"
                aria-label={`إضافة ${product.name}`}
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => addItem(product, 1)}
              className="mt-4 w-full rounded-2xl border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-black/70 transition hover:border-black"
            >
              إضافة للسلة
            </button>
          </div>
        ))}
        {!loading && products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[var(--color-border)] p-6 text-sm text-black/70">
            لا توجد منتجات حالياً.
          </div>
        ) : null}
      </section>
    </div>
  );
}
