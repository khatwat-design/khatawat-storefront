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
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}
