import { getMoonPhase } from "@/lib/moon";

export default function MoonPhaseIcon({ date, size = "text-2xl", showLabel = true }) {
  const { emoji, name, fraction } = getMoonPhase(date);

  return (
    <div className="flex items-center gap-2">
      <span className={size} title={name} aria-hidden>
        {emoji}
      </span>
      {showLabel && (
        <span className="font-data text-xs text-text-dim">
          {name} · {fraction}%
        </span>
      )}
    </div>
  );
}
