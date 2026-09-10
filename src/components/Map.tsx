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
