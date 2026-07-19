import Image from "next/image";

export default function PhotoCard({ photo }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="relative h-64 w-full">
        <Image
          src={photo.url}
          alt={photo.caption}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <figcaption className="p-4">
        <p className="text-sm text-text">{photo.caption}</p>
        <p className="mt-1 font-data text-xs text-text-dim">
          {photo.author} · {photo.date}
        </p>
      </figcaption>
    </figure>
  );
}
