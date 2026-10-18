"use client";

import { useEffect, useState } from "react";
import { formatDuration, minutesToCutoff, RETURN_WINDOW_HOURS, FREE_DELIVERY_ABOVE, formatINR } from "@/lib/config";

export default function AnnouncementBar() {
  const [left, setLeft] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    const tick = () => setLeft(minutesToCutoff());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const cutoff =
    left === undefined
      ? "Same-day delivery across Kozhikode"
      : left
        ? `Order in ${formatDuration(left)} for delivery today`
        : "Order now for delivery tomorrow by 1 pm";

  const messages = [
    cutoff,
    `Free delivery above ${formatINR(FREE_DELIVERY_ABOVE)}`,
    `Easy ${RETURN_WINDOW_HOURS}-hour returns`,
    "Cash on delivery available",
    "Custom designs from Calicut's boutiques",
  ];

  return (
    <div className="overflow-hidden bg-ink text-[11px] font-medium tracking-wide text-ivory/90 sm:text-xs">
      <div className="flex w-max animate-marquee gap-10 py-2 hover:[animation-play-state:paused]">
        {[...messages, ...messages].map((m, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            {m}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
