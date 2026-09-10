"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { MapPin, Heart, ArrowRight, X, Building2 } from "lucide-react";
import Link from "next/link";

interface SavedProperty {
  id: string | number;
  type: string;
  price: string;
  title: string;
  location?: string;
  address?: string;
  city?: string;
  stats?: string;
  image?: string;
  description?: string;
  [key: string]: any;
}

export default function SavedPage() {
  const [savedItems, setSavedItems] = useState<SavedProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<SavedProperty | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = JSON.parse(localStorage.getItem("acredesk_saved") || "[]");
      setSavedItems(saved);
    } catch (err) {
      console.error("Failed to load saved items:", err);
    }
  }, []);

  const removeSavedProperty = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    const updated = savedItems.filter((p) => String(p.id) !== String(id));
    setSavedItems(updated);
    try {
      localStorage.setItem("acredesk_saved", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to update saved items:", err);
    }
  };

  if (!mounted) return null;

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      
      <div className="max-w-7xl mx-auto w-full px-6 py-12 flex flex-col flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">
              Personal Shortlist
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-1">
              Saved Listings
            </h1>
            <p className="text-sm text-muted-foreground">
              Properties saved on this device. {savedItems.length} shortlisted {savedItems.length === 1 ? "asset" : "assets"}.
            </p>
          </div>
          <Link
            href="/"
            className="bg-card border border-border hover:bg-muted text-white text-xs font-semibold px-4 py-2.5 rounded-lg inline-flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <span>Explore All Assets</span>
            <ArrowRight className="w-3.5 h-3.5 text-primary" />
          </Link>
        </div>

        {savedItems.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-16 flex flex-col items-center justify-center text-center my-auto">
            <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 mb-4 border border-rose-500/20">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">No Saved Properties Yet</h2>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Tap the heart icon on any property card on the homepage to shortlist it for easy access later.
            </p>
            <Link 
              href="/" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-6 rounded-lg text-sm transition-colors inline-flex items-center gap-2 shadow-md shadow-primary/20"
            >
              Browse Property Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedItems.map((prop) => (
              <div 
                key={prop.id} 
                onClick={() => setSelectedProperty(prop)}
                className="bg-card border border-border rounded-xl overflow-hidden flex flex-col group relative shadow-sm hover:border-primary/60 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold tracking-wider text-white border border-white/10">
                    {prop.type || "PROPERTY"}
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={(e) => removeSavedProperty(e, prop.id)}
                    title="Remove from saved listings"
                    className="absolute top-3 right-3 z-20 p-2 bg-rose-500 hover:bg-rose-600 rounded-full text-white shadow-md shadow-rose-500/40 border border-rose-400 transition-transform hover:scale-110"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>

                  <img 
                    src={prop.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"} 
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
                      <MapPin className="w-3.5 h-3.5 mr-1 text-primary flex-shrink-0" />
                      <span className="truncate">{prop.location || `${prop.address || ""}, ${prop.city || ""}`}</span>
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">{prop.stats || prop.area || "Verified"}</span>
                    <span className="text-xs font-semibold text-primary group-hover:underline flex items-center gap-1">
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Property Details Modal */}
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
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Image */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
              <span className="absolute top-4 left-4 z-10 bg-primary/20 backdrop-blur-md text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {selectedProperty.type}
              </span>
              <img
                src={selectedProperty.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <span className="text-3xl font-extrabold text-white">{selectedProperty.price}</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedProperty.title}</h2>
                <p className="text-muted-foreground text-sm flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 text-primary flex-shrink-0" />
                  <span>{selectedProperty.location || `${selectedProperty.address || ""}, ${selectedProperty.city || ""}`}</span>
                </p>
              </div>

              {selectedProperty.description && (
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Description & Highlights</h4>
                  <p className="text-sm text-slate-300 leading-relaxed bg-background/50 border border-border/60 p-4 rounded-xl">
                    {selectedProperty.description}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                <button
                  onClick={(e) => {
                    removeSavedProperty(e, selectedProperty.id);
                    setSelectedProperty(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Remove from Saved</span>
                </button>

                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg text-sm transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2"
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
