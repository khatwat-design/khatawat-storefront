"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/lib/api";
import { getProducts } from "@/lib/api";
import { useStore } from "@/components/store-context";

export type ProductsState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

/** Fetches products for the current tenant. Domain from StoreProvider (URL ?domain=) is passed to the API. */
export const useProducts = (): ProductsState => {
  const { domain } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(domain ?? undefined);
      setProducts(data);
    } catch (err) {
      setError("تعذر تحميل المنتجات حالياً.");
    } finally {
      setLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    load();
  }, [load]);

  return { products, loading, error, refresh: load };
};
