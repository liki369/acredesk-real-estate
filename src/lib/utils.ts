import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Indian major city coordinate fallbacks
export const INDIAN_CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  delhi: { lat: 28.6139, lng: 77.2090 },
  "new delhi": { lat: 28.6139, lng: 77.2090 },
  noida: { lat: 28.5355, lng: 77.3910 },
  gurgaon: { lat: 28.4595, lng: 77.0266 },
  gurugram: { lat: 28.4595, lng: 77.0266 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  pune: { lat: 18.5204, lng: 73.8567 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  goa: { lat: 15.2993, lng: 74.1240 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  visakhapatnam: { lat: 17.6868, lng: 83.2185 },
  vijayawada: { lat: 16.5062, lng: 80.6480 },
};

/**
 * Universal PostGIS Geometry parser
 * Handles PostGIS EWKB binary hex strings, WKT POINT(lng lat), or city name lookups
 */
export function parseGeoCoordinates(rawLatLng: any, city?: string, address?: string): { lat: number; lng: number } {
  if (typeof rawLatLng === "string") {
    // 1. Check if rawLatLng is a PostGIS EWKB hex string (starts with 01010000...)
    if (rawLatLng.length >= 32 && /^[0-9a-fA-F]+$/.test(rawLatLng)) {
      try {
        const hex = rawLatLng.toLowerCase();
        // Parse hex in pure JS
        const parseHexDouble = (hexStr: string, isLE: boolean) => {
          const bytes = new Uint8Array(8);
          for (let i = 0; i < 8; i++) {
            bytes[i] = parseInt(hexStr.substr(i * 2, 2), 16);
          }
          const view = new DataView(bytes.buffer);
          return view.getFloat64(0, isLE);
        };

        const isLittleEndian = hex.substr(0, 2) === "01";
        // Type check & SRID offset
        let offsetHex = 18; // 9 bytes * 2
        const lngHex = hex.substr(offsetHex, 16);
        const latHex = hex.substr(offsetHex + 16, 16);

        const lng = parseHexDouble(lngHex, isLittleEndian);
        const lat = parseHexDouble(latHex, isLittleEndian);

        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { lat, lng };
        }
      } catch (err) {
        console.error("EWKB parse error:", err);
      }
    }

    // 2. Check if rawLatLng is standard WKT "POINT(lng lat)"
    if (rawLatLng.includes("POINT(") || rawLatLng.includes("point(")) {
      const cleaned = rawLatLng.replace(/point\(/i, "").replace(")", "").trim();
      const parts = cleaned.split(/\s+/);
      const lng = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
  }

  // 3. Fallback to city/address coordinates if available
  if (city) {
    const normalizedCity = city.toLowerCase().trim();
    if (INDIAN_CITY_COORDINATES[normalizedCity]) {
      return INDIAN_CITY_COORDINATES[normalizedCity];
    }
  }

  // 4. Default to Bangalore/Central India coordinates
  return { lat: 12.9716, lng: 77.5946 };
}
