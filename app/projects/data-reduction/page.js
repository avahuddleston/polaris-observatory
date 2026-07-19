import Link from "next/link";

export default function DataReductionPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/projects" className="text-sm text-amber hover:underline">
        &larr; Projects
      </Link>
      <h1 className="mt-4 font-display text-3xl text-text">Data Reduction</h1>
      <p className="mt-4 text-text-dim">
        Details on the group&apos;s data reduction pipeline and ongoing
        processing work will go here.
      </p>
    </div>
  );
}
