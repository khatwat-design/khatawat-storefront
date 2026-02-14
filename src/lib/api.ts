const API_URL = process.env.NEXT_PUBLIC_API_URL;
const STORE_API_KEY = process.env.NEXT_PUBLIC_STORE_API_KEY;

/** Cache TTL in seconds (stale-while-revalidate). */
const CACHE_TTL_SEC = 60;

/** Simple in-memory cache for GET requests. Key: `${url}|${domain}` */
const cache = new Map<
  string,
  { data: unknown; timestamp: number; fresh: boolean }
>();

function getCacheKey(url: string, domain?: string): string {
  return `${url}|${domain ?? ""}`;
}

function getCachedEntry<T>(
  key: string
): { data: T; ageSec: number } | null {
  const entry = cache.get(key);
  if (!entry) return null;
  const ageSec = (Date.now() - entry.timestamp) / 1000;
  if (ageSec > CACHE_TTL_SEC * 2) {
    cache.delete(key);
    return null;
  }
  return { data: entry.data as T, ageSec };
}

function setCache(key: string, data: unknown): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    fresh: true,
  });
}

/** Cached fetch with stale-while-revalidate. Returns cached if fresh; if stale, returns cached and revalidates in background. */
async function cachedFetch<T>(
  url: string,
  domain: string | undefined,
  fetcher: () => Promise<T>
): Promise<T> {
  const key = getCacheKey(url, domain);
  const entry = getCachedEntry<T>(key);

  if (entry) {
    if (entry.ageSec <= CACHE_TTL_SEC) {
      return entry.data;
    }
    fetcher().then((data) => setCache(key, data));
    return entry.data;
  }

  const data = await fetcher();
  setCache(key, data);
  return data;
}

export interface StoreDetails {
  store_name: string;
  brand_color: string;
  currency: string;
  logo_url: string;
  shipping_cost?: number;
  facebook_pixel_id?: string;
  meta_pixel_id?: string;
  tiktok_pixel_id?: string;
  snapchat_pixel_id?: string;
  google_analytics_id?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  gallery?: string[];
}

export interface Banner {
  id: number;
  image_url: string;
  link: string | null;
  position: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
    paymentMethod?: string;
  };
  items: OrderItem[];
  summary: {
    subtotal: number;
    deliveryFee: number;
    total: number;
    totalItems: number;
  };
  channel?: string;
}

const buildUrl = (path: string) => {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }
  return `${API_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

/**
 * Builds headers for all storefront API requests.
 * X-Store-Domain is always included so Laravel can resolve the tenant; callers must pass
 * the current domain from the URL (?domain=xyz) via StoreProvider/useStore().
 */
const buildHeaders = (domain?: string) => ({
  "Content-Type": "application/json",
  "X-Store-API-Key": STORE_API_KEY ?? "",
  "X-Store-Domain": domain ?? "",
  Accept: "application/json",
});

/** Fetch store settings for the given tenant. Pass domain from URL (?domain=) via useStore(). */
export const getStoreDetails = async (domain?: string): Promise<StoreDetails> => {
  return cachedFetch(
    buildUrl("/api/store"),
    domain,
    async () => {
      const response = await fetch(buildUrl("/api/store"), {
        headers: buildHeaders(domain),
      });
      if (!response.ok) throw new Error("Failed to fetch store details.");
      const data = (await response.json()) as StoreDetails;
      return {
        store_name: data.store_name,
        brand_color: data.brand_color,
        currency: data.currency,
        logo_url: data.logo_url || "",
        shipping_cost: data.shipping_cost ?? 0,
        facebook_pixel_id: data.facebook_pixel_id,
        meta_pixel_id: data.meta_pixel_id ?? data.facebook_pixel_id,
        tiktok_pixel_id: data.tiktok_pixel_id,
        snapchat_pixel_id: data.snapchat_pixel_id,
        google_analytics_id: data.google_analytics_id,
      };
    }
  );
};

/** Fetch banners for the current tenant. Pass domain from useStore(). */
export const getBanners = async (domain?: string): Promise<Banner[]> => {
  return cachedFetch(
    buildUrl("/api/store/banners"),
    domain,
    async () => {
      const response = await fetch(buildUrl("/api/store/banners"), {
        headers: buildHeaders(domain),
      });
      if (!response.ok) return [];
      return response.json();
    }
  );
};

/** Fetch products for the current tenant. Pass domain from useStore(). */
export const getProducts = async (domain?: string): Promise<Product[]> => {
  return cachedFetch(
    buildUrl("/api/store/products"),
    domain,
    async () => {
      const response = await fetch(buildUrl("/api/store/products"), {
        headers: buildHeaders(domain),
      });
      if (!response.ok) throw new Error("Failed to fetch products.");
      return response.json();
    }
  );
};

/** Fetch a single product for the current tenant. Pass domain from useStore(). */
export const getProduct = async (id: string, domain?: string): Promise<Product | null> => {
  return cachedFetch(
    buildUrl(`/api/store/products/${id}`),
    domain,
    async () => {
      const response = await fetch(buildUrl(`/api/store/products/${id}`), {
        headers: buildHeaders(domain),
      });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Failed to fetch product.");
      return response.json();
    }
  );
};

/** Place order for the current tenant. Pass domain from useStore(). */
export const placeOrder = async (orderData: Order, domain?: string) => {
  const response = await fetch(buildUrl("/api/store/orders"), {
    method: "POST",
    headers: buildHeaders(domain),
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    let message = "Failed to place order.";
    try {
      const data = (await response.json()) as { message?: string };
      message = data?.message ?? message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return response.json();
};

/** Payload for POST /api/orders (Laravel backend) */
export interface CheckoutOrderPayload {
  customer_first_name: string;
  customer_last_name: string;
  phone: string;
  address: string;
  items: { product_id: string; quantity: number }[];
  coupon_code?: string;
}

export type CheckoutOrderResponse = { success?: boolean; message?: string; error?: string };

export interface ValidateCouponResponse {
  valid: boolean;
  discount?: number;
  discount_type?: string;
  discount_value?: number;
  message?: string;
}

/** Validate coupon code. Pass domain from useStore(). */
export const validateCoupon = async (
  code: string,
  subtotal: number,
  domain?: string
): Promise<ValidateCouponResponse> => {
  const url = buildUrl("api/storefront/validate-coupon");
  const response = await fetch(url, {
    method: "POST",
    headers: buildHeaders(domain),
    body: JSON.stringify({ code, subtotal }),
  });
  const data = (await response.json()) as ValidateCouponResponse & { message?: string };
  if (!response.ok) {
    return { valid: false, message: data.message || "الكود غير صالح" };
  }
  return data;
};

/** Submit checkout to Laravel. Pass domain from useStore() so the order is attributed to the correct tenant. Uses NEXT_PUBLIC_API_URL. */
export const submitCheckoutOrder = async (
  payload: CheckoutOrderPayload,
  domain?: string
): Promise<CheckoutOrderResponse> => {
  const url = buildUrl("api/storefront/orders");
  const response = await fetch(url, {
    method: "POST",
    headers: buildHeaders(domain),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || "Failed to submit order");
  }

  return (await response.json()) as CheckoutOrderResponse;
};
