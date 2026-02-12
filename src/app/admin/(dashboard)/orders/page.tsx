"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/products";

type OrderRecord = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalItems: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    const saved = window.localStorage.getItem("tajer-admin-token");
    if (!saved) {
      router.replace("/admin/login");
      return;
    }
    setToken(saved);
    loadOrders(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrders = async (authToken: string) => {
    setStatus("loading");
    try {
      const response = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        setStatus("error");
        return;
      }
      const result = (await response.json()) as { orders: OrderRecord[] };
      setOrders(result.orders ?? []);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">الطلبات</h1>
            <p className="text-sm text-[var(--color-muted)]">
              إدارة جميع الطلبات الواردة من المتجر.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
            <button
              type="button"
              onClick={() => token && loadOrders(token)}
              className="rounded-2xl border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
            >
              تحديث
            </button>
            <Link href="/admin" className="hover:text-slate-900">
              لوحة التحكم
            </Link>
          </div>
        </div>
        {status === "error" ? (
          <p className="mt-4 text-sm text-rose-600">
            تعذر تحميل الطلبات. تحقق من رمز الإدارة.
          </p>
        ) : null}
      </section>

      <section className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[var(--color-muted)]">
                  رقم الطلب: <span className="text-slate-900">{order.id}</span>
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  {new Date(order.createdAt).toLocaleString("ar-IQ")}
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {formatCurrency(order.total)}
              </p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--color-border)] p-4 text-sm text-[var(--color-muted)]">
                <p className="font-semibold text-slate-900">بيانات العميل</p>
                <p>الاسم: {order.name}</p>
                <p>الجوال: {order.phone}</p>
                <p>المدينة: {order.city}</p>
                <p>العنوان: {order.address}</p>
                {order.notes ? <p>ملاحظات: {order.notes}</p> : null}
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] p-4 text-sm text-[var(--color-muted)]">
                <p className="font-semibold text-slate-900">تفاصيل الطلب</p>
                <ul className="mt-2 space-y-2">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between">
                      <span>
                        {item.name} ({item.quantity})
                      </span>
                      <span>{formatCurrency(item.subtotal)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
        {!orders.length && status !== "loading" ? (
          <div className="rounded-3xl border border-dashed border-[var(--color-border)] p-6 text-sm text-[var(--color-muted)]">
            لا توجد طلبات حتى الآن.
          </div>
        ) : null}
      </section>
    </div>
  );
}
