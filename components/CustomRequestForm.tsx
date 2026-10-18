"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScissorsIcon } from "./Icons";

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

  const field = "w-full rounded-xl border border-linen bg-white px-3.5 py-2.5 outline-none transition focus:border-ink";

  if (state === "sent") {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-gold-soft/60 p-5 text-sm">
        <p className="font-semibold">Request {requestId} received</p>
        <p className="mt-1 text-ink/70">
          The boutique will send you a price and delivery date on WhatsApp. Customised orders are confirmed once paid
          online; cash on delivery is not available for them.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gold/40 bg-gold-soft/30">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-4 text-left text-sm"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-gold">
          <ScissorsIcon className="h-[18px] w-[18px]" />
        </span>
        <span className="flex-1">
          <span className="block font-semibold">Want it customised? Request a custom design</span>
          <span className="block text-xs text-muted">Change the colour, border, sleeve or fit. Prepaid only.</span>
        </span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-xl leading-none text-muted">
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.form
            onSubmit={submit}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3 px-4 text-sm"
          >
            <input name="name" required placeholder="Your name" className={field} />
            <input name="phone" required pattern="[0-9]{10}" placeholder="WhatsApp number (10 digits)" className={field} />
            <textarea name="measurements" rows={2} placeholder="Measurements (bust, waist, length) or 'measure me at home'" className={field} />
            <textarea
              name="notes"
              rows={3}
              required
              placeholder="What would you like changed? Colour, border, sleeve, blouse design..."
              className={field}
            />
            <p className="text-xs text-muted">Customised orders are prepaid only and cannot be returned.</p>
            <button disabled={state === "sending"} className="mb-4 w-full rounded-full bg-ink py-3 font-semibold text-ivory disabled:opacity-50">
              {state === "sending" ? "Sending..." : "Send request"}
            </button>
            {state === "error" && <p className="pb-4 text-maroon">Something went wrong. Please try again.</p>}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
