# AcreDesk™ Spatial Map Integration Archive & Reusable Blueprint

> **Archive Notice**: This document archives all map-related code, API endpoints, tile server URLs, styling specifications, PostGIS geometry parsers, and component architecture previously deployed in AcreDesk. Use this reference to restore or transfer the geospatial mapping engine to any current or future projects.

---

## 1. Map Engine & Dependencies

The map was built using **MapLibre GL JS** (the high-performance, open-source fork of Mapbox GL JS). It requires **no proprietary API keys or paid tokens** to run with Esri or OpenStreetMap raster/vector tiles.

### Required Packages
```bash
npm install maplibre-gl@^6.6.0
npm install --save-dev @types/maplibre-gl@^1.13.2
```

### Required Stylesheet
MapLibre GL requires its base stylesheet to be imported before or within the component:
```typescript
import "maplibre-gl/dist/maplibre-gl.css";
```

---

## 2. Tile Service APIs & Endpoints

No API key is required for these public Esri tile services under standard fair-use real-estate visualization.

### A. High-Definition Vibrant Street Map
- **Tile Format**: Raster (256x256 px)
- **URL Template**: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}`
- **Max Zoom**: `19`
- **Attribution**: `&copy; Esri & OpenStreetMap contributors`
- **Features**: Complete Indian roads, localities, highways, and street names with clear contrast.

```typescript
export const VIBRANT_STREET_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    "esri-streets": {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "&copy; Esri & OpenStreetMap contributors",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "esri-streets-layer",
      type: "raster",
      source: "esri-streets",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};
```

### B. Ultra-High Resolution Satellite Imagery
- **Tile Format**: Raster (256x256 px)
- **URL Template**: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
- **Max Zoom**: `19`
- **Attribution**: `&copy; Esri World Imagery`
- **Features**: Photorealistic aerial/satellite imagery ideal for inspecting land boundaries, agricultural plots, and villa compounds.

```typescript
export const SATELLITE_HYBRID_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    "esri-satellite": {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "&copy; Esri World Imagery",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "esri-satellite-layer",
      type: "raster",
      source: "esri-satellite",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};
```

---

## 3. Complete Source Code: `src/components/Map.tsx`

This component includes:
1. Dynamic style toggle between **Vibrant Streets** and **Real Satellite**.
2. Custom neon badge markers with pulsing green status indicators and property titles.
3. Interactive hover effects and click-to-select handlers.
4. Custom styled HTML popup card displaying property thumbnail, location, and price.
5. Dynamic bounding box calculation (`fitBounds` and `flyTo`) to center and frame all active properties automatically.

```tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Layers, MapPin, Eye, Compass, Satellite } from "lucide-react";

export type MapProperty = {
  id: string | number;
  title: string;
  price: string;
  address?: string;
  city?: string;
  image?: string;
  type?: string;
  lat?: number;
  lng?: number;
  [key: string]: any;
};

type MapProps = {
  properties?: MapProperty[];
  onSelectProperty?: (property: any) => void;
};

// High-definition Vibrant Street Map (Zero watermark, complete Indian roads & localities)
const VIBRANT_STREET_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    "esri-streets": {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "&copy; Esri & OpenStreetMap contributors",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "esri-streets-layer",
      type: "raster",
      source: "esri-streets",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

// Ultra-High Resolution Satellite Imagery (Zero watermark, real-world land plot view)
const SATELLITE_HYBRID_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    "esri-satellite": {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "&copy; Esri World Imagery",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "esri-satellite-layer",
      type: "raster",
      source: "esri-satellite",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export default function Map({ properties = [], onSelectProperty }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapStyleMode, setMapStyleMode] = useState<"streets" | "satellite">("streets");

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      const defaultCenter: [number, number] =
        properties.length > 0 && properties[0].lng && properties[0].lat
          ? [properties[0].lng, properties[0].lat]
          : [77.8058, 12.7966]; // Bidaraguppe / Bangalore

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: VIBRANT_STREET_STYLE,
        center: defaultCenter,
        zoom: properties.length > 0 ? 12 : 11,
      });

      map.current.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

      map.current.on("load", () => {
        map.current?.resize();
      });
    } catch (err) {
      console.error("Map initialization error:", err);
    }

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Switch map style between Vibrant Streets and Real Satellite
  const toggleMapStyle = (style: "streets" | "satellite") => {
    if (!map.current || style === mapStyleMode) return;
    setMapStyleMode(style);
    map.current.setStyle(style === "streets" ? VIBRANT_STREET_STYLE : SATELLITE_HYBRID_STYLE);
  };

  // Re-render markers and fit bounds
  useEffect(() => {
    if (!map.current) return;

    const renderMarkers = () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      if (properties.length === 0) return;

      const bounds = new maplibregl.LngLatBounds();
      let validCount = 0;

      properties.forEach((prop) => {
        const lng = typeof prop.lng === "number" ? prop.lng : parseFloat(prop.lng || "0");
        const lat = typeof prop.lat === "number" ? prop.lat : parseFloat(prop.lat || "0");

        if (isNaN(lng) || isNaN(lat) || (lng === 0 && lat === 0)) return;

        bounds.extend([lng, lat]);
        validCount++;

        // Custom High-Contrast Marker Badge with Property Title
        const el = document.createElement("div");
        el.className = "custom-property-marker group cursor-pointer";
        el.innerHTML = `
          <div style="
            background: linear-gradient(135deg, #022c22, #064e3b);
            color: #34d399;
            border: 2px solid #34d399;
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 800;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.7), 0 0 14px rgba(52, 211, 153, 0.4);
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
            white-space: nowrap;
          ">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #34d399; box-shadow: 0 0 8px #34d399;"></span>
            ${prop.title || "Property Listing"}
          </div>
        `;

        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.12) translateY(-3px)";
          el.style.zIndex = "100";
        });

        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1) translateY(0)";
          el.style.zIndex = "1";
        });

        el.addEventListener("click", () => {
          if (onSelectProperty) {
            onSelectProperty(prop);
          }
        });

        // Popup Box
        const popupHtml = `
          <div style="color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; padding: 4px; max-width: 220px;">
            ${prop.image ? `<img src="${prop.image}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />` : ""}
            <div style="font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 2px; line-height: 1.2;">${prop.title}</div>
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">📍 ${prop.address || prop.city || "Location"}</div>
            <div style="font-size: 15px; font-weight: 800; color: #34d399; margin-bottom: 4px;">${prop.price}</div>
            <div style="font-size: 10px; color: #38bdf8; font-weight: 600;">👉 Click marker to view full details</div>
          </div>
        `;

        const popup = new maplibregl.Popup({
          offset: 28,
          closeButton: false,
          className: "custom-map-popup",
        }).setHTML(popupHtml);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map.current!);

        markersRef.current.push(marker);
      });

      // Fit map view to plotted assets
      if (validCount > 0) {
        if (validCount === 1) {
          const center = bounds.getCenter();
          map.current?.flyTo({ center: [center.lng, center.lat], zoom: 13, duration: 1000 });
        } else {
          map.current?.fitBounds(bounds, {
            padding: 70,
            maxZoom: 14,
            duration: 1000,
          });
        }
      }
    };

    if (map.current.isStyleLoaded()) {
      renderMarkers();
    } else {
      map.current.once("style.load", renderMarkers);
    }
  }, [properties, onSelectProperty, mapStyleMode]);

  return (
    <div className="w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-border relative bg-slate-950 shadow-lg flex flex-col">
      {/* Map Mode Selector (Streets vs Real Satellite) */}
      <div className="absolute top-3 left-3 z-20 flex items-center bg-black/80 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-xl">
        <button
          onClick={() => toggleMapStyle("streets")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            mapStyleMode === "streets"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-slate-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Color Streets</span>
        </button>
        <button
          onClick={() => toggleMapStyle("satellite")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            mapStyleMode === "satellite"
              ? "bg-emerald-500 text-black shadow-md"
              : "text-slate-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <Satellite className="w-3.5 h-3.5" />
          <span>Real Satellite</span>
        </button>
      </div>

      <div ref={mapContainer} className="w-full h-full min-h-[500px] flex-1" />
    </div>
  );
}
```

---

## 4. Next.js Dynamic Client Loading Pattern

Because MapLibre GL accesses browser-only APIs (`window`, `navigator.userAgent`, WebGL `HTMLCanvasElement`), it **cannot** be rendered on the server during SSR. It must be dynamically loaded with `ssr: false`:

```tsx
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] rounded-2xl border border-border bg-slate-900 flex items-center justify-center text-slate-400">
      Loading interactive map...
    </div>
  ),
});
```

---

## 5. UI Layout: Split Map & Featured Geospatial Explorer Card

### A. The "Show Map View" Toggle Button
```tsx
const [showMap, setShowMap] = useState(false);

<button
  onClick={() => setShowMap(!showMap)}
  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-sm"
>
  <MapIcon className="w-4 h-4 text-primary" />
  <span>{showMap ? "Hide Map Split" : "Show Map View"}</span>
</button>
```

### B. Responsive Grid with Side-by-Side Map Container
```tsx
<div className={`grid grid-cols-1 ${showMap ? "lg:grid-cols-2" : "grid-cols-1"} gap-6`}>
  {/* Property Cards Column */}
  <div className={`grid grid-cols-1 sm:grid-cols-2 ${showMap ? "lg:grid-cols-2" : "lg:grid-cols-3"} gap-5 auto-rows-max`}>
    {filteredProperties.map((prop) => (
      <PropertyCard key={prop.id} property={prop} />
    ))}
  </div>

  {/* Interactive Map (When Toggled) */}
  {showMap && (
    <div className="sticky top-20 h-[500px] lg:h-[700px] rounded-2xl overflow-hidden border border-border z-10 shadow-lg">
      <MapComponent 
        properties={filteredProperties} 
        onSelectProperty={setSelectedProperty} 
      />
    </div>
  )}
</div>
```

### C. Featured Card 2: Interactive Spatial Map Explorer
```tsx
<div 
  onClick={() => properties.length > 0 && setShowMap(true)}
  className={`relative bg-gradient-to-br from-emerald-500/10 via-card to-primary/10 border border-border rounded-2xl p-6 shadow-lg transition-all flex flex-col justify-between overflow-hidden ${
    properties.length > 0 
      ? "hover:border-primary/60 hover:-translate-y-1 cursor-pointer group" 
      : "cursor-default"
  }`}
>
  {/* Background Stylized Map Pattern */}
  <div className="absolute inset-0 opacity-25 dark:opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

  <div className="relative z-10 flex items-start justify-between">
    <div className="space-y-1">
      <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
        <MapPin className={`w-3.5 h-3.5 ${properties.length > 0 ? "text-red-500 animate-bounce" : "text-muted-foreground"}`} />
        Geospatial Plot Coordinates
      </span>
      <h3 className="text-lg font-bold text-foreground">
        Interactive Spatial Map Explorer
      </h3>
      <p className="text-xs text-muted-foreground max-w-xs">
        Inspect exact boundaries, layout survey markers, and satellite terrain views.
      </p>
    </div>

    {/* Pin Tag Badge */}
    <div className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1 ${
      properties.length > 0
        ? "bg-red-500 text-white shadow-red-500/30"
        : "bg-muted text-muted-foreground border border-border"
    }`}>
      <MapPin className="w-3.5 h-3.5" />
      <span>{properties.length > 0 ? `${properties.length} Plots` : "Unavailable"}</span>
    </div>
  </div>

  <div className="relative z-10 pt-8 flex items-center justify-between">
    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
      <span className={`w-2 h-2 rounded-full ${properties.length > 0 ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"}`} />
      <span>
        {properties.length > 0 
          ? `${properties.length} Geo-tagged properties ready` 
          : "0 Geo-tagged properties (Unavailable)"}
      </span>
    </div>

    {properties.length > 0 ? (
      <button 
        type="button"
        className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-primary/30"
        aria-label="Open Interactive Map"
      >
        <ArrowRight className="w-5 h-5" />
      </button>
    ) : (
      <span className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground font-medium">
        Unavailable
      </span>
    )}
  </div>
</div>
```

---

## 6. PostGIS Geometry & Spatial Coordinate Helpers

When storing coordinates in PostgreSQL with the `postgis` extension enabled:
1. Coordinates are stored in column: `lat_lng geography(Point, 4326)`.
2. Format inserted into DB: `POINT(longitude latitude)`. Note that GIS coordinates are `(lng, lat)`.

### Universal Hex / EWKB / WKT Parser (`parseGeoCoordinates`)
```typescript
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

export function parseGeoCoordinates(rawLatLng: any, city?: string, address?: string): { lat: number; lng: number } {
  if (typeof rawLatLng === "string") {
    // 1. PostGIS EWKB binary hex string (starts with 01010000...)
    if (rawLatLng.length >= 32 && /^[0-9a-fA-F]+$/.test(rawLatLng)) {
      try {
        const hex = rawLatLng.toLowerCase();
        const parseHexDouble = (hexStr: string, isLE: boolean) => {
          const bytes = new Uint8Array(8);
          for (let i = 0; i < 8; i++) {
            bytes[i] = parseInt(hexStr.substr(i * 2, 2), 16);
          }
          const view = new DataView(bytes.buffer);
          return view.getFloat64(0, isLE);
        };

        const isLittleEndian = hex.substr(0, 2) === "01";
        const offsetHex = 18; // 9 bytes * 2
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

    // 2. Standard WKT "POINT(lng lat)"
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

  // 3. Fallback to known city coordinates
  if (city) {
    const normalizedCity = city.toLowerCase().trim();
    if (INDIAN_CITY_COORDINATES[normalizedCity]) {
      return INDIAN_CITY_COORDINATES[normalizedCity];
    }
  }

  // 4. Default to Bangalore center
  return { lat: 12.9716, lng: 77.5946 };
}
```

---

## 7. How to Restore the Map in the Future (Quick Checklist)

1. **Verify Packages**: Ensure `maplibre-gl` and `@types/maplibre-gl` are installed.
2. **Re-create Component**: Copy Section 3 into `src/components/Map.tsx`.
3. **Add Dynamic Import**: Insert the `dynamic(() => import("@/components/Map"), { ssr: false })` block in whichever page needs the map.
4. **Wire Markers & Bounds**: Pass an array of objects `{ id, title, price, lat, lng, image }` as the `properties` prop.
5. **Tile Servers**: If custom vector tiles with custom branding are desired in the future, services like [MapTiler](https://www.maptiler.com) or [Mapbox](https://www.mapbox.com) can replace the Esri raster style JSON with their vector style URL.
