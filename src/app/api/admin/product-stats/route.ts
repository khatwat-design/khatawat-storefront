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
  const stats = await prisma.orderItem.groupBy({
    by: ["productId", "name"],
    _sum: { quantity: true, subtotal: true },
  });

  return NextResponse.json({
    stats: stats.map(
      (item: {
        productId: string | null;
        name: string;
        _sum: { quantity: number | null; subtotal: number | null };
      }) => ({
        productId: item.productId,
        name: item.name,
        sold: item._sum.quantity ?? 0,
        revenue: item._sum.subtotal ?? 0,
      }),
    ),
  });
}
