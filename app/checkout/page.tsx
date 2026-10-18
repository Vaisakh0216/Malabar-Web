"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatINR, isServiceable } from "@/lib/config";
import { priceCart } from "@/lib/pricing";
import type { PaymentMethod } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const { lines, total } = priceCart(items);
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const itemCount = lines.reduce((n, l) => n + l.qty, 0);
  const pincodeOk = pincode.length === 6 && isServiceable(pincode);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSending(true);
    const form = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer: form, items, payment }),
    });
    const body = await res.json();
    setSending(false);
    if (!res.ok) return setError(body.error ?? "Could not place the order.");
    clear();
    router.push(`/order/${body.id}`);
  }

  if (!lines.length) {
    return <p className="py-16 text-center font-display text-3xl">Your bag is empty.</p>;
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-lg space-y-6 pt-4">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Checkout</p>
        <h1 className="mt-1 font-display text-4xl tracking-tight">Delivery details</h1>
        <p className="mt-1 text-sm text-muted">
          {itemCount} {itemCount === 1 ? "item" : "items"} · {formatINR(total)}
        </p>
      </div>
      <div className="space-y-3 text-sm">
        <input name="name" required placeholder="Full name" className="w-full rounded-xl border border-linen bg-white px-3.5 py-3 outline-none transition focus:border-ink" />
        <input
          name="phone"
          required
          pattern="[0-9]{10}"
          placeholder="Mobile number (10 digits)"
          className="w-full rounded-xl border border-linen bg-white px-3.5 py-3 outline-none transition focus:border-ink"
        />
        <textarea name="address" required rows={3} placeholder="House, street, landmark" className="w-full rounded-xl border border-linen bg-white px-3.5 py-3 outline-none transition focus:border-ink" />
        <input
          name="pincode"
          required
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          placeholder="Pincode"
          className="w-full rounded-xl border border-linen bg-white px-3.5 py-3 outline-none transition focus:border-ink"
        />
        {pincode.length === 6 && (
          <p className={pincodeOk ? "font-medium text-leaf" : "text-maroon"}>
            {pincodeOk ? "Same-day delivery available" : "Sorry, we deliver only within Kozhikode city for now."}
          </p>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <p className="font-display text-xl">Payment</p>
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-linen bg-white p-4 transition has-[:checked]:border-ink has-[:checked]:bg-sand">
          <input type="radio" className="accent-ink" checked={payment === "cod"} onChange={() => setPayment("cod")} />
          Cash on delivery
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-linen bg-white p-4 transition has-[:checked]:border-ink has-[:checked]:bg-sand">
          <input type="radio" className="accent-ink" checked={payment === "online"} onChange={() => setPayment("online")} />
          Pay online (UPI, cards, net banking)
        </label>
        {payment === "online" && (
          <p className="text-xs text-muted">You will get a secure payment link on WhatsApp right after placing the order.</p>
        )}
      </div>

      {error && <p className="text-sm text-maroon">{error}</p>}
      <button disabled={!pincodeOk || sending} className="w-full rounded-full bg-ink py-4 font-semibold text-ivory transition hover:bg-ink/90 disabled:opacity-40">
        {sending ? "Placing order..." : `Place order · ${formatINR(total)}`}
      </button>
    </form>
  );
}
