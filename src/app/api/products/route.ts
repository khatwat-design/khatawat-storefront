import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type { Product } from "@/lib/products";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

const ADMIN_TOKEN = process.env.ADMIN_DASHBOARD_TOKEN;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "1";
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  const canViewAll = all && ADMIN_TOKEN && token === ADMIN_TOKEN;

  const prisma = getPrisma();
  const products = await prisma.product.findMany({
    where: canViewAll ? undefined : { isVisible: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return NextResponse.json({ message: "غير مصرح." }, { status: 401 });
  }

  const prisma = getPrisma();
  const payload = (await request.json()) as Partial<Product>;
  if (
    !payload.name ||
    !payload.description ||
    payload.price === undefined ||
    payload.price === null ||
    !payload.category
  ) {
    return NextResponse.json(
      { message: "بيانات المنتج غير مكتملة." },
      { status: 400 },
    );
  }

  const product = await prisma.product.create({
    data: {
      id: payload.id?.trim() || `prod-${randomUUID().slice(0, 8)}`,
      name: payload.name.trim(),
      description: payload.description.trim(),
      price: Number(payload.price),
      category: payload.category.trim(),
      badge: payload.badge?.trim() || null,
      image: payload.image?.trim() || "/products/smart-1.svg",
      isVisible: payload.isVisible ?? true,
    },
  });

  return NextResponse.json({ product });
}
