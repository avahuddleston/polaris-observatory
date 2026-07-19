"use client";

import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import PhotoCard from "@/components/PhotoCard";
import AddPhotoForm from "@/components/AddPhotoForm";

export default function AstrophotographyPage() {
  const { currentUser } = useAuth();
  const { photos } = useData();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-text">Astrophotography</h1>
          <p className="mt-2 text-text-dim">
            Photos from the site, submitted by group members.
          </p>
        </div>
        {currentUser ? (
          <AddPhotoForm />
        ) : (
          <p className="text-xs text-text-dim">
            <a href="/login" className="text-amber hover:underline">Log in</a> to add a photo
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    </div>
  );
}
