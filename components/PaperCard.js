export default function PaperCard({ paper }) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-5">
      <p className="font-data text-xs text-text-dim">{paper.year} · {paper.venue}</p>
      <h3 className="mt-1 font-display text-lg text-text">{paper.title}</h3>
      <p className="mt-1 text-sm text-text-dim">{paper.authors}</p>
      <a
        href={paper.url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-amber hover:underline"
      >
        View / download PDF &rarr;
      </a>
    </div>
  );
}
