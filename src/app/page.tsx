"use client";
/**
 * © 2026 AcreDesk™. All Rights Reserved.
 *
 * Modern Real Estate Landing Page matching reference mockup.
 * High-definition twilight pool villa hero, multi-tab search container,
 * featured listings showcase, mobile quick category pills, and live inventory.
 */

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  Search, 
  MapPin, 
  List, 
  Sparkles, 
  X, 
  Building2, 
  DollarSign, 
  Compass, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Heart,
  ChevronRight,
  Map as MapIcon,
  Home as HomeIcon
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { getPublishedProperties } from "@/app/actions/properties";
import { parseGeoCoordinates } from "@/lib/utils";

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] rounded-2xl border border-border bg-slate-900 flex items-center justify-center text-slate-400">
      Loading interactive map...
    </div>
  ),
});

export type Property = {
  id: string | number;
  type: string;
  price: string;
  rawPrice: number;
  title: string;
  address: string;
  city: string;
  location: string;
  stats: string;
  image: string;
  lat: number;
  lng: number;
  description: string;
  area?: string;
  bedrooms?: number;
  bathrooms?: number;
  status: string;
  created_at?: string;
};

export default function Home() {
  const [showMap, setShowMap] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const [savedProperties, setSavedProperties] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("acredesk_saved");
      if (stored) {
        setSavedProperties(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to read saved properties:", err);
    }
  }, []);

  const isSaved = (id: string | number) => {
    return savedProperties.some((p) => String(p.id) === String(id));
  };

  const toggleSaveProperty = (e: React.MouseEvent, prop: Property) => {
    e.stopPropagation();
    let updated: any[];
    if (isSaved(prop.id)) {
      updated = savedProperties.filter((p) => String(p.id) !== String(prop.id));
    } else {
      updated = [...savedProperties, prop];
    }
    setSavedProperties(updated);
    try {
      localStorage.setItem("acredesk_saved", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to write saved properties:", err);
    }
  };

  // Fetch real uploaded properties strictly from Supabase
  useEffect(() => {
    async function loadProperties() {
      try {
        setIsLoading(true);
        const { data, error } = await getPublishedProperties();
        if (error) {
          console.error("Error fetching properties from Supabase:", error);
          return;
        }

        if (data && data.length > 0) {
          const formatted: Property[] = data.map((item: any) => {
            const coords = parseGeoCoordinates(item.location);
            return {
              id: item.id,
              type: item.type || "Plot",
              price: item.price ? `₹${Number(item.price).toLocaleString("en-IN")}` : "Price on Request",
              rawPrice: Number(item.price) || 0,
              title: item.title,
              address: item.address || "Address available on request",
              city: item.city || "Bangalore",
              location: `${item.address ? item.address + ", " : ""}${item.city || ""}`,
              stats: item.area ? `${item.area} sq.ft` : (item.type || "Plot"),
              image: item.images && item.images.length > 0 
                ? item.images[0] 
                : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
              lat: coords.lat,
              lng: coords.lng,
              description: item.description || "Fully clear legal title property available on AcreDesk.",
              area: item.area ? `${item.area} sq.ft` : undefined,
              bedrooms: item.bedrooms,
              bathrooms: item.bathrooms,
              status: item.status || "published",
              created_at: item.created_at,
            };
          });

          setProperties(formatted);
        } else {
          setProperties([]);
        }
      } catch (err) {
        console.error("Failed to load live properties:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProperties();
  }, []);

  // Filter properties based on type, city, and search query
  const filteredProperties = properties.filter((prop) => {
    const matchesType =
      selectedType === "all" ||
      prop.type.toLowerCase() === selectedType.toLowerCase();

    const matchesSearch =
      searchFilter === "" ||
      prop.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
      prop.description.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesCity =
      selectedCity === "all" ||
      (prop.city && prop.city.toLowerCase() === selectedCity.toLowerCase()) ||
      prop.location.toLowerCase().includes(selectedCity.toLowerCase());

    return matchesType && matchesSearch && matchesCity;
  });

  const cities = Array.from(new Set(properties.map(p => p.city).filter(Boolean)));
  const featuredItem = properties[0] || null;

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pb-24 md:pb-0 transition-colors">
      <Navbar />

      {/* Hero Section with Twilight Luxury Pool Villa (Matching Reference Mockup) */}
      <section className="relative w-full overflow-hidden bg-slate-950 flex flex-col items-center justify-center border-b border-border">
        {/* Background Photo */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=85&w=1920" 
            alt="Luxury modern home with pool at twilight" 
            className="w-full h-full object-cover opacity-60 scale-105 transform transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/75" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:py-24 lg:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Live Verified Inventory
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md max-w-4xl leading-tight">
            FIND YOUR PERFECT HOME
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-200/90 max-w-xl mt-3 drop-shadow leading-relaxed">
            Search real-estate platform landing page. Every plot, villa, and property, held on one desk.
          </p>

          {/* Desktop Floating Search Container */}
          <div className="hidden md:flex w-full max-w-3xl mt-8 bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl p-3 shadow-2xl text-left">
            {/* Inputs & Action */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 flex items-center bg-background border border-border rounded-xl px-3 py-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Enter city, neighborhood, or plot title..."
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                {searchFilter && (
                  <button
                    type="button"
                    onClick={() => setSearchFilter("")}
                    className="text-xs text-muted-foreground hover:text-foreground ml-1"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="w-48 bg-background border border-border rounded-xl px-3 py-2.5">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground focus:outline-none capitalize"
                >
                  <option value="all">All Property Types</option>
                  <option value="house">Houses</option>
                  <option value="villa">Villas</option>
                  <option value="plot">Plots</option>
                  <option value="land">Lands</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("featured-listings");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center gap-2 shrink-0 active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Simplified Mobile Search & Quick Category Pills (Matching Smartphone Mockup) */}
          <div className="flex md:hidden flex-col w-full max-w-sm mt-6 space-y-4">
            <div className="flex items-center bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-1.5 shadow-xl">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Location..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none px-3 py-1.5"
              />
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("featured-listings");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-md active:scale-95"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Category Icons */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setSelectedType(selectedType === "house" ? "all" : "house")}
                className={`flex flex-col items-center justify-center w-24 py-2.5 rounded-xl border transition-all ${
                  selectedType === "house"
                    ? "bg-blue-500/20 border-blue-500 text-blue-400 font-bold shadow-md shadow-blue-500/10"
                    : "bg-card/85 backdrop-blur-md border-border text-foreground hover:bg-muted"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-1">
                  <HomeIcon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium">House</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType(selectedType === "plot" ? "all" : "plot")}
                className={`flex flex-col items-center justify-center w-24 py-2.5 rounded-xl border transition-all ${
                  selectedType === "plot"
                    ? "bg-amber-500/20 border-amber-500 text-amber-400 font-bold shadow-md shadow-amber-500/10"
                    : "bg-card/85 backdrop-blur-md border-border text-foreground hover:bg-muted"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 mb-1">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium">Plots</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType(selectedType === "land" ? "all" : "land")}
                className={`flex flex-col items-center justify-center w-24 py-2.5 rounded-xl border transition-all ${
                  selectedType === "land"
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold shadow-md shadow-emerald-500/10"
                    : "bg-card/85 backdrop-blur-md border-border text-foreground hover:bg-muted"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-1">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium">Lands</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Showcase Section (Matching Reference Mockup Cards) */}
      <section id="featured-listings" className="w-full px-4 sm:px-6 py-10 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Highlighted Portfolio
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Featured Listings
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Curated prime selections with verified clear legal titles and direct desk diligence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMap(!showMap)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-sm"
            >
              <MapIcon className="w-4 h-4 text-primary" />
              <span>{showMap ? "Hide Map Split" : "Show Map View"}</span>
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Contact Sales Desk</span>
            </Link>
          </div>
        </div>

        {/* The Two Prominent Mockup Featured Cards (Desktop Card 1 & Card 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Modern Architecture Listing Card */}
          {featuredItem ? (
            <div 
              onClick={() => setSelectedProperty(featuredItem)}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:border-primary/60 transition-all hover:-translate-y-1 cursor-pointer group flex flex-col sm:flex-row"
            >
              <div className="sm:w-1/2 relative h-56 sm:h-auto overflow-hidden bg-slate-900">
                <img
                  src={featuredItem.image}
                  alt={featuredItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-white border border-white/10">
                  Featured
                </div>
              </div>
              <div className="sm:w-1/2 p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {featuredItem.type}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {featuredItem.title}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{featuredItem.location}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground block">List Price</span>
                    <span className="text-xl font-extrabold text-foreground">
                      {featuredItem.price}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card/40 border border-dashed border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                  Unavailable
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  No Active Listing
                </span>
              </div>
              
              <div className="space-y-2 py-4">
                <h3 className="text-lg font-bold text-foreground">
                  Featured Listing Unavailable
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                  There are currently no featured listings available in the live inventory.
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <div>
                  <span className="block text-[11px] text-muted-foreground">List Price</span>
                  <span className="font-bold text-foreground">Unavailable</span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-muted text-muted-foreground font-medium text-xs">
                  Unavailable
                </span>
              </div>
            </div>
          )}

          {/* Card 2: Interactive Map Preview Card with Pin & Price Badge */}
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
        </div>

        {/* Live Filter Controls */}
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedType === "all"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:bg-muted"
              }`}
            >
              All Assets ({properties.length})
            </button>
            <button
              onClick={() => setSelectedType("house")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedType === "house"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:bg-muted"
              }`}
            >
              Houses
            </button>
            <button
              onClick={() => setSelectedType("villa")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedType === "villa"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:bg-muted"
              }`}
            >
              Villas
            </button>
            <button
              onClick={() => setSelectedType("plot")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedType === "plot"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:bg-muted"
              }`}
            >
              Plots
            </button>
            <button
              onClick={() => setSelectedType("land")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedType === "land"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:bg-muted"
              }`}
            >
              Lands
            </button>
            <button
              onClick={() => setSelectedType("commercial")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedType === "commercial"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:bg-muted"
              }`}
            >
              Commercial
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-background border border-border rounded-lg p-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all">All Locations ({cities.length})</option>
              {cities.map((city: any) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {(selectedType !== "all" || searchFilter || selectedCity !== "all") && (
              <button
                onClick={() => {
                  setSelectedType("all");
                  setSearchFilter("");
                  setSelectedCity("all");
                }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Live Inventory Grid with Split Map Option */}
        <div className={`grid grid-cols-1 ${showMap ? "lg:grid-cols-2" : "grid-cols-1"} gap-6`}>
          {/* Properties Grid */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${showMap ? "lg:grid-cols-2" : "lg:grid-cols-3"} gap-5 auto-rows-max`}
          >
            {isLoading ? (
              <div className="col-span-full border border-border bg-card/40 rounded-2xl p-16 text-center text-muted-foreground flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm font-medium text-foreground">Loading verified listings...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="col-span-full border border-dashed border-border rounded-2xl p-16 text-center text-muted-foreground bg-card/20">
                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-40 text-muted-foreground" />
                <h3 className="text-base font-semibold text-foreground mb-1">No properties found</h3>
                <p className="text-xs max-w-sm mx-auto">
                  No properties currently match your selected filters. Please adjust your search criteria or contact our sales desk.
                </p>
              </div>
            ) : (
              filteredProperties.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => setSelectedProperty(prop)}
                  className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col group relative shadow-sm hover:border-primary/60 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Property Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider text-white border border-white/10 uppercase">
                      {prop.type}
                    </div>

                    {/* Heart Save Button */}
                    <button
                      onClick={(e) => toggleSaveProperty(e, prop)}
                      title={isSaved(prop.id) ? "Remove from saved listings" : "Save to shortlist"}
                      className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-200 shadow-md ${
                        isSaved(prop.id)
                          ? "bg-rose-500 text-white shadow-rose-500/40 border border-rose-400 scale-110"
                          : "bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 hover:text-rose-400 hover:scale-105"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved(prop.id) ? "fill-current text-white" : ""}`} />
                    </button>

                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/90 to-transparent">
                      <span className="text-lg font-bold text-white">{prop.price}</span>
                    </div>
                  </div>

                  {/* Property Card Details */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {prop.title}
                      </h3>
                      <p className="text-muted-foreground text-xs flex items-center mb-3">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-primary flex-shrink-0" />{" "}
                        <span className="truncate">{prop.location}</span>
                      </p>
                    </div>
                    <div className="pt-2.5 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">{prop.stats}</span>
                      <span className="text-xs font-semibold text-primary group-hover:underline flex items-center gap-1">
                        View Details &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
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
      </section>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedProperty(null)}
        >
          <div 
            className="bg-card border border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative custom-scrollbar animate-in zoom-in-95 duration-200 text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900 rounded-t-2xl">
              <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase shadow-md">
                {selectedProperty.type}
              </div>
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {selectedProperty.price}
                  </span>
                  <p className="text-xs text-slate-300 mt-1">Verified List Price</p>
                </div>
                <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Title &amp; Ownership
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
                  {selectedProperty.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1 text-foreground/80">
                    <MapPin className="w-4 h-4 text-primary" />
                    {selectedProperty.location}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                    <Compass className="w-3.5 h-3.5 text-primary" />
                    Coordinates: {selectedProperty.lat.toFixed(4)}, {selectedProperty.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Specs Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-background/60 border border-border rounded-xl p-3.5 text-center">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1">Asset Class</span>
                  <span className="text-sm font-bold text-foreground">{selectedProperty.type}</span>
                </div>
                <div className="bg-background/60 border border-border rounded-xl p-3.5 text-center">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1">Size / Area</span>
                  <span className="text-sm font-bold text-primary">{selectedProperty.area || selectedProperty.stats}</span>
                </div>
                <div className="bg-background/60 border border-border rounded-xl p-3.5 text-center">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1">City</span>
                  <span className="text-sm font-bold text-foreground">{selectedProperty.city}</span>
                </div>
                <div className="bg-background/60 border border-border rounded-xl p-3.5 text-center">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1">Availability</span>
                  <span className="text-sm font-bold text-emerald-400 capitalize">{selectedProperty.status}</span>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-2.5">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Property Overview &amp; Description
                </h3>
                <div className="bg-background/40 border border-border rounded-xl p-4 sm:p-5 text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                  {selectedProperty.description}
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="w-full sm:w-auto px-5 py-2.5 border border-border text-muted-foreground hover:text-foreground rounded-xl text-sm font-medium transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={(e) => toggleSaveProperty(e, selectedProperty)}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      isSaved(selectedProperty.id)
                        ? "bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-500/30 border border-rose-400"
                        : "border border-border bg-card hover:bg-muted text-foreground"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved(selectedProperty.id) ? "fill-current text-white" : ""}`} />
                    <span>{isSaved(selectedProperty.id) ? "Shortlisted" : "Save Listing"}</span>
                  </button>
                </div>
                <Link
                  href={`/contact?property=${encodeURIComponent(selectedProperty.title)}&property_id=${selectedProperty.id}`}
                  className="w-full sm:w-auto px-7 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/25"
                >
                  <span>Enquire About This Asset</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
