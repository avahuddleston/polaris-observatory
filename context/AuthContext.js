"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [ready, setReady] = useState(false);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data || null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchProfile(session?.user?.id).finally(() => setReady(true));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchProfile(session?.user?.id);
    });

    return () => listener.subscription.unsubscribe();
  }, [fetchProfile]);

  // Creates the auth account AND the linked profile row in one step.
  // Creates the auth account. The linked profile row is created automatically
  // by a database trigger (see profile-trigger-setup.sql), using this metadata -
  // this avoids an RLS failure when email confirmation is required, since the
  // client isn't "logged in" yet at the moment of signup.
  const signUp = async ({ email, password, name, year, major, phone }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, year, major, phone } },
    });
    return { error };
  };
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // currentUser matches the shape the rest of the app expects (id, name, email, ...).
  const currentUser = profile
    ? {
        id: profile.id,
        name: profile.name,
        year: profile.year,
        major: profile.major,
        phone: profile.phone,
        email: profile.email,
        photo: profile.photo_url,
        resumeUrl: profile.resume_url,
        bio: profile.bio,
        qualifications: profile.qualifications || [],
        classes: profile.classes || [],
      }
    : null;

  const refreshProfile = () => fetchProfile(session?.user?.id);

  return (
    <AuthContext.Provider
      value={{ currentUser, session, signUp, login, logout, ready, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
