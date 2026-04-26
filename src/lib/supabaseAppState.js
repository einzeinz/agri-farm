import { isSupabaseConfigured, supabaseRequest } from "./supabaseRest";

export { isSupabaseConfigured } from "./supabaseRest";

function isMissingRelationError(error, relationName) {
  const message = String(error?.message || error || "");
  return (
    message.includes("42P01") &&
    message.includes(`relation "public.${relationName}" does not exist`)
  );
}

export async function loadAppState() {
  if (!isSupabaseConfigured()) return null;

  const farms = await supabaseRequest(
    "/rest/v1/farms?select=id,name,farm_type_id,location,notes,created_by&order=created_at.asc&limit=1"
  );

  const farm = farms?.[0];
  if (!farm) return null;

  let stateRows = [];
  try {
    stateRows = await supabaseRequest(
      `/rest/v1/farm_app_state?select=state&farm_id=eq.${farm.id}&limit=1`
    );
  } catch (error) {
    if (!isMissingRelationError(error, "farm_app_state")) {
      throw error;
    }
  }

  return {
    farmId: farm.id,
    farm,
    state: stateRows?.[0]?.state ?? null,
  };
}

export async function saveAppState(farmId, state) {
  if (!isSupabaseConfigured() || !farmId) return null;

  try {
    return await supabaseRequest(`/rest/v1/farm_app_state?on_conflict=farm_id`, {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify({
        farm_id: farmId,
        state,
      }),
    });
  } catch (error) {
    if (isMissingRelationError(error, "farm_app_state")) {
      return null;
    }
    throw error;
  }
}
