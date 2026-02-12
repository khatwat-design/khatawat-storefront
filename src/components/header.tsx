"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useStore } from "@/components/store-context";
import { useCartStore } from "@/lib/store";

export default function Header() {
  const store = useStore();
  const { domainQuery } = store;
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const toggleCart = useCartStore((state) => state.toggleCart);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const count = mounted
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-lg' 
        : 'border-transparent bg-white'
    }`}>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href={domainQuery ? `/${domainQuery}` : "/"} className="flex items-center gap-3 group">
          {store.logoUrl && store.logoUrl.trim() !== "" ? (
            <img
              key={store.logoUrl}
              src={store.logoUrl}
              alt={store.storeName}
              className="h-12 w-auto transition-transform group-hover:scale-110"
            />
          ) : (
            <h1 className="text-xl font-bold text-black">{store.storeName}</h1>
          )}
        </Link>
        
        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-black/70 hover:border-gray-300 hover:text-black transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            بحث
          </button>

          <button
            type="button"
            onClick={toggleCart}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg transition-all hover:border-gray-300 hover:bg-gray-50 hover:scale-110"
            aria-label="السلة"
          >
            <ShoppingBag className="h-6 w-6 text-gray-800" aria-hidden="true" />
            {count > 0 ? (
              <span className="absolute -left-1 -top-1 rounded-full bg-orange-500 text-white px-1.5 py-0.5 text-[11px] font-semibold">
                {count}
              </span>
            ) : null}
          </button>

          <button 
            className="md:hidden flex flex-col gap-1 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`w-6 h-0.5 bg-black transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-black transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-black transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col gap-4 px-6 py-4 text-sm font-medium text-black/70">
            <button className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-black/70 hover:border-gray-300 hover:text-black transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              بحث
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
