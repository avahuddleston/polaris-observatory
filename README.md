# Polaris Observatory — Prototype

A working prototype of the research group site: public home page, papers,
photo gallery, and a private observing-night calendar with moon phases.
All data is mock data, and "logging in" just picks a student from a list —
nothing here is a real account yet. The point of this build is to nail down
the pages, layout, and interactions before wiring up a real backend.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Click **Log in** in the nav and pick any
student to see the logged-in experience (private calendar, add-paper/photo
forms, contact info on profiles).

Data you add (papers, photos, calendar signups) is saved to your browser's
localStorage, so it persists across reloads but is only visible to you, on
this device. That's a stand-in for a real database — see below.

## What's mocked vs. real

| Feature | In this prototype | In production |
|---|---|---|
| Accounts / login | Pick a student from a list, stored in localStorage | Real accounts via Supabase Auth (email/password or Google sign-in) |
| Student profiles, papers, photos | Static JSON in `/data`, edits saved to localStorage | Rows in a Supabase Postgres database |
| Profile pictures, resumes, paper PDFs, gallery photos | Plain URLs (Unsplash placeholders / example links) | Uploaded files in Supabase Storage, with a real `<input type="file">` |
| Observing night calendar | In-memory signups per date | A `signups` table (date, student_id) in Postgres |
| "Add to Google Calendar" | A pre-filled Google Calendar link (no login required) — this already works for real today | Optionally upgrade to full OAuth for automatic two-way sync (see below) |
| Moon phase | Real calculation via the `suncalc` npm package | Same — no change needed |

## Upgrading to a real backend (recommended: Supabase)

1. **Create a free Supabase project** (supabase.com). It gives you Postgres,
   auth, and file storage together, and has a generous free tier that will
   comfortably cover a small research group.
2. **Auth**: turn on email/password and/or Google sign-in in Supabase Auth.
   Replace `context/AuthContext.js`'s localStorage logic with Supabase's
   `supabase.auth.signInWithPassword` / `signInWithOAuth`, and gate pages
   using their session instead of the mock `currentUser`.
3. **Database**: create tables for `students`, `papers`, `photos`, and
   `signups` mirroring the shapes in `/data/*.json`. Replace the JSON
   imports and the localStorage read/writes in `context/DataContext.js`
   with Supabase queries (`supabase.from("papers").select()`, `.insert()`,
   etc.).
4. **File uploads**: use Supabase Storage buckets for profile pictures,
   resumes, paper PDFs, and gallery photos. Swap the "Image URL" / "Link to
   PDF" text inputs in `AddPaperForm.js` / `AddPhotoForm.js` for real file
   inputs that upload to a bucket and store the resulting URL.
5. **Deploy**: push this repo to GitHub and import it into Vercel — it
   auto-detects Next.js, and you just add your Supabase URL/key as
   environment variables.

## Google Calendar

The "Add to Google Calendar" button already works without any setup — it
uses Google's public "add event" link format
(`calendar.google.com/calendar/render?action=TEMPLATE&...`), which opens a
pre-filled event for the student to save with one click. No API key, no
OAuth consent screen, no backend.

If you eventually want it to happen automatically the moment someone signs
up (rather than one click), that requires:
- Registering an app in Google Cloud Console and requesting Calendar API
  access with OAuth consent (Google reviews apps that request calendar
  write access, which can take some time for a "public" app — for an
  internal research-group tool you can keep it in "Testing" mode with a
  fixed list of allowed Google accounts, which skips review).
- Storing each student's OAuth refresh token (in Supabase) after they
  connect their Google account once.
- Calling the Calendar API server-side (e.g. in a Next.js API route) to
  insert the event whenever a signup happens.

This is a reasonable v2 feature, but the one-click link is the practical
starting point.

## Project structure

```
app/
  page.js                 Public home page
  papers/page.js           Public papers list + add form
  photos/page.js           Public photo gallery + add form
  calendar/page.js         Private observing-night calendar
  login/page.js            Mock login
  profile/[id]/page.js     Student profile (contact info gated to logged-in users)
components/                Reusable UI pieces
context/                    Auth + data state (swap for Supabase later)
data/                        Mock JSON standing in for database tables
lib/moon.js                  Moon phase calculation (suncalc)
lib/googleCalendar.js        "Add to Google Calendar" link builder
```
