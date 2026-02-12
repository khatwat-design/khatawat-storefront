"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { formatCurrency } from "@/lib/products";

type FormState = {
  id: string;
  name: string;
  description: string;
  price: string;
  badge: string;
  category: string;
  image: string;
  isVisible: boolean;
};

const emptyForm: FormState = {
  id: "",
  name: "",
  description: "",
  price: "",
  badge: "",
  category: "",
  image: "",
  isVisible: true,
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stats, setStats] = useState<
    Array<{ productId: string | null; sold: number; revenue: number }>
  >([]);

  useEffect(() => {
    const saved = window.localStorage.getItem("tajer-admin-token");
    if (!saved) {
      router.replace("/admin/login");
      return;
    }
    setToken(saved);
    loadProducts(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProducts = async (authToken?: string) => {
    const activeToken = authToken ?? token;
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/products?all=1", {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (!response.ok) {
        setStatus("error");
        setMessage("تعذر تحميل المنتجات حالياً.");
        return;
      }
      const data = (await response.json()) as { products?: Product[] };
      setProducts(data.products ?? []);
      await loadStats(authToken);
      setStatus("idle");
    } catch {
      setStatus("error");
      setMessage("حدث خطأ أثناء تحميل المنتجات.");
    }
  };

  const loadStats = async (authToken?: string) => {
    const activeToken = authToken ?? token;
    if (!activeToken) {
      return;
    }
    const response = await fetch("/api/admin/product-stats", {
      headers: { Authorization: `Bearer ${activeToken}` },
    });
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as {
      stats?: Array<{ productId: string | null; sold: number; revenue: number }>;
    };
    setStats(data.stats ?? []);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setStatus("error");
      setMessage("يرجى تسجيل الدخول لإدارة المنتجات.");
      router.replace("/admin/login");
      return;
    }

    const payload = {
      id: form.id.trim() || undefined,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      badge: form.badge.trim() || undefined,
      category: form.category.trim(),
      image: form.image.trim() || "/products/smart-1.svg",
      isVisible: form.isVisible,
    };

    setStatus("loading");
    setMessage("");
    const isEdit = !!editingId;
    const url = isEdit ? `/api/products/${editingId}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        if (response.status === 401) {
          setStatus("error");
          setMessage("رمز الإدارة غير صحيح.");
          router.replace("/admin/login");
          return;
        }
        setStatus("error");
        setMessage("تعذر حفظ المنتج. تأكد من البيانات.");
        return;
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
      setStatus("idle");
      setMessage(isEdit ? "تم تحديث المنتج بنجاح." : "تم إضافة المنتج بنجاح.");
    } catch {
      setStatus("error");
      setMessage("حدث خطأ أثناء حفظ المنتج.");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: String(product.price),
      badge: product.badge ?? "",
      category: product.category,
      image: product.image,
      isVisible: product.isVisible ?? true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!token) {
      setStatus("error");
      setMessage("يرجى تسجيل الدخول لإدارة المنتجات.");
      router.replace("/admin/login");
      return;
    }
    const confirmed = window.confirm("هل أنت متأكد من حذف المنتج؟");
    if (!confirmed) {
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) {
          setStatus("error");
          setMessage("رمز الإدارة غير صحيح.");
          router.replace("/admin/login");
          return;
        }
        setStatus("error");
        setMessage("تعذر حذف المنتج.");
        return;
      }
      await loadProducts();
      setStatus("idle");
      setMessage("تم حذف المنتج.");
    } catch {
      setStatus("error");
      setMessage("حدث خطأ أثناء حذف المنتج.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const totalProducts = useMemo(() => products.length, [products]);
  const visibleProducts = useMemo(
    () => products.filter((product) => product.isVisible ?? true).length,
    [products],
  );

  const statMap = useMemo(() => {
    const map = new Map<string, { sold: number; revenue: number }>();
    for (const item of stats) {
      if (item.productId) {
        map.set(item.productId, { sold: item.sold, revenue: item.revenue });
      }
    }
    return map;
  }, [stats]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)] md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              إدارة المنتجات
            </h1>
            <p className="text-sm text-[var(--color-muted)]">
              لوحة بسيطة لإضافة وتعديل وحذف المنتجات.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
            <Link href="/admin" className="hover:text-slate-900">
              لوحة التحكم
            </Link>
            <Link href="/" className="hover:text-slate-900">
              العودة للمتجر
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-sm text-[var(--color-muted)]">
          <span>كل المنتجات: {totalProducts}</span>
          <span>المعروض: {visibleProducts}</span>
          <span>الحالة: {status === "loading" ? "جاري التحميل" : "جاهز"}</span>
          {message ? <span className="text-rose-600">{message}</span> : null}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr,1.4fr]">
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "تعديل المنتج" : "إضافة منتج جديد"}
            </h2>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-[var(--color-muted)]"
              >
                إلغاء التعديل
              </button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-[var(--color-muted)]">
                اسم المنتج
              </label>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                className="w-full rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-[var(--color-muted)]">
                  التصنيف
                </label>
                <input
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  className="w-full rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[var(--color-muted)]">
                  السعر (د.ع)
                </label>
                <input
                  value={form.price}
                  onChange={(event) =>
                    setForm({ ...form, price: event.target.value })
                  }
                  type="number"
                  className="w-full rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-[var(--color-muted)]">
                وصف المنتج
              </label>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                rows={4}
                className="w-full rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-[var(--color-muted)]">
                  شارة (اختياري)
                </label>
                <input
                  value={form.badge}
                  onChange={(event) =>
                    setForm({ ...form, badge: event.target.value })
                  }
                  className="w-full rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[var(--color-muted)]">
                  رابط الصورة
                </label>
                <input
                  value={form.image}
                  onChange={(event) =>
                    setForm({ ...form, image: event.target.value })
                  }
                  className="w-full rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <input
                type="checkbox"
                checked={form.isVisible}
                onChange={(event) =>
                  setForm({ ...form, isVisible: event.target.checked })
                }
              />
              عرض المنتج في المتجر
            </label>
            <button
              type="submit"
              className="w-full rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-600)]"
              disabled={status === "loading"}
            >
              {editingId ? "تحديث المنتج" : "إضافة المنتج"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-semibold text-slate-900">قائمة المنتجات</h2>
          <div className="mt-4 space-y-3">
            {products.map((product) => {
              const metrics = statMap.get(product.id);
              return (
              <div
                key={product.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {product.category} • {formatCurrency(product.price)} •{" "}
                    {product.isVisible ?? true ? "ظاهر" : "مخفي"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    مبيعات: {metrics?.sold ?? 0} •{" "}
                    {formatCurrency(metrics?.revenue ?? 0)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                  >
                    تعديل
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:border-rose-300"
                  >
                    حذف
                  </button>
                </div>
              </div>
            );
          })}
            {!products.length && status !== "loading" ? (
              <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-4 text-sm text-[var(--color-muted)]">
                لا توجد منتجات بعد.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
