"use client";

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
  ExternalLink,
  ShieldCheck,
  PhoneCall,
  Heart
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { getPublishedProperties } from "@/app/actions/properties";
import { parseGeoCoordinates } from "@/lib/utils";

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] rounded-lg border border-border bg-slate-900 flex items-center justify-center text-slate-400">
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
      setIsLoading(true);
      try {
        const res = await getPublishedProperties();
        if (res.success && res.data) {
          const dbProps: Property[] = res.data.map((p: any) => {
            const { lat, lng } = parseGeoCoordinates(p.lat_lng, p.city, p.address);

            const rawPrice = Number(p.price) || 0;
            const formattedPrice = `₹${rawPrice.toLocaleString("en-IN")}`;
            const specs = p.specs || {};
            const type = (specs.sub_type || p.type || "house").toUpperCase();

            let stats = specs.area || (type === "HOUSE" || type === "VILLA" ? "4 bd • 3 ba • 3,200 sq ft" : type === "PLOT" ? "Prime Plot" : "Prime Land");
            if (specs.bedrooms && specs.bathrooms) {
              stats = `${specs.bedrooms} bd • ${specs.bathrooms} ba • ${specs.area || "Spacious"}`;
            }

            return {
              id: p.id,
              type,
              rawPrice,
              price: formattedPrice,
              title: p.title,
              address: p.address || "",
              city: p.city || "Hyderabad",
              location: `${p.address || ""}, ${p.city || ""}`.replace(/^, /, ""),
              stats,
              image: (p.media_urls && p.media_urls[0]) || (
                type === "LAND" || type === "PLOT"
                  ? "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
                  : type === "VILLA"
                  ? "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800"
                  : type === "COMMERCIAL"
                  ? "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
                  : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
              ),
              lat,
              lng,
              description: specs.description || `Verified ${type.toLowerCase()} located at ${p.address || ""}, ${p.city || ""}. Excellent investment with direct road access, verified title deed, and utilities ready.`,
              area: specs.area,
              bedrooms: specs.bedrooms,
              bathrooms: specs.bathrooms,
              status: p.status || "published",
              created_at: p.created_at,
            };
          });

          setProperties(dbProps);
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

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full py-14 px-6 bg-gradient-to-b from-card to-background border-b border-border">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Live Verified Inventory
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            Every plot and property, held on one desk.
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Browse our active database listings below. Click on any asset to view its complete description, exact map location, and specifications.
          </p>

          <div className="w-full mt-4 flex flex-col space-y-4">
            <div className="flex w-full items-center space-x-2 bg-black/40 border border-white/10 rounded-md p-2 backdrop-blur-md">
              <Search className="w-5 h-5 text-muted-foreground ml-2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search by city, address, or property title..."
                className="flex-1 bg-transparent border-none text-white placeholder-slate-400 focus:outline-none px-2 text-sm"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter("")}
                  className="text-xs text-muted-foreground hover:text-white px-2"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedType === "all"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                All Assets
              </button>
              <button
                onClick={() => setSelectedType("land")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedType === "land"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                Lands
              </button>
              <button
                onClick={() => setSelectedType("plot")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedType === "plot"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                Plots
              </button>
              <button
                onClick={() => setSelectedType("house")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedType === "house"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                Houses
              </button>
              <button
                onClick={() => setSelectedType("villa")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedType === "villa"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                Villas
              </button>
              <button
                onClick={() => setSelectedType("commercial")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedType === "commercial"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                Commercial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Inventory & Filters */}
      <section className="w-full px-6 py-8 flex flex-col space-y-6 max-w-7xl mx-auto flex-1">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Live Inventory</h2>
            <p className="text-muted-foreground text-sm">
              {filteredProperties.length} verified listings available
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            General Inquiry
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="w-full bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="flex flex-col space-y-1 w-full md:w-1/3">
            <label className="text-xs font-semibold text-muted-foreground uppercase">City Filter</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-background border border-border rounded p-2 text-sm text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all">All Cities ({cities.length})</option>
              {cities.map((city: any) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-1 w-full md:w-1/3">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Asset Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-background border border-border rounded p-2 text-sm text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all">All Property Types</option>
              <option value="land">Lands</option>
              <option value="plot">Plots</option>
              <option value="house">Houses</option>
              <option value="villa">Villas</option>
              <option value="commercial">Commercial Buildings</option>
            </select>
          </div>

          <div className="flex items-center justify-end w-full md:w-1/3 pt-4 md:pt-0">
            {(selectedType !== "all" || searchFilter || selectedCity !== "all") && (
              <button
                onClick={() => {
                  setSelectedType("all");
                  setSearchFilter("");
                  setSelectedCity("all");
                }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Split Screen Layout: Left Cards / Right Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full mt-2 relative">
          {/* Left: Property Cards */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-max h-[800px] overflow-y-auto pr-2 custom-scrollbar ${
              showMap ? "hidden lg:grid" : "grid"
            }`}
          >
            {isLoading ? (
              <div className="col-span-full border border-border bg-card/40 rounded-xl p-16 text-center text-muted-foreground flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm font-medium text-white">Loading properties from live database...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="col-span-full border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground bg-card/20">
                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-40 text-muted-foreground" />
                <h3 className="text-base font-semibold text-white mb-1">No properties listed</h3>
                <p className="text-xs max-w-sm mx-auto mb-4">
                  {properties.length === 0
                    ? "Your database currently has no published listings. Use the Inventory Dashboard to upload your first asset."
                    : "No properties match your current filter settings."}
                </p>
                <Link
                  href="/admin/inventory"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30 text-xs font-semibold hover:bg-primary/20 transition-colors"
                >
                  <span>Go to Inventory Upload</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              filteredProperties.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => setSelectedProperty(prop)}
                  className="bg-card border border-border rounded-xl overflow-hidden flex flex-col group relative shadow-sm hover:border-primary/60 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold tracking-wider text-white border border-white/10">
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
                    <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/85 to-transparent">
                      <span className="text-xl font-bold text-white">{prop.price}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-base text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {prop.title}
                      </h3>
                      <p className="text-muted-foreground text-xs flex items-center mb-3">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-primary flex-shrink-0" />{" "}
                        <span className="truncate">{prop.location}</span>
                      </p>
                    </div>
                    <div className="pt-2.5 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">{prop.stats}</span>
                      <span className="text-xs font-semibold text-primary group-hover:underline flex items-center gap-1">
                        View Details &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: Map */}
          <div
            className={`${
              showMap ? "block" : "hidden"
            } lg:block sticky top-24 h-[calc(100vh-120px)] lg:h-[800px] rounded-xl overflow-hidden border border-border z-10 shadow-sm`}
          >
            <MapComponent 
              properties={filteredProperties} 
              onSelectProperty={setSelectedProperty} 
            />
          </div>
        </div>
      </section>

      {/* Property Details Interactive Modal */}
      {selectedProperty && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedProperty(null)}
        >
          <div 
            className="bg-card border border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative custom-scrollbar animate-in zoom-in-95 duration-200"
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
                  Verified Title & Ownership
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Title & Location */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                  {selectedProperty.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-4 h-4 text-primary" />
                    {selectedProperty.location}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs text-slate-400">
                    <Compass className="w-3.5 h-3.5 text-primary" />
                    Coordinates: {selectedProperty.lat.toFixed(4)}, {selectedProperty.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Specs Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-background/60 border border-border rounded-xl p-3.5 text-center">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1">Asset Class</span>
                  <span className="text-sm font-bold text-white">{selectedProperty.type}</span>
                </div>
                <div className="bg-background/60 border border-border rounded-xl p-3.5 text-center">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1">Size / Area</span>
                  <span className="text-sm font-bold text-primary">{selectedProperty.area || selectedProperty.stats}</span>
                </div>
                <div className="bg-background/60 border border-border rounded-xl p-3.5 text-center">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1">City</span>
                  <span className="text-sm font-bold text-white">{selectedProperty.city}</span>
                </div>
                <div className="bg-background/60 border border-border rounded-xl p-3.5 text-center">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1">Availability</span>
                  <span className="text-sm font-bold text-emerald-400 capitalize">{selectedProperty.status}</span>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-2.5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Property Overview & Description
                </h3>
                <div className="bg-background/40 border border-border rounded-xl p-4 sm:p-5 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedProperty.description}
                </div>
              </div>

              {/* Location Highlights Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Location Highlights & Access</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Situated in <strong>{selectedProperty.city}</strong> at <strong>{selectedProperty.address}</strong>. Direct road connectivity, clear perimeter boundaries, and verified zoning clearance ready for immediate transaction.
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="w-full sm:w-auto px-5 py-2.5 border border-border text-muted-foreground hover:text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={(e) => toggleSaveProperty(e, selectedProperty)}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      isSaved(selectedProperty.id)
                        ? "bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-500/30 border border-rose-400"
                        : "border border-border bg-card hover:bg-muted text-white"
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

      {/* Mobile Toggle FAB */}
      <div className="lg:hidden fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <button
          onClick={() => setShowMap(!showMap)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 pointer-events-auto transition-transform active:scale-95"
        >
          {showMap ? (
            <>
              <List className="w-5 h-5" />
              Show List
            </>
          ) : (
            <>
              <MapPin className="w-5 h-5" />
              Show Map
            </>
          )}
        </button>
      </div>
    </main>
  );
}
