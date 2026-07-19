"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/lib/upload";

export default function AddPhotoForm() {
  const { addPhoto } = useData();
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    caption: "",
    author: currentUser?.name || "",
    date: new Date().toISOString().slice(0, 10),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file || !form.caption) {
      setError("Please choose a photo and add a caption.");
      return;
    }

    setUploading(true);
    const { url, error: uploadError } = await uploadFile(file, "photos");
    setUploading(false);

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    await addPhoto({ ...form, url });
    setForm({ caption: "", author: currentUser?.name || "", date: new Date().toISOString().slice(0, 10) });
    setFile(null);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border border-amber/50 bg-amber-dim/20 px-4 py-2 text-sm font-medium text-amber hover:bg-amber-dim/40 transition-colors"
      >
        + Add a photo
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border border-line bg-panel p-5 sm:grid-cols-2"
    >
      <label className="sm:col-span-2 text-xs text-text-dim">
        Photo file
        <input
          required
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1 w-full rounded-lg border border-line bg-panel-light px-3 py-2 text-sm text-text file:mr-3 file:rounded-full file:border-0 file:bg-amber file:px-3 file:py-1 file:text-xs file:font-medium file:text-night"
        />
      </label>
      <input
        required
        placeholder="Caption"
        value={form.caption}
        onChange={(e) => setForm({ ...form, caption: e.target.value })}
        className="sm:col-span-2 rounded-lg border border-line bg-panel-light px-3 py-2 text-sm outline-none focus:border-amber"
      />
      <input
        placeholder="Author"
        value={form.author}
        onChange={(e) => setForm({ ...form, author: e.target.value })}
        className="rounded-lg border border-line bg-panel-light px-3 py-2 text-sm outline-none focus:border-amber"
      />
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="rounded-lg border border-line bg-panel-light px-3 py-2 text-sm outline-none focus:border-amber"
      />

      {error && <p className="sm:col-span-2 text-sm text-rose">{error}</p>}

      <div className="sm:col-span-2 flex gap-2">
        <button
          type="submit"
          disabled={uploading}
          className="rounded-full bg-amber px-4 py-2 text-sm font-medium text-night hover:opacity-90 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Add photo"}
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
