import Link from "next/link";

const PROJECTS = [
  {
    href: "/projects/data-reduction",
    title: "Data Reduction",
    blurb: "Pipeline work and processing of collected observational data.",
  },
  {
    href: "/projects/instrumentation",
    title: "Instrumentation",
    blurb: "Telescope, camera, and equipment upgrades and maintenance.",
  },
  {
    href: "/projects/research",
    title: "Research",
    blurb: "Ongoing scientific projects and analysis.",
  },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-3xl text-text">Projects</h1>
      <p className="mt-2 max-w-2xl text-text-dim">
        What the group is currently working on, organized by area.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-amber/50"
          >
            <h2 className="font-display text-xl text-text">{p.title}</h2>
            <p className="mt-2 text-sm text-text-dim">{p.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
