"use client";

import { use, useState } from "react";
import Image from "next/image";
import QualBadge from "@/components/QualBadge";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { uploadFile } from "@/lib/upload";

const KNOWN_QUALS = ["Lick Observing", "Polaris Observing", "Data Reduction"];

export default function ProfilePage({ params }) {
  const { id } = use(params);
  const { currentUser, ready, refreshProfile } = useAuth();
  const { profiles, loading, updateProfile } = useData();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const student = profiles.find((s) => s.id === id);
  const isOwner = ready && currentUser?.id === id;
  const canSeeContactInfo = ready && !!currentUser;

  if (loading) {
    return <div className="mx-auto max-w-3xl px-6 py-16 text-text-dim">Loading...</div>;
  }
  if (!student) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-text-dim">
        No profile found for this account yet.
      </div>
    );
  }

  const startEditing = () => {
    setForm({
      photo: student.photo || "",
      resumeUrl: student.resumeUrl || "",
      bio: student.bio || "",
      qualifications: student.qualifications || [],
      classes: (student.classes || []).join(", "),
    });
    setEditing(true);
  };

  const toggleQual = (q) => {
    setForm((f) => ({
      ...f,
      qualifications: f.qualifications.includes(q)
        ? f.qualifications.filter((x) => x !== q)
        : [...f.qualifications, q],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploadError("");
    setSaving(true);

    let photoUrl = form.photo;
    let resumeUrl = form.resumeUrl;

    if (avatarFile) {
      const { url, error } = await uploadFile(avatarFile, "avatars");
      if (error) {
        setUploadError(error.message);
        setSaving(false);
        return;
      }
      photoUrl = url;
    }

    if (resumeFile) {
      const { url, error } = await uploadFile(resumeFile, "resumes");
      if (error) {
        setUploadError(error.message);
        setSaving(false);
        return;
      }
      resumeUrl = url;
    }

    await updateProfile(student.id, {
      photo_url: photoUrl,
      resume_url: resumeUrl,
      bio: form.bio,
      qualifications: form.qualifications,
      classes: form.classes.split(",").map((c) => c.trim()).filter(Boolean),
    });
    await refreshProfile();
    setSaving(false);
    setAvatarFile(null);
    setResumeFile(null);
    setEditing(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-panel-light">
          {student.photo ? (
            <Image src={student.photo} alt={student.name} fill sizes="112px" className="object-cover" />
          ) : (
            <span className="font-display text-3xl text-text-dim">{student.name?.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <h1 className="font-display text-3xl text-text">{student.name}</h1>
            {isOwner && !editing && (
              <button
                onClick={startEditing}
                className="rounded-full border border-line px-3 py-1 text-xs text-text-dim hover:border-amber hover:text-amber"
              >
                Edit profile
              </button>
            )}
          </div>
          <p className="mt-1 text-text-dim">{student.year} &middot; {student.major}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:justify-start">
            {student.qualifications.map((q) => (
              <QualBadge key={q} label={q} />
            ))}
          </div>
        </div>
      </div>

      {student.bio && !editing && <p className="mt-8 text-text-dim">{student.bio}</p>}

      {editing && form && (
        <form onSubmit={handleSave} className="mt-8 grid gap-3 rounded-2xl border border-amber/30 bg-panel p-5">
          <label className="text-xs text-text-dim">
            Bio
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={2}
              className="mt-1 w-full rounded-lg border border-line bg-panel-light px-3 py-2 text-sm text-text outline-none focus:border-amber"
            />
          </label>
          <label className="text-xs text-text-dim">
            Profile photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="mt-1 w-full rounded-lg border border-line bg-panel-light px-3 py-2 text-sm text-text file:mr-3 file:rounded-full file:border-0 file:bg-amber file:px-3 file:py-1 file:text-xs file:font-medium file:text-night"
            />
            {form.photo && !avatarFile && (
              <span className="mt-1 block text-[11px] text-text-dim">Current photo on file. Choose a new one to replace it.</span>
            )}
          </label>
          <label className="text-xs text-text-dim">
            Resume (PDF)
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="mt-1 w-full rounded-lg border border-line bg-panel-light px-3 py-2 text-sm text-text file:mr-3 file:rounded-full file:border-0 file:bg-amber file:px-3 file:py-1 file:text-xs file:font-medium file:text-night"
            />
            {form.resumeUrl && !resumeFile && (
              <span className="mt-1 block text-[11px] text-text-dim">Current resume on file. Choose a new one to replace it.</span>
            )}
          </label>
          {uploadError && <p className="text-sm text-rose">{uploadError}</p>}
          <div className="text-xs text-text-dim">
            Qualifications
            <div className="mt-1 flex flex-wrap gap-2">
              {KNOWN_QUALS.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => toggleQual(q)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    form.qualifications.includes(q)
                      ? "border-amber bg-amber-dim/20 text-amber"
                      : "border-line text-text-dim"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <label className="text-xs text-text-dim">
            Classes taken (comma-separated)
            <input
              value={form.classes}
              onChange={(e) => setForm({ ...form, classes: e.target.value })}
              className="mt-1 w-full rounded-lg border border-line bg-panel-light px-3 py-2 text-sm text-text outline-none focus:border-amber"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-amber px-4 py-2 text-sm font-medium text-night hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full border border-line px-4 py-2 text-sm text-text-dim hover:text-text"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-panel p-5">
          <h2 className="font-display text-sm text-text">Classes taken</h2>
          {student.classes.length > 0 ? (
            <ul className="mt-3 space-y-1.5 text-sm text-text-dim">
              {student.classes.map((c) => (
                <li key={c}>&middot; {c}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-text-dim">None listed yet.</p>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-panel p-5">
          <h2 className="font-display text-sm text-text">Contact &amp; resume</h2>
          {canSeeContactInfo ? (
            <div className="mt-3 space-y-1.5 font-data text-sm text-text-dim">
              <p>{student.email}</p>
              <p>{student.phone || "No phone on file"}</p>
              {student.resumeUrl ? (
                <a
                  href={student.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-amber hover:underline"
                >
                  View resume &rarr;
                </a>
              ) : (
                <p className="mt-2 text-text-dim">No resume linked yet.</p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-text-dim">
              <a href="/login" className="text-amber hover:underline">Log in</a> to view contact info and resume.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
