// Builds a "Add to Google Calendar" link using Google's public template URL.
// This requires no API key, no OAuth, and no backend - it just opens
// Google Calendar's pre-filled event screen for the user to save.
// (A full OAuth integration is possible later for automatic two-way sync -
// see the README for that upgrade path.)
export function buildGoogleCalendarUrl({ title, dateStr, details, location }) {
  // Observing nights are treated as an all-day-ish evening block, 7pm-1am local.
  const start = new Date(`${dateStr}T19:00:00`);
  const end = new Date(`${dateStr}T23:59:00`);

  const fmt = (d) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: details || "",
    location: location || "Polaris Observatory",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
