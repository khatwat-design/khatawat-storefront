import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/lib/api";

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: string;
}

type CartState = {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (product: Product, qty?: number, variant?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getCartTotal: () => number;
};

const STORAGE_KEY = "tajer-cart-v2";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      addItem: (product, qty = 1, variant) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.id === product.id && item.selectedVariant === variant,
          );
          if (existingIndex === -1) {
            return {
              items: [
                ...state.items,
                { ...product, quantity: qty, selectedVariant: variant },
              ],
            };
          }
          const nextItems = [...state.items];
          nextItems[existingIndex] = {
            ...nextItems[existingIndex],
            quantity: nextItems[existingIndex].quantity + qty,
          };
          return { items: nextItems };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      updateQuantity: (id, qty) => {
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) =>
                  item.id === id ? { ...item, quantity: qty } : item,
                ),
        }));
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () =>
        set((state) => ({ isCartOpen: !state.isCartOpen })),
      getCartTotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        isCartOpen: state.isCartOpen,
      }),
    },
  ),
);
