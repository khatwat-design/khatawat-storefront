"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/products";
import { useCartStore } from "@/lib/store";
import { getProduct, type Product } from "@/lib/api";
import { useStore } from "@/components/store-context";

export default function ProductDetailPage() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const { domainQuery, domain } = useStore();
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!params?.id) {
        return;
      }
      setLoading(true);
      setNotFound(false);
      try {
        const data = await getProduct(params.id, domain ?? undefined);
        if (!data) {
          setNotFound(true);
          setProduct(null);
          setActiveImage(null);
          return;
        }
        setProduct(data);
        setActiveImage(data.image_url);
      } catch {
        setNotFound(true);
        setProduct(null);
        setActiveImage(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params?.id, domain]);

  if (notFound && !loading) {
    return (
      <div className="rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--shadow-soft)]">
        <p className="text-lg font-semibold text-black">
          المنتج غير متوفر
        </p>
        <Link
          href={`/products${domainQuery}`}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-black/70"
        >
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  const quantity = product
    ? items.find((item) => item.id === product.id)?.quantity ?? 0
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/products${domainQuery}`} className="text-sm text-black/70">
        العودة للمنتجات
      </Link>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product?.name ?? "صورة المنتج"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-700">
                {loading ? "جارٍ تحميل الصورة..." : "لا توجد صورة"}
              </div>
            )}
          </div>
          {product ? (
            <div className="grid grid-cols-4 gap-4">
              {[product.image_url, ...(product.gallery ?? [])]
                .filter(Boolean)
                .filter((image, index, array) => array.indexOf(image) === index)
                .map((image) => (
                  <button
                    type="button"
                    key={image}
                    onClick={() => setActiveImage(image)}
                    className={`relative aspect-square overflow-hidden rounded-lg border transition ${
                      activeImage === image
                        ? "border-black ring-2 ring-black/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    aria-label="عرض صورة المنتج"
                  >
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-semibold text-black">
            {product?.name ?? "جاري التحميل..."}
          </h1>
          {product?.description ? (
            <div
              className="prose prose-sm w-full max-w-none break-words whitespace-pre-wrap text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <p className="text-sm leading-7 text-gray-700">
              نجهز تفاصيل المنتج الآن.
            </p>
          )}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-sm text-black/70">السعر</p>
            <p className="text-2xl font-semibold text-black">
              {product ? formatCurrency(product.price) : "--"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
                onClick={() =>
                  product && updateQuantity(product.id, quantity - 1)
                }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-lg font-semibold text-black/70"
              aria-label="إنقاص الكمية"
              disabled={!product}
            >
              -
            </button>
            <span className="min-w-10 text-center text-sm font-semibold text-black">
              {quantity}
            </span>
            <button
              type="button"
                onClick={() => product && addItem(product, 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white"
              aria-label="زيادة الكمية"
              disabled={!product}
            >
              +
            </button>
          </div>
          <button
            type="button"
              onClick={() => product && addItem(product, 1)}
            className="w-full rounded-2xl border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-black/70 transition hover:border-black"
            disabled={!product}
          >
            إضافة للسلة
          </button>
          <Link
            href={`/cart${domainQuery}`}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            الذهاب إلى السلة
          </Link>
        </div>
      </div>
    </div>
  );
}
