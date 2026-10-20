"use client";

import { useRef } from "react";
import { ArrowIcon } from "./Icons";

// Horizontal, swipeable row of cards with arrow buttons on desktop.
export default function Rail({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className="group/rail relative">
      <div ref={ref} aria-label={label} className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto scroll-smooth px-4 pb-2 md:mx-0 md:scroll-px-0 md:px-0">
        {children}
      </div>
      {[-1, 1].map((dir) => (
        <button
          key={dir}
          type="button"
          aria-label={dir < 0 ? "Scroll back" : "Scroll forward"}
          onClick={() => scroll(dir)}
          className={`absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-linen transition hover:bg-ink hover:text-ivory md:flex ${
            dir < 0 ? "-left-4" : "-right-4"
          } opacity-0 group-hover/rail:opacity-100`}
        >
          <ArrowIcon className={`h-4 w-4 ${dir < 0 ? "rotate-180" : ""}`} />
        </button>
      ))}
    </div>
  );
}
