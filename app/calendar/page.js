"use client";

import { useState } from "react";
import Link from "next/link";
import CalendarGrid from "@/components/CalendarGrid";
import MoonPhaseIcon from "@/components/MoonPhaseIcon";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { buildGoogleCalendarUrl } from "@/lib/googleCalendar";

export default function CalendarPage() {
  const { currentUser, ready } = useAuth();
  const { profiles, signups, signUpForNight, cancelNight } = useData();

  const studentById = (id) => profiles.find((s) => s.id === id);
  const [monthDate, setMonthDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  if (ready && !currentUser) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-text">Members only</h1>
        <p className="mt-3 text-text-dim">
          The observing night calendar is only visible to logged-in group
          members.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-full bg-amber px-5 py-2.5 text-sm font-medium text-night hover:opacity-90"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (!ready) return null;

  const signedUpIds = signups[selectedDate] || [];
  const iAmSignedUp = signedUpIds.includes(currentUser.id);

  const changeMonth = (delta) => {
    setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + delta, 1));
  };

  const handleSignUp = () => signUpForNight(selectedDate, currentUser.id);
  const handleCancel = () => cancelNight(selectedDate, currentUser.id);

  const gcalUrl = buildGoogleCalendarUrl({
    title: "Polaris Observatory - Observing Night",
    dateStr: selectedDate,
    details: `Observing night signup for ${currentUser.name}.`,
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-3xl text-text">Observing Nights</h1>
      <p className="mt-2 text-text-dim">
        Sign up for a night, see who else is on the schedule, and check the
        moon phase before you commit.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => changeMonth(-1)} className="rounded-full border border-line px-3 py-1 text-sm text-text-dim hover:text-text">&larr;</button>
            <h2 className="font-display text-lg text-text">
              {monthDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </h2>
            <button onClick={() => changeMonth(1)} className="rounded-full border border-line px-3 py-1 text-sm text-text-dim hover:text-text">&rarr;</button>
          </div>
          <CalendarGrid
            monthDate={monthDate}
            signups={signups}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        <div className="rounded-2xl border border-line bg-panel p-5">
          <p className="font-data text-xs text-text-dim">{selectedDate}</p>
          <div className="mt-2">
            <MoonPhaseIcon date={new Date(selectedDate)} />
          </div>

          <h3 className="mt-5 font-display text-sm text-text">Signed up</h3>
          <ul className="mt-2 space-y-2">
            {signedUpIds.length === 0 && (
              <li className="text-sm text-text-dim">No one yet &mdash; be the first.</li>
            )}
            {signedUpIds.map((id) => {
              const s = studentById(id);
              if (!s) return null;
              const expanded = expandedStudentId === id;
              return (
                <li key={id} className="rounded-lg border border-line bg-panel-light p-2.5">
                  <button
                    onClick={() => setExpandedStudentId(expanded ? null : id)}
                    className="flex w-full items-center justify-between text-left text-sm text-text hover:text-amber"
                  >
                    {s.name}
                    <span className="text-xs text-text-dim">{expanded ? "hide" : "info"}</span>
                  </button>
                  {expanded && (
                    <div className="mt-2 space-y-1 font-data text-xs text-text-dim">
                      <p>{s.email}</p>
                      <p>{s.phone}</p>
                      <Link href={`/profile/${s.id}`} className="text-amber hover:underline">
                        Full profile &rarr;
                      </Link>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex flex-col gap-2">
            {!iAmSignedUp ? (
              <button
                onClick={handleSignUp}
                className="rounded-full bg-amber px-4 py-2 text-sm font-medium text-night hover:opacity-90"
              >
                Sign up for this night
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="rounded-full border border-rose/50 px-4 py-2 text-sm text-rose hover:bg-rose/10"
                >
                  Cancel my signup
                </button>
                <a
                  href={gcalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-navy/50 px-4 py-2 text-center text-sm text-navy hover:bg-navy-dim/20"
                >
                  Add to Google Calendar
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
