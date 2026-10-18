import { NextResponse } from "next/server";
import { getBoutique, getProduct } from "@/lib/catalog";
import { newId, saveCustomRequest } from "@/lib/store";
import type { CustomRequest } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, string> | null;
  const product = body?.productId ? getProduct(body.productId) : undefined;
  const name = body?.name?.trim() ?? "";
  const phone = body?.phone?.trim() ?? "";
  const notes = body?.notes?.trim() ?? "";

  if (!product?.customisable) {
    return NextResponse.json({ error: "This product cannot be customised." }, { status: 400 });
  }
  if (!name || !/^\d{10}$/.test(phone) || !notes) {
    return NextResponse.json({ error: "Please add your name, a 10-digit WhatsApp number and what you want changed." }, { status: 400 });
  }

  const request: CustomRequest = {
    id: newId("CUS"),
    createdAt: new Date().toISOString(),
    productId: product.id,
    productName: product.name,
    boutique: getBoutique(product.boutique)?.name ?? product.boutique,
    name,
    phone,
    measurements: body?.measurements?.trim().slice(0, 500) ?? "",
    notes: notes.slice(0, 1000),
    status: "new",
  };
  try {
    await saveCustomRequest(request);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "We could not send your request. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ id: request.id });
}
