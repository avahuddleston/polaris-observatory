const COLORS = {
  "Lick Observing": "border-amber/40 text-amber bg-amber-dim/10",
  "Polaris Observing": "border-navy/40 text-navy bg-navy-dim/20",
  "Data Reduction": "border-text-dim/40 text-text-dim bg-panel-light",
};

export default function QualBadge({ label }) {
  const cls = COLORS[label] || "border-line text-text-dim bg-panel-light";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cls}`}
    >
      {label}
    </span>
  );
}
