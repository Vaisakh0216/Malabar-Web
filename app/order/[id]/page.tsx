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
      <div className="rounded-xl bg-green-50 p-5">
        <p className="text-lg font-bold text-green-800">Order placed</p>
        <p className="text-sm text-green-800">
          Order {order.id} · {order.deliveryPromise}
        </p>
      </div>
      {order.payment === "online" && order.paymentStatus === "awaiting_payment" && (
        <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
          We will send a payment link to {order.customer.phone} on WhatsApp. Your order is packed once payment is received.
        </p>
      )}
      <div className="space-y-2 rounded-lg bg-white p-4 text-sm">
        {order.lines.map((l) => (
          <div key={`${l.productId}-${l.size}`} className="flex justify-between gap-4">
            <span>
              {l.name} ({l.size}) × {l.qty}
              <span className="block text-xs text-neutral-500">{l.boutique}</span>
            </span>
            <span>{formatINR(l.price * l.qty)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t pt-2 font-bold">
          <span>Total {order.payment === "cod" ? "(pay on delivery)" : ""}</span>
          <span>{formatINR(order.total)}</span>
        </div>
      </div>
      <p className="text-sm text-neutral-600">
        Not happy with it? Request a return within {RETURN_WINDOW_HOURS} hours of delivery and we will pick it up on our next run.
      </p>
      <div className="flex gap-3">
        <a
          href={whatsappLink(`Hi, I need help with order ${order.id}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-lg border border-green-600 py-3 text-center text-sm font-semibold text-green-700"
        >
          Help on WhatsApp
        </a>
        <Link href="/" className="flex-1 rounded-lg bg-brand py-3 text-center text-sm font-semibold text-white">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
