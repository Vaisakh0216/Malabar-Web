// Stand-in for product and banner photos until boutique shoots are done.
export default function Swatch({
  palette,
  label,
  className = "",
}: {
  palette: [string, string];
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-end overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[0]} 55%, ${palette[1]} 100%)` }}
    >
      <div className="absolute inset-x-0 bottom-6 h-2" style={{ background: palette[1], opacity: 0.85 }} />
      {label && <span className="relative m-3 text-xs font-medium text-black/60">{label}</span>}
    </div>
  );
}
