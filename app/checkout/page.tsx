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
    return <p className="py-16 text-center">Your bag is empty.</p>;
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-lg space-y-6 pt-4">
      <h1 className="text-xl font-bold">Delivery details</h1>
      <div className="space-y-3 text-sm">
        <input name="name" required placeholder="Full name" className="w-full rounded-md border bg-white px-3 py-2.5" />
        <input
          name="phone"
          required
          pattern="[0-9]{10}"
          placeholder="Mobile number (10 digits)"
          className="w-full rounded-md border bg-white px-3 py-2.5"
        />
        <textarea name="address" required rows={3} placeholder="House, street, landmark" className="w-full rounded-md border bg-white px-3 py-2.5" />
        <input
          name="pincode"
          required
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          placeholder="Pincode"
          className="w-full rounded-md border bg-white px-3 py-2.5"
        />
        {pincode.length === 6 && (
          <p className={pincodeOk ? "text-green-700" : "text-red-600"}>
            {pincodeOk ? "Same-day delivery available" : "Sorry, we deliver only within Kozhikode city for now."}
          </p>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <p className="font-semibold">Payment</p>
        <label className="flex items-center gap-3 rounded-md border bg-white p-3">
          <input type="radio" checked={payment === "cod"} onChange={() => setPayment("cod")} />
          Cash on delivery
        </label>
        <label className="flex items-center gap-3 rounded-md border bg-white p-3">
          <input type="radio" checked={payment === "online"} onChange={() => setPayment("online")} />
          Pay online (UPI, cards, net banking)
        </label>
        {payment === "online" && (
          <p className="text-xs text-neutral-500">You will get a secure payment link on WhatsApp right after placing the order.</p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={!pincodeOk || sending} className="w-full rounded-lg bg-brand py-3 font-semibold text-white disabled:opacity-40">
        {sending ? "Placing order..." : `Place order · ${formatINR(total)}`}
      </button>
    </form>
  );
}
