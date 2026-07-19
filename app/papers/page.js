"use client";

import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import PaperCard from "@/components/PaperCard";
import AddPaperForm from "@/components/AddPaperForm";

export default function PapersPage() {
  const { currentUser } = useAuth();
  const { papers } = useData();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-text">Publications</h1>
          <p className="mt-2 text-text-dim">
            Papers published by the Polaris Observatory group.
          </p>
        </div>
        {currentUser ? (
          <AddPaperForm />
        ) : (
          <p className="text-xs text-text-dim">
            <a href="/login" className="text-amber hover:underline">Log in</a> to add a paper
          </p>
        )}
      </div>

      <div className="grid gap-4">
        {papers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
    </div>
  );
}
