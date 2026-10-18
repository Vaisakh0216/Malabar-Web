import { NextResponse } from "next/server";
import { deliveryPromise, isServiceable } from "@/lib/config";
import { priceCart } from "@/lib/pricing";
import { newId, saveOrder } from "@/lib/store";
import type { CartItem, Order, PaymentMethod } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    customer?: Record<string, string>;
    items?: CartItem[];
    payment?: PaymentMethod;
  } | null;
  const c = body?.customer ?? {};
  const name = c.name?.trim() ?? "";
  const phone = c.phone?.trim() ?? "";
  const address = c.address?.trim() ?? "";
  const pincode = c.pincode?.trim() ?? "";
  const payment = body?.payment === "online" ? "online" : "cod";

  if (!name || !/^\d{10}$/.test(phone) || !address) {
    return NextResponse.json({ error: "Please fill in your name, a 10-digit mobile number and address." }, { status: 400 });
  }
  if (!isServiceable(pincode)) {
    return NextResponse.json({ error: "We deliver only within Kozhikode city for now." }, { status: 400 });
  }
  const priced = priceCart(Array.isArray(body?.items) ? body.items : []);
  if (!priced.lines.length) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  const order: Order = {
    id: newId("ORD"),
    createdAt: new Date().toISOString(),
    customer: { name, phone, address, pincode },
    ...priced,
    payment,
    paymentStatus: payment === "cod" ? "cod_pending" : "awaiting_payment",
    status: "placed",
    deliveryPromise: deliveryPromise(),
  };
  await saveOrder(order);
  return NextResponse.json({ id: order.id });
}
