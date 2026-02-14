"use client";

import Script from "next/script";
import { useStore } from "@/components/store-context";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Product } from "@/lib/api";

declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/** Hook to track Meta Pixel events from any component */
export function useMetaPixelTrack() {
  const { storeDetails } = useStore();
  const pixelId = storeDetails?.meta_pixel_id ?? storeDetails?.facebook_pixel_id;

  const track = (event: string, params?: Record<string, unknown>) => {
    if (typeof window !== "undefined" && window.fbq && pixelId) {
      window.fbq("track", event, params);
    }
  };

  return {
    trackViewContent: (product: Product) => {
      track("ViewContent", {
        content_ids: [product.id],
        content_name: product.name,
        content_type: "product",
        value: product.price,
        currency: storeDetails?.currency ?? "IQD",
      });
    },
    trackAddToCart: (product: Product, quantity = 1) => {
      track("AddToCart", {
        content_ids: [product.id],
        content_name: product.name,
        content_type: "product",
        value: product.price * quantity,
        currency: storeDetails?.currency ?? "IQD",
        num_items: quantity,
      });
    },
    trackInitiateCheckout: (value: number, numItems: number) => {
      track("InitiateCheckout", {
        value,
        currency: storeDetails?.currency ?? "IQD",
        num_items: numItems,
      });
    },
    trackPurchase: (value: number, orderId?: string) => {
      track("Purchase", {
        value,
        currency: storeDetails?.currency ?? "IQD",
        order_id: orderId,
      });
    },
    isEnabled: !!pixelId,
  };
}

/** Wrapper that injects the script and tracks PageView. Use in layout. */
export default function MetaPixel() {
  const { storeDetails } = useStore();
  const pixelId = storeDetails?.meta_pixel_id ?? storeDetails?.facebook_pixel_id;
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (pixelId && window.fbq && pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      window.fbq("track", "PageView");
    }
  }, [pixelId, pathname]);

  if (!pixelId) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
