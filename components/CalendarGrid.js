"use client";

import { getMoonPhase } from "@/lib/moon";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateStr(y, m, d) {
  const mm = String(m + 1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

export default function CalendarGrid({ monthDate, signups, selectedDate, onSelectDate }) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay.getDay();
  const todayStr = new Date().toISOString().slice(0, 10);

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center font-data text-[11px] text-text-dim">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2">{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`empty-${i}`} />;
          const dateStr = toDateStr(year, month, d);
          const dayDate = new Date(year, month, d);
          const { emoji } = getMoonPhase(dayDate);
          const count = (signups[dateStr] || []).length;
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg border p-1 text-xs transition-colors ${
                isSelected
                  ? "border-amber bg-amber-dim/20"
                  : isToday
                  ? "border-navy/50 bg-panel-light"
                  : "border-line bg-panel hover:border-amber/40"
              }`}
            >
              <span className="font-data text-text">{d}</span>
              <span className="text-sm leading-none">{emoji}</span>
              {count > 0 && (
                <span className="rounded-full bg-navy-dim/30 px-1.5 text-[10px] text-navy">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
