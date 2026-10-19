"use client";

import { useEffect, useRef, useState } from "react";

// Photo that fades in once loaded and removes itself if it fails, leaving the woven placeholder
// underneath visible. Server-rendered images can finish before hydration, so the effect checks too.
export default function SwatchImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"loading" | "loaded" | "failed">("loading");

  useEffect(() => {
    const img = ref.current;
    if (img?.complete) setState(img.naturalWidth ? "loaded" : "failed");
  }, [src]);

  if (state === "failed") return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setState("loaded")}
      onError={() => setState("failed")}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${state === "loaded" ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}
