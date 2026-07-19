"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/lib/upload";

export default function AddPaperForm() {
  const { addPaper } = useData();
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("upload"); // "upload" | "link"
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    authors: "",
    year: new Date().getFullYear(),
    venue: "",
    url: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title) {
      setError("Please add a title.");
      return;
    }

    let finalUrl = form.url;

    if (mode === "upload") {
      if (!file) {
        setError("Please choose a PDF, or switch to \u201cLink to paper\u201d.");
        return;
      }
      setUploading(true);
      const { url, error: uploadError } = await uploadFile(file, "papers");
      setUploading(false);
      if (uploadError) {
        setError(uploadError.message);
        return;
      }
      finalUrl = url;
    } else if (!form.url) {
      setError("Please paste a link, or switch to \u201cUpload PDF\u201d.");
      return;
    }

    await addPaper({ ...form, url: finalUrl, addedBy: currentUser?.id });
    setForm({ title: "", authors: "", year: new Date().getFullYear(), venue: "", url: "" });
    setFile(null);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border border-amber/50 bg-amber-dim/20 px-4 py-2 text-sm font-medium text-amber hover:bg-amber-dim/40 transition-colors"
      >
        + Add a paper
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border border-line bg-panel p-5 sm:grid-cols-2"
    >
      <input
        required
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="sm:col-span-2 rounded-lg border border-line bg-panel-light px-3 py-2 text-sm outline-none focus:border-amber"
      />
      <input
        placeholder="Authors (e.g. M. Chen, S. Okafor)"
        value={form.authors}
        onChange={(e) => setForm({ ...form, authors: e.target.value })}
        className="rounded-lg border border-line bg-panel-light px-3 py-2 text-sm outline-none focus:border-amber"
      />
      <input
        placeholder="Venue / journal"
        value={form.venue}
        onChange={(e) => setForm({ ...form, venue: e.target.value })}
        className="rounded-lg border border-line bg-panel-light px-3 py-2 text-sm outline-none focus:border-amber"
      />
      <input
        type="number"
        placeholder="Year"
        value={form.year}
        onChange={(e) => setForm({ ...form, year: e.target.value })}
        className="rounded-lg border border-line bg-panel-light px-3 py-2 text-sm outline-none focus:border-amber"
      />

      <div className="sm:col-span-2 flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`rounded-full px-3 py-1 ${mode === "upload" ? "bg-amber text-night" : "border border-line text-text-dim"}`}
        >
          Upload PDF
        </button>
        <button
          type="button"
          onClick={() => setMode("link")}
          className={`rounded-full px-3 py-1 ${mode === "link" ? "bg-amber text-night" : "border border-line text-text-dim"}`}
        >
          Link to paper
        </button>
      </div>

      {mode === "upload" ? (
        <label className="sm:col-span-2 text-xs text-text-dim">
          PDF file
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 w-full rounded-lg border border-line bg-panel-light px-3 py-2 text-sm text-text file:mr-3 file:rounded-full file:border-0 file:bg-amber file:px-3 file:py-1 file:text-xs file:font-medium file:text-night"
          />
        </label>
      ) : (
        <input
          placeholder="https://..."
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="sm:col-span-2 rounded-lg border border-line bg-panel-light px-3 py-2 text-sm outline-none focus:border-amber"
        />
      )}

      {error && <p className="sm:col-span-2 text-sm text-rose">{error}</p>}

      <div className="sm:col-span-2 flex gap-2">
        <button
          type="submit"
          disabled={uploading}
          className="rounded-full bg-amber px-4 py-2 text-sm font-medium text-night hover:opacity-90 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Publish to list"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-line px-4 py-2 text-sm text-text-dim hover:text-text"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
