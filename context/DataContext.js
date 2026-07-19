"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

const DataContext = createContext(null);

function mapProfile(p) {
  return {
    id: p.id,
    name: p.name,
    year: p.year,
    major: p.major,
    phone: p.phone,
    email: p.email,
    photo: p.photo_url,
    resumeUrl: p.resume_url,
    bio: p.bio,
    qualifications: p.qualifications || [],
    classes: p.classes || [],
  };
}

export function DataProvider({ children }) {
  const { session } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [papers, setPapers] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [signups, setSignups] = useState({}); // { "YYYY-MM-DD": [studentId, ...] }
  const [loading, setLoading] = useState(true);

  const refreshProfiles = useCallback(async () => {
    const { data } = await supabase.from("profiles").select("*").order("name");
    setProfiles((data || []).map(mapProfile));
  }, []);

  const refreshPapers = useCallback(async () => {
    const { data } = await supabase
      .from("papers")
      .select("*")
      .order("created_at", { ascending: false });
    setPapers(data || []);
  }, []);

  const refreshPhotos = useCallback(async () => {
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });
    setPhotos(data || []);
  }, []);

  // Signups are only readable when logged in (per RLS policy).
  const refreshSignups = useCallback(async () => {
    if (!session) {
      setSignups({});
      return;
    }
    const { data } = await supabase.from("signups").select("*");
    const grouped = {};
    (data || []).forEach((row) => {
      const key = row.observing_date;
      grouped[key] = grouped[key] || [];
      grouped[key].push(row.student_id);
    });
    setSignups(grouped);
  }, [session]);

  useEffect(() => {
    Promise.all([refreshProfiles(), refreshPapers(), refreshPhotos(), refreshSignups()]).finally(
      () => setLoading(false)
    );
  }, [refreshProfiles, refreshPapers, refreshPhotos, refreshSignups]);

  const addPaper = async (paper) => {
    const { error } = await supabase.from("papers").insert({
      title: paper.title,
      authors: paper.authors,
      year: paper.year ? Number(paper.year) : null,
      venue: paper.venue,
      url: paper.url,
      added_by: paper.addedBy,
    });
    if (!error) await refreshPapers();
    return { error };
  };

  const addPhoto = async (photo) => {
    const { error } = await supabase.from("photos").insert({
      url: photo.url,
      caption: photo.caption,
      author: photo.author,
      photo_date: photo.date,
    });
    if (!error) await refreshPhotos();
    return { error };
  };

  const signUpForNight = async (dateStr, studentId) => {
    const { error } = await supabase
      .from("signups")
      .insert({ observing_date: dateStr, student_id: studentId });
    if (!error) await refreshSignups();
    return { error };
  };

  const cancelNight = async (dateStr, studentId) => {
    const { error } = await supabase
      .from("signups")
      .delete()
      .eq("observing_date", dateStr)
      .eq("student_id", studentId);
    if (!error) await refreshSignups();
    return { error };
  };

  const updateProfile = async (id, fields) => {
    const { error } = await supabase.from("profiles").update(fields).eq("id", id);
    if (!error) await refreshProfiles();
    return { error };
  };

  return (
    <DataContext.Provider
      value={{
        profiles,
        papers,
        photos,
        signups,
        loading,
        addPaper,
        addPhoto,
        signUpForNight,
        cancelNight,
        updateProfile,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
