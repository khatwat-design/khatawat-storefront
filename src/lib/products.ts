import storeConfig from "@/lib/store-config";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
  category: string;
  image: string;
  isVisible?: boolean;
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: storeConfig.currency,
  }).format(amount);
