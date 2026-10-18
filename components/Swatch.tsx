// Product and banner visual. Shows the boutique photo when one is set, otherwise a woven-textile
// placeholder in the product's colours with a kasavu-style border.
export default function Swatch({
  palette,
  label,
  image,
  alt = "",
  monogram,
  className = "",
}: {
  palette: [string, string];
  label?: string;
  image?: string;
  alt?: string;
  monogram?: string;
  className?: string;
}) {
  if (image) {
    return (
      <div className={`relative overflow-hidden bg-sand ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      </div>
    );
  }
  const [base, accent] = palette;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: base,
        backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 7px),
          repeating-linear-gradient(-45deg, rgba(0,0,0,0.035) 0 2px, transparent 2px 7px),
          radial-gradient(120% 90% at 85% 15%, rgba(255,255,255,0.55), transparent 60%),
          linear-gradient(160deg, ${base} 30%, ${accent}33 100%)`,
      }}
    >
      {monogram && (
        <span
          className="absolute inset-0 flex items-center justify-center font-display text-[min(28vw,7rem)] leading-none opacity-20 select-none"
          style={{ color: accent }}
        >
          {monogram}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-[12%] space-y-[3px]">
        <div className="h-[6px]" style={{ background: accent, opacity: 0.85 }} />
        <div className="h-px" style={{ background: accent, opacity: 0.6 }} />
      </div>
      {label && (
        <span className="absolute left-3 top-3 rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-ink/70 uppercase backdrop-blur">
          {label}
        </span>
      )}
    </div>
  );
}
