"use client";

import Image from "next/image";
import Link from "next/link";
import StudentCard from "@/components/StudentCard";
import MoonPhaseIcon from "@/components/MoonPhaseIcon";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";

const HERO_PHOTO =
  "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=1400&h=900&fit=crop";
const SITE_PHOTOS = [
  "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=600&fit=crop",
];

function getNextObservingNight(signups) {
  const today = new Date().toISOString().slice(0, 10);
  const dates = Object.keys(signups).sort();
  return dates.find((d) => d >= today) || null;
}

export default function HomePage() {
  const { currentUser } = useAuth();
  const { profiles, photos, signups, loading } = useData();
  const today = new Date();
  const nextNight = getNextObservingNight(signups);
  const galleryPhotos = photos.length > 0 ? photos.slice(0, 3) : null;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line/60">
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-data text-xs uppercase tracking-[0.2em] text-amber">
              34.82&deg; N, 118.95&deg; W &middot; Elev. 4,639 ft (1,414 m) &middot; Frazier Park, CA
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-text md:text-5xl">
              Polaris Observatory
            </h1>
            <p className="mt-4 max-w-md text-text-dim">
              Polaris Observatory is a UCLA undergraduate research group
              conducting observational astronomy from our site in Frazier
              Park, California. Explore our current members, published
              work, and photos from the observatory below.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/papers"
                className="rounded-full bg-amber px-5 py-2.5 text-sm font-medium text-night hover:opacity-90"
              >
                Read our papers
              </Link>
              <Link
                href="/astrophotography"
                className="rounded-full border border-line px-5 py-2.5 text-sm text-text hover:border-amber/50"
              >
                Browse the gallery
              </Link>
            </div>
          </div>

          <div className="relative h-72 w-full overflow-hidden rounded-3xl border border-line md:h-96">
            <Image
              src="/images/star-trails-dome.jpg"
              alt="Star trails over the Polaris Observatory dome"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-[center_75%]"
              priority
            />
          </div>
        </div>

        {/* Signature element: Tonight's Sky strip */}
        <div className="border-t border-line/60 bg-panel/60">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-3">
              <MoonPhaseIcon date={today} />
              <span className="hidden text-text-dim sm:inline">tonight over Polaris</span>
            </div>
            {currentUser && nextNight && (
              <div className="flex items-center gap-2 font-data text-xs text-text-dim">
                <span>Next observing night:</span>
                <span className="text-navy">{nextNight}</span>
                <MoonPhaseIcon date={new Date(nextNight)} size="text-base" showLabel={false} />
              </div>
            )}
            {!currentUser && (
              <Link href="/login" className="font-data text-xs text-amber hover:underline">
                Log in to see the observing schedule &rarr;
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* About the site */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="font-display text-2xl text-text">About the site</h2>
            <p className="mt-3 text-text-dim">
              Located above Frazier Park, California, at an elevation of
              4,639 feet, Polaris Observatory operates three telescopes: two
              18-inch and one 28-inch Centurion prime-focus instruments. Our
              group consists of UCLA undergraduate students trained in
              observational techniques at both Polaris and Lick Observatory.
              The data collected supports our group&apos;s published
              research, which can be found below.
            </p>
            <p className="mt-3 text-text-dim">
              Independent observing requires training and certification. The
              certifications of each member are listed in their profiles
              below. If you are interested in joining our group, check out
              our{" "}
              <Link href="/projects" className="text-amber hover:underline">
                current projects
              </Link>{" "}
              and contact{" "}
              <a href="mailto:rmr@astro.ucla.edu" className="text-amber hover:underline">
                Dr. Michael Rich
              </a>
              .
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-panel p-5">
            <h3 className="font-display text-sm text-text">Site facts</h3>
            <dl className="mt-3 space-y-2 font-data text-xs text-text-dim">
              <div className="flex justify-between"><dt>Location</dt><dd className="text-text">Frazier Park, CA</dd></div>
              <div className="flex justify-between"><dt>Elevation</dt><dd className="text-text">4,639 ft</dd></div>
              <div className="flex justify-between"><dt>Telescopes</dt><dd className="text-text">2&times; 18in, 1&times; 28in</dd></div>
              <div className="flex justify-between"><dt>Active students</dt><dd className="text-text">{profiles.length}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* Site photos */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-text">The site</h2>
          <Link href="/astrophotography" className="text-sm text-amber hover:underline">
            Full gallery &rarr;
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {(galleryPhotos || SITE_PHOTOS.map((url) => ({ id: url, url, caption: "" }))).map((p) => (
            <div key={p.id} className="relative h-48 overflow-hidden rounded-2xl border border-line">
              <Image src={p.url} alt={p.caption || "Observatory"} fill sizes="33vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Student previews */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-text">The group</h2>
          <p className="text-sm text-text-dim">Click a profile to see more</p>
        </div>
        {loading ? (
          <p className="text-sm text-text-dim">Loading...</p>
        ) : profiles.length === 0 ? (
          <p className="text-sm text-text-dim">
            No profiles yet &mdash; <Link href="/login" className="text-amber hover:underline">sign up</Link> to be the first.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {profiles.map((s) => (
              <StudentCard key={s.id} student={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
