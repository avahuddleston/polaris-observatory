import Link from "next/link";

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/projects" className="text-sm text-amber hover:underline">
        &larr; Projects
      </Link>
      <h1 className="mt-4 font-display text-3xl text-text">Research</h1>
      <p className="mt-4 text-text-dim">
        Details on ongoing scientific projects and analysis will go here.
      </p>
    </div>
  );
}
