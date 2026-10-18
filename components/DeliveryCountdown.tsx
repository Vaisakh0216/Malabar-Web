"use client";

import { useEffect, useState } from "react";
import { formatDuration, minutesToCutoff } from "@/lib/config";
import { TruckIcon } from "./Icons";

export default function DeliveryCountdown({ fallback }: { fallback: string }) {
  const [left, setLeft] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    const tick = () => setLeft(minutesToCutoff());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-leaf/10 p-4 text-sm">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf text-ivory">
        <TruckIcon />
      </span>
      <div>
        <p className="font-semibold text-leaf">{left ? "Delivered today by 9 pm" : fallback}</p>
        <p className="text-xs text-ink/60">
          {left ? (
            <>
              Order in <span className="font-semibold tabular-nums text-ink">{formatDuration(left)}</span> · within Kozhikode city
            </>
          ) : (
            "Within Kozhikode city"
          )}
        </p>
      </div>
    </div>
  );
}
