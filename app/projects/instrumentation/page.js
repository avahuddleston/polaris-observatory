import Link from "next/link";

export default function InstrumentationPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/projects" className="text-sm text-amber hover:underline">
        &larr; Projects
      </Link>
      <h1 className="mt-4 font-display text-3xl text-text">Instrumentation</h1>
      <p className="mt-4 text-text-dim">
        Details on telescope, camera, and equipment upgrades and maintenance
        will go here.
      </p>
    </div>
  );
}
