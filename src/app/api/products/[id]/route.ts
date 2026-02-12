import { NextResponse, type NextRequest } from "next/server";
import type { Product } from "@/lib/products";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

const ADMIN_TOKEN = process.env.ADMIN_DASHBOARD_TOKEN;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const prisma = getPrisma();
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) {
    return NextResponse.json({ message: "غير موجود." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return NextResponse.json({ message: "غير مصرح." }, { status: 401 });
  }

  const prisma = getPrisma();
  const payload = (await request.json()) as Partial<Product>;
  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: payload.name?.trim(),
      description: payload.description?.trim(),
      price: payload.price !== undefined ? Number(payload.price) : undefined,
      badge: payload.badge?.trim() ?? undefined,
      category: payload.category?.trim(),
      image: payload.image?.trim(),
      isVisible: payload.isVisible,
    },
  }).catch(() => null);

  if (!updated) {
    return NextResponse.json({ message: "غير موجود." }, { status: 404 });
  }

  return NextResponse.json({ product: updated });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return NextResponse.json({ message: "غير مصرح." }, { status: 401 });
  }

  const prisma = getPrisma();
  const deleted = await prisma.product
    .delete({ where: { id } })
    .catch(() => null);
  if (!deleted) {
    return NextResponse.json({ message: "غير موجود." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
