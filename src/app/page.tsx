"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatCurrency } from "@/lib/products";
import { useCartStore } from "@/lib/store";
import { useProducts } from "@/lib/use-products";
import { useStore } from "@/components/store-context";

export default function Home() {
  const addItem = useCartStore((state) => state.addItem);
  const { products, loading } = useProducts();
  const { domainQuery } = useStore();
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const handleAddToCart = (productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      return;
    }
    addItem(product, 1);
    setAddedToCart(productId);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <div className="space-y-6 md:space-y-12 px-3 md:px-6">
      <section className="space-y-4 md:space-y-6">
        <div className="text-center">
          <h1 className="text-xl md:text-3xl font-bold text-black mb-2 md:mb-4">
            منتجاتنا
          </h1>
          <p className="text-xs md:text-base text-black/70">
            أفضل المنتجات لتناسب احتياجاتك
          </p>
        </div>
        
        <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="flex flex-col justify-between rounded-xl md:rounded-3xl border border-gray-200 bg-white p-3 md:p-6 shadow-md md:shadow-lg"
                >
                  <div className="space-y-2 md:space-y-3">
                    <div className="aspect-square w-full rounded-lg md:rounded-2xl bg-white border border-gray-200" />
                    <div>
                      <div className="h-4 w-32 rounded-full bg-white border border-gray-200" />
                    </div>
                  </div>
                  <div className="mt-3 md:mt-6 flex flex-col items-center justify-between gap-2 md:gap-3">
                    <div className="h-4 w-24 rounded-full bg-white border border-gray-200" />
                    <div className="h-9 w-full rounded-full bg-white border border-gray-200" />
                  </div>
                </div>
              ))
            : products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-between rounded-xl md:rounded-3xl border border-gray-200 bg-white p-3 md:p-6 shadow-md md:shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="space-y-2 md:space-y-3">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg md:rounded-2xl bg-white border border-gray-200 cursor-pointer group">
                  <Link href={`/products/${product.id}${domainQuery}`}>
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </Link>
                </div>
                <div>
                  <Link href={`/products/${product.id}${domainQuery}`} className="block">
                    <h3 className="text-sm md:text-lg font-semibold text-black hover:text-primary transition-colors cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs md:text-sm leading-4 md:leading-6 text-black/70">
                    {product.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 md:mt-6 flex flex-col items-center justify-between gap-2 md:gap-3">
                <p className="text-sm md:text-base font-semibold text-black">
                  {formatCurrency(product.price)}
                </p>
                <div className="flex items-center gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product.id)}
                    className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold text-white transition ${
                      addedToCart === product.id
                        ? "bg-black"
                        : "bg-primary hover:opacity-90"
                    }`}
                  >
                    {addedToCart === product.id ? '✓ تمت الإضافة' : 'إضافة للسلة'}
                  </button>
                  <Link
                    href={`/products/${product.id}${domainQuery}`}
                    className="flex-1 rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-black transition hover:border-black"
                  >
                    التفاصيل
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
