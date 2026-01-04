import tzLookup from "tz-lookup";

export type PlaceAutocompleteItem = {
  provider_id: string;
  source: "mapbox";
  display_name: string;
  country_code: string; // ISO2 uppercase, z.B. CH
  lat: number;
  lon: number;
  timezone: string; // wird im nächsten Schritt serverseitig gefüllt
};

type MapboxFeature = {
  id?: string;
  text?: string;
  place_name?: string;
  center?: [number, number];
  geometry?: { coordinates?: [number, number] };
  context?: Array<{ id?: string; text?: string; short_code?: string }>;
};

function toUpperIso2(shortCode?: string): string {
  if (!shortCode) return "";
  return String(shortCode).split("-")[0].toUpperCase();
}

function extractCountryCode(feature: MapboxFeature): string {
  const ctx = Array.isArray(feature.context) ? feature.context : [];
  const country = ctx.find((c) => typeof c?.id === "string" && c.id!.startsWith("country."));
  return toUpperIso2(country?.short_code);
}

function buildDisplayName(feature: MapboxFeature): string {
  return String(feature.place_name ?? feature.text ?? "").trim();
}

export async function fetchPlacesFromMapbox(args: {
  q: string;
  token: string;
  country?: string; // "ch" etc.
  limit?: number;   // max 8
}): Promise<PlaceAutocompleteItem[]> {
  const q = args.q.trim();
  if (q.length < 2) return [];

  const limit = Math.max(1, Math.min(8, Number(args.limit ?? 8) || 8));
  const country = (args.country ?? "ch").trim().toLowerCase();

  const base =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(q) +
    ".json";

  const params = new URLSearchParams();
  params.set("access_token", args.token);
  params.set("autocomplete", "true");
  params.set("limit", String(limit));
  params.set("types", "place,locality,postcode");
  params.set("language", "de,en,fr");
  if (country) params.set("country", country);

  const url = `${base}?${params.toString()}`;

  const r = await fetch(url);

    // DEBUG – temporär
    const rawText = await r.text();
    console.log("MAPBOX STATUS:", r.status);
    console.log("MAPBOX BODY (first 500):", rawText.slice(0, 500));

    if (!r.ok) {
    return [];
    }

    const data = (JSON.parse(rawText)) as { features?: MapboxFeature[] };
  const features = Array.isArray(data?.features) ? data!.features! : [];

  const results: PlaceAutocompleteItem[] = features
    .map((f) => {
      const id = f.id;
      const coords = f.center ?? f.geometry?.coordinates;
      if (!id || !Array.isArray(coords) || coords.length !== 2) return null;

      const lon = coords[0];
      const lat = coords[1];

      const display_name = buildDisplayName(f);
      if (!display_name) return null;

      const country_code = extractCountryCode(f);

      let timezone = "";
        try {
        timezone = tzLookup(lat, lon);
        } catch {
        timezone = "";
        }

        return {
        provider_id: id,
        source: "mapbox",
        display_name,
        country_code,
        lat,
        lon,
        timezone
        };
    })
    .filter(Boolean) as PlaceAutocompleteItem[];

  return results;
}
