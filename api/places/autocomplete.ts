import type { NextApiRequest, NextApiResponse } from "next";

type PlaceAutocompleteItem = {
  provider_id: string;
  source: "mapbox";
  display_name: string;
  country_code: string; // ISO2, uppercase
  lat: number;
  lon: number;
  timezone: string; // wird in Schritt 1.2 serverseitig ergänzt
};

type MapboxFeature = {
  id: string;
  text?: string;
  place_name?: string;
  center?: [number, number];
  geometry?: { coordinates?: [number, number] };
  context?: Array<{ id?: string; text?: string; short_code?: string }>;
};

function toUpperIso2(shortCode: string | undefined): string {
  if (!shortCode) return "";
  // Mapbox liefert oft "ch" oder "ch-be"
  const iso2 = shortCode.split("-")[0];
  return iso2.toUpperCase();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const q = String(req.query.q ?? "").trim();
  if (q.length < 2) return res.status(200).json({ results: [] });

  const token = process.env.MAPBOX_ACCESS_TOKEN;
  if (!token) return res.status(500).json({ error: "MISSING_MAPBOX_TOKEN" });

  // Optional: CH-Fokus am Anfang, später entfernen/konfigurierbar
  const country = String(req.query.country ?? "ch").trim().toLowerCase();

  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(q) +
    ".json" +
    `?access_token=${encodeURIComponent(token)}` +
    `&autocomplete=true` +
    `&limit=8` +
    `&types=place,locality,postcode` +
    `&language=de,en,fr` +
    (country ? `&country=${encodeURIComponent(country)}` : "");

  const r = await fetch(url);
  if (!r.ok) return res.status(502).json({ error: "MAPBOX_UPSTREAM_ERROR" });

  const data = (await r.json()) as { features?: MapboxFeature[] };
  const features = Array.isArray(data.features) ? data.features : [];

  const results: PlaceAutocompleteItem[] = features
    .map((f) => {
      const coords =
        f.center ??
        f.geometry?.coordinates ??
        undefined;

      if (!f.id || !coords || coords.length !== 2) return null;

      const lon = coords[0];
      const lat = coords[1];

      // display_name: bevorzugt place_name (Mapbox bereits formatiert)
      const display_name = (f.place_name ?? f.text ?? "").trim();
      if (!display_name) return null;

      // country_code aus context
      const countryCtx = f.context?.find((c) => c.id?.startsWith("country."));
      const country_code = toUpperIso2(countryCtx?.short_code);

      // timezone wird in Schritt 1.2 gesetzt
      const timezone = "";

      return {
        provider_id: f.id,
        source: "mapbox" as const,
        display_name,
        country_code,
        lat,
        lon,
        timezone,
      };
    })
    .filter(Boolean) as PlaceAutocompleteItem[];

  return res.status(200).json({ results });
}
