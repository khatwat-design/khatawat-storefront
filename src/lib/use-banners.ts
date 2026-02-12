"use client";

import { useEffect, useState } from "react";
import { getBanners, type Banner } from "@/lib/api";
import { useStore } from "@/components/store-context";

export function useBanners(): { banners: Banner[]; loading: boolean } {
  const { domain } = useStore();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!domain) {
      setBanners([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getBanners(domain ?? undefined)
      .then(setBanners)
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, [domain]);

  return { banners, loading };
}
