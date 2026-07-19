"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    year: "",
    major: "",
    phone: "",
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    if (mode === "login") {
      const { error } = await login(form.email, form.password);
      setSubmitting(false);
      if (error) return setError(error.message);
      router.push("/");
    } else {
      const { error } = await signUp(form);
      setSubmitting(false);
      if (error) return setError(error.message);
      setNotice(
        "Account created. If email confirmation is enabled on your Supabase project, check your inbox before logging in."
      );
      setMode("login");
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl text-text">
        {mode === "login" ? "Log in" : "Create your account"}
      </h1>

      <div className="mt-4 flex gap-2 text-sm">
        <button
          onClick={() => setMode("login")}
          className={`rounded-full px-3 py-1 ${mode === "login" ? "bg-amber text-night" : "text-text-dim"}`}
        >
          Log in
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`rounded-full px-3 py-1 ${mode === "signup" ? "bg-amber text-night" : "text-text-dim"}`}
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
        {mode === "signup" && (
          <>
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={update("name")}
              className="rounded-lg border border-line bg-panel-light px-3 py-2 text-sm outline-none focus:border-amber"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Year (e.g. 3rd Year)"
                value={form.year}
                onChange={update("year")}
                className="rounded-lg border border-line bg-panel-light px-3 py-2 text-sm outline-none focus:border-amber"
              />
              <input
                placeholder="Major"
                value={form.major}
                onChange={update("major")}
                className="rounded-lg border border-line bg-panel-light px-3 py-2 text-sm outline-none focus:border-amber"
              />
            </div>
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={update("phone")}
              className="rounded-lg border border-line bg-panel-light px-3 py-2 text-sm outline-none focus:border-amber"
            />
          </>
        )}

        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={update("email")}
          className="rounded-lg border border-line bg-panel-light px-3 py-2 text-sm outline-none focus:border-amber"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={update("password")}
          minLength={6}
          className="rounded-lg border border-line bg-panel-light px-3 py-2 text-sm outline-none focus:border-amber"
        />

        {error && <p className="text-sm text-rose">{error}</p>}
        {notice && <p className="text-sm text-teal">{notice}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-amber px-4 py-2 text-sm font-medium text-night hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "..." : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-xs text-text-dim">
        Qualifications and classes taken can be added afterward from your profile.
      </p>
    </div>
  );
}
