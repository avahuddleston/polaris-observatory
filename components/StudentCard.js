import Link from "next/link";
import Image from "next/image";
import QualBadge from "./QualBadge";

export default function StudentCard({ student }) {
  return (
    <Link
      href={`/profile/${student.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-colors hover:border-amber/50"
    >
      <div className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-panel-light">
        {student.photo ? (
          <Image
            src={student.photo}
            alt={student.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="font-display text-3xl text-text-dim">
            {student.name?.charAt(0) || "?"}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="font-display text-base text-text">{student.name}</h3>
          <p className="text-xs text-text-dim">
            {student.year} · {student.major}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {student.qualifications.map((q) => (
            <QualBadge key={q} label={q} />
          ))}
        </div>
      </div>
    </Link>
  );
}
