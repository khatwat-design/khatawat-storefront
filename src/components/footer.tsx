"use client";

import Link from "next/link";
import { useStore } from "@/components/store-context";

export default function Footer() {
  const store = useStore();
  const { domainQuery } = store;

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-center">
          <Link href={domainQuery ? `/${domainQuery}` : "/"} className="flex items-center gap-3 group">
            {store.logoUrl && store.logoUrl.trim() !== "" ? (
              <img
                src={store.logoUrl}
                alt={store.storeName}
                className="h-16 w-auto transition-transform group-hover:scale-110"
              />
            ) : (
              <h2 className="text-xl font-bold text-black">{store.storeName}</h2>
            )}
          </Link>
        </div>
      </div>
    </footer>
  );
}
