"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/products";

type OrderRecord = {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
    paymentMethod?: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
  summary: {
    subtotal: number;
    deliveryFee: number;
    total: number;
    totalItems: number;
  };
};

export default function AdminPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const router = useRouter();
  const [token, setToken] = useState("");
  const [metrics, setMetrics] = useState<{
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    visibleProducts: number;
    dailySales: Array<{ label: string; total: number }>;
  } | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("tajer-admin-token");
    if (!saved) {
      router.replace("/admin/login");
      return;
    }
    setToken(saved);
    fetchOrders(saved);
    fetchMetrics(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + order.summary.total, 0),
    [orders],
  );

  const fetchOrders = async (authToken: string) => {
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
      setOrders(result.orders || []);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
    }
  };

  const fetchMetrics = async (authToken: string) => {
    try {
      const response = await fetch("/api/admin/metrics", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        return;
      }
      const result = (await response.json()) as {
        totalOrders: number;
        totalRevenue: number;
        totalProducts: number;
        visibleProducts: number;
        dailySales: Array<{ label: string; total: number }>;
      };
      setMetrics(result);
    } catch {
      setMetrics(null);
    }
  };

  const handleRefresh = () => {
    if (token) {
      fetchOrders(token);
      fetchMetrics(token);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("tajer-admin-token");
    router.replace("/admin/login");
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              لوحة التحكم
            </h1>
            <p className="text-sm text-[var(--color-muted)]">
              هذه الصفحة للاستخدام الداخلي لإدارة الطلبات.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
            <Link href="/admin/products" className="hover:text-slate-900">
              إدارة المنتجات
            </Link>
            <Link href="/" className="hover:text-slate-900">
              العودة للمتجر
            </Link>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-600)]"
          >
            تحديث الطلبات
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
          >
            تسجيل الخروج
          </button>
        </div>
        {status === "error" ? (
          <p className="mt-4 text-sm text-rose-600">
            فشل تحميل الطلبات. تأكد من صلاحيات الدخول.
          </p>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="text-sm text-[var(--color-muted)]">إجمالي الطلبات</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {metrics?.totalOrders ?? orders.length}
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="text-sm text-[var(--color-muted)]">إجمالي المبيعات</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {formatCurrency(metrics?.totalRevenue ?? totalRevenue)}
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="text-sm text-[var(--color-muted)]">كل المنتجات</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {metrics?.totalProducts ?? 0}
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="text-sm text-[var(--color-muted)]">المعروض بالمتجر</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {metrics?.visibleProducts ?? 0}
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="text-sm text-[var(--color-muted)]">حالة النظام</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {status === "loading" ? "جاري التحميل" : "جاهز"}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            أداء المبيعات لآخر 7 أيام
          </h2>
          <span className="text-xs text-[var(--color-muted)]">يومي</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-7">
          {(metrics?.dailySales ?? []).map((day, index, list) => {
            const max = Math.max(...list.map((item) => item.total), 1);
            const height = Math.round((day.total / max) * 100);
            return (
            <div
              key={day.label}
              className="flex flex-col items-center gap-2"
            >
              <div className="h-20 w-6 rounded-full bg-slate-100">
                <div
                  className="w-full rounded-full bg-[var(--color-primary)]"
                  style={{
                    height: `${height}%`,
                  }}
                />
              </div>
              <span className="text-[11px] text-[var(--color-muted)]">
                {day.label}
              </span>
            </div>
          );
        })}
          {!metrics?.dailySales?.length ? (
            <p className="text-sm text-[var(--color-muted)]">
              لا توجد بيانات مبيعات كافية بعد.
            </p>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm text-[var(--color-muted)]">
                  رقم الطلب: <span className="text-slate-900">{order.id}</span>
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  {new Date(order.createdAt).toLocaleString("ar-IQ")}
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {formatCurrency(order.summary.total)}
              </p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--color-border)] p-4 text-sm text-[var(--color-muted)]">
                <p className="font-semibold text-slate-900">بيانات العميل</p>
                <p>الاسم: {order.customer.name}</p>
                <p>الجوال: {order.customer.phone}</p>
                <p>المدينة: {order.customer.city}</p>
                <p>العنوان: {order.customer.address}</p>
                {order.customer.notes ? (
                  <p>ملاحظات: {order.customer.notes}</p>
                ) : null}
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
        {!orders.length && status === "idle" ? (
          <div className="rounded-3xl border border-dashed border-[var(--color-border)] p-6 text-sm text-[var(--color-muted)]">
            لا توجد طلبات حتى الآن.
          </div>
        ) : null}
      </section>
    </div>
  );
}
