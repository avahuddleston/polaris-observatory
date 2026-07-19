import { supabase } from "@/lib/supabaseClient";

const BUCKET = "polaris-files";

// Uploads a file into a folder (e.g. "avatars", "resumes", "papers", "photos")
// and returns its public URL.
export async function uploadFile(file, folder) {
  if (!file) return { error: new Error("No file provided") };

  const ext = file.name.split(".").pop();
  const safeName = `${crypto.randomUUID()}.${ext}`;
  const path = `${folder}/${safeName}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);
  if (uploadError) return { error: uploadError };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
