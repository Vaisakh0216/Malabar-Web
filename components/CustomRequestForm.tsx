"use client";

import { useState } from "react";

export default function CustomRequestForm({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [requestId, setRequestId] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/custom-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, ...Object.fromEntries(form) }),
    });
    if (!res.ok) return setState("error");
    setRequestId((await res.json()).id);
    setState("sent");
  }

  if (state === "sent") {
    return (
      <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
        Request {requestId} received. The boutique will send you a price and delivery date on WhatsApp. Customised orders
        are confirmed once paid online; cash on delivery is not available for them.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className="text-sm font-semibold text-amber-900">
          Want it customised? Request a custom design
        </button>
      ) : (
        <form onSubmit={submit} className="space-y-3 text-sm">
          <p className="font-semibold text-amber-900">Custom design request</p>
          <input name="name" required placeholder="Your name" className="w-full rounded-md border bg-white px-3 py-2" />
          <input
            name="phone"
            required
            pattern="[0-9]{10}"
            placeholder="WhatsApp number (10 digits)"
            className="w-full rounded-md border bg-white px-3 py-2"
          />
          <textarea
            name="measurements"
            rows={2}
            placeholder="Measurements (bust, waist, length) or 'measure me at home'"
            className="w-full rounded-md border bg-white px-3 py-2"
          />
          <textarea
            name="notes"
            rows={3}
            required
            placeholder="What would you like changed? Colour, border, sleeve, blouse design..."
            className="w-full rounded-md border bg-white px-3 py-2"
          />
          <p className="text-xs text-amber-900/80">Customised orders are prepaid only and cannot be returned.</p>
          <button
            disabled={state === "sending"}
            className="w-full rounded-lg bg-amber-700 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            {state === "sending" ? "Sending..." : "Send request"}
          </button>
          {state === "error" && <p className="text-red-600">Something went wrong. Please try again.</p>}
        </form>
      )}
    </div>
  );
}
