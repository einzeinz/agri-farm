import { SUPABASE_KEY, SUPABASE_URL, getSupabaseAccessToken, isSupabaseConfigured } from "./supabaseClient";

export { isSupabaseConfigured } from "./supabaseClient";

export async function supabaseRequest(path, options = {}) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const accessToken = await getSupabaseAccessToken();

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken || SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed with ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}
