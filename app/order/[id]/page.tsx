import Link from "next/link";
import { notFound } from "next/navigation";
import { formatINR, RETURN_WINDOW_HOURS, whatsappLink } from "@/lib/config";
import { getOrder } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-lg space-y-5 pt-8">
      <div className="rounded-3xl bg-leaf p-6 text-ivory">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ivory text-2xl text-leaf">✓</span>
        <p className="mt-4 font-display text-3xl">Order placed</p>
        <p className="mt-1 text-sm text-ivory/80">
          Order {order.id} · {order.deliveryPromise}
        </p>
      </div>
      {order.payment === "online" && order.paymentStatus === "awaiting_payment" && (
        <p className="rounded-2xl bg-gold-soft/60 p-4 text-sm">
          We will send a payment link to {order.customer.phone} on WhatsApp. Your order is packed once payment is received.
        </p>
      )}
      <div className="space-y-2.5 rounded-3xl bg-white p-5 text-sm ring-1 ring-linen">
        {order.lines.map((l) => (
          <div key={`${l.productId}-${l.size}`} className="flex justify-between gap-4">
            <span>
              {l.name} ({l.size}) × {l.qty}
              <span className="block text-xs text-muted">{l.boutique}</span>
            </span>
            <span>{formatINR(l.price * l.qty)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-linen pt-3 font-bold">
          <span>Total {order.payment === "cod" ? "(pay on delivery)" : ""}</span>
          <span>{formatINR(order.total)}</span>
        </div>
      </div>
      <p className="text-sm text-muted">
        Not happy with it? Request a return within {RETURN_WINDOW_HOURS} hours of delivery and we will pick it up on our next run.
      </p>
      <div className="flex gap-3">
        <a
          href={whatsappLink(`Hi, I need help with order ${order.id}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-full border border-leaf py-3 text-center text-sm font-semibold text-leaf"
        >
          Help on WhatsApp
        </a>
        <Link href="/" className="flex-1 rounded-full bg-ink py-3 text-center text-sm font-semibold text-ivory">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
