"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import storeConfig from "@/lib/store-config";
import { getStoreDetails, type StoreDetails } from "@/lib/api";

/**
 * Store context value. domain and domainQuery are the single source of truth
 * for tenant identity, derived from the URL search param ?domain=xyz.
 */
type StoreContextValue = {
  storeName: string;
  brandColor: string;
  currency: string;
  logoUrl: string;
  shippingCost: number;
  /** Current tenant domain from URL (?domain=xyz). Source of truth for store context. */
  domain: string | null;
  /** Query string to append to internal links, e.g. "" or "?domain=xyz". Use on all storefront Link hrefs and redirects. */
  domainQuery: string;
  /** Full store details from API (for analytics scripts). */
  storeDetails: StoreDetails | null;
};

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const mapDetails = (details: {
  store_name: string;
  brand_color: string;
  currency: string;
  logo_url: string;
  shipping_cost?: number;
}): StoreContextValue => ({
  storeName: details.store_name,
  brandColor: details.brand_color,
  currency: details.currency,
  logoUrl: details.logo_url,
  shippingCost: details.shipping_cost ?? 0,
});

/**
 * Single source of truth for tenant identity. Reads ?domain=xyz from the URL
 * (works the same on localhost or production; no hostname logic), fetches store
 * details from the backend with that domain, and provides domain + domainQuery
 * so all API calls and links use the correct tenant.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const domainFromUrl = searchParams.get("domain");

  const domain = useMemo(() => {
    if (domainFromUrl) {
      return domainFromUrl;
    }
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("store-domain");
      if (stored) {
        return stored;
      }
    }
    return null;
  }, [domainFromUrl]);

  useEffect(() => {
    if (domainFromUrl && typeof window !== "undefined") {
      sessionStorage.setItem("store-domain", domainFromUrl);
    }
  }, [domainFromUrl]);

  const domainQuery = useMemo(
    () => (domain ? `?domain=${encodeURIComponent(domain)}` : ""),
    [domain]
  );

  const [store, setStore] = useState<StoreContextValue>({
    storeName: storeConfig.storeName,
    brandColor: storeConfig.brandColor,
    currency: storeConfig.currency,
    logoUrl: storeConfig.logoUrl,
    shippingCost: 0,
    domain: domain ?? null,
    domainQuery,
    storeDetails: null,
  });

  useEffect(() => {
    const applyBrand = (color: string) => {
      document.documentElement.style.setProperty("--primary-color", color);
    };

    applyBrand(store.brandColor);

    const load = async () => {
      try {
    const details = await getStoreDetails(domain ?? undefined);
        const mapped = mapDetails(details);
        setStore((prev) => ({
          ...mapped,
          domain: domain ?? null,
          domainQuery,
          storeDetails: details,
        }));
        applyBrand(mapped.brandColor);
      } catch {
        // Fall back to local config if ERP is unreachable.
        setStore((prev) => ({
          ...prev,
          domain: domain ?? null,
          domainQuery,
          storeDetails: null,
        }));
      }
    };

    load();
  }, [domain, domainQuery]);

  const value = useMemo(
    () => ({ ...store, domain: domain ?? null, domainQuery }),
    [store, domain, domainQuery]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return ctx;
};
