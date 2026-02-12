import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

const ADMIN_TOKEN = process.env.ADMIN_DASHBOARD_TOKEN;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return NextResponse.json({ message: "غير مصرح." }, { status: 401 });
  }

  const prisma = getPrisma();
  const [orders, products] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.product.findMany(),
  ]);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum: number, order: { total: number }) => sum + order.total,
    0,
  );
  const totalProducts = products.length;
  const visibleProducts = products.filter(
    (p: { isVisible: boolean }) => p.isVisible,
  ).length;

  const last7Days = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const label = date.toLocaleDateString("ar-IQ", {
      month: "short",
      day: "numeric",
    });
    return { date, label, total: 0 };
  });

  for (const order of orders) {
    const orderDate = new Date(order.createdAt);
    const bucket = last7Days.find(
      (d) =>
        d.date.getFullYear() === orderDate.getFullYear() &&
        d.date.getMonth() === orderDate.getMonth() &&
        d.date.getDate() === orderDate.getDate(),
    );
    if (bucket) {
      bucket.total += order.total;
    }
  }

  return NextResponse.json({
    totalOrders,
    totalRevenue,
    totalProducts,
    visibleProducts,
    dailySales: last7Days.map((d) => ({ label: d.label, total: d.total })),
  });
}
