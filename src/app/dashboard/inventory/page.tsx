"use client";

import React, { useState, useEffect, useTransition } from "react";
import { 
  Plus, 
  UploadCloud, 
  FileType, 
  CheckCircle2, 
  Building, 
  Trash2, 
  Edit3, 
  MapPin, 
  ExternalLink,
  X,
  Sparkles,
  Loader2
} from "lucide-react";
import { createProperty, updateProperty, getPublishedProperties, deleteProperty } from "@/app/actions/properties";
import Link from "next/link";
import { parseGeoCoordinates } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function InventoryPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any | null>(null);
  const [fileError, setFileError] = useState("");
  const [fileName, setFileName] = useState("");
  const [properties, setProperties] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const [createError, setCreateError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchLiveProperties = async () => {
    try {
      const res = await getPublishedProperties();
      if (res.success && res.data) {
        setProperties(res.data);
      }
    } catch (e) {
      console.error("Failed to load inventory:", e);
    }
  };

  useEffect(() => {
    fetchLiveProperties();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File exceeds 5MB maximum limit.");
      e.target.value = "";
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      setFileError("Only JPG, PNG, WEBP, and PDF files are allowed.");
      e.target.value = "";
      return;
    }

    setFileName(file.name);
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCreateError("");

    const formData = new FormData(e.currentTarget);
    const res = await createProperty(null, formData);

    setIsSubmitting(false);

    if (res.error) {
      setCreateError(res.error);
    } else if (res.success && res.data) {
      setProperties((prev) => [res.data, ...prev]);
      setIsAdding(false);
      setFileName("");
      setSuccessMsg("Property successfully published to the live portal!");
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchLiveProperties();
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateError("");

    const formData = new FormData(e.currentTarget);
    const res = await updateProperty(null, formData);

    setIsSubmitting(false);

    if (res.error) {
      setUpdateError(res.error);
    } else if (res.success && res.data) {
      setProperties((prev) =>
        prev.map((p) => (p.id === res.data.id ? res.data : p))
      );
      setEditingProperty(null);
      setSuccessMsg("Property details updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchLiveProperties();
    }
  };

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this property from the live portal?");
    if (!confirmDelete) return;

    setProperties((prev) => prev.filter((p) => p.id !== id));
    startTransition(async () => {
      await deleteProperty(id);
      await fetchLiveProperties();
    });
  };

  const getLatLngFromProp = (prop: any) => {
    const { lat, lng } = parseGeoCoordinates(prop.lat_lng, prop.city, prop.address);
    return { lat: lat.toString(), lng: lng.toString() };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Property Inventory</h1>
          <p className="text-muted-foreground text-sm">
            Manage your real estate listings. Edits and uploads reflect instantly across the public portal.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="border border-border bg-card hover:bg-muted text-white text-xs font-semibold px-3 py-2 rounded-lg inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View Public Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
          </Link>
          <button 
            onClick={() => {
              setIsAdding(!isAdding);
              setEditingProperty(null);
              setCreateError("");
            }}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
          >
            {isAdding ? "Cancel" : <><Plus className="w-4 h-4" /> Add Asset</>}
          </button>
        </div>
      </div>

      {/* Success Notification Messages */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{successMsg}</p>
        </div>
      )}

      {/* Add New Property Form */}
      {isAdding && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Upload New Property Listing
            </h2>
            <button 
              onClick={() => setIsAdding(false)}
              className="text-muted-foreground hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleAddSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Property Title</label>
                  <input name="title" required className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary" placeholder="e.g. Modern Sunset Heights Villa" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Asset Type</label>
                  <select name="type" className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary">
                    <option value="land">Land</option>
                    <option value="plot">Plot</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial Space</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Listing Price (₹ INR / Rupees)</label>
                  <input name="price" type="number" required className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary" placeholder="7500000" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Street Address</label>
                  <input name="address" required className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary" placeholder="742 Evergreen Terrace" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">City</label>
                    <input name="city" required className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary" placeholder="Hyderabad" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Publish Status</label>
                    <select name="status" className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary">
                      <option value="published">Published (Live on Public Portal)</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Latitude (Map)</label>
                    <input name="lat" type="number" step="any" defaultValue="17.3850" required className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Longitude (Map)</label>
                    <input name="lng" type="number" step="any" defaultValue="78.4867" required className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Property Size / Area</label>
                  <input name="area" className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary" placeholder="e.g. 3,500 sq ft or 2.5 Acres" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Full Description & Highlights</label>
                  <textarea name="description" rows={3} className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary resize-none" placeholder="Provide detailed information about the land or house, zoning, utilities, road access, and legal approvals..." />
                </div>
              </div>
            </div>

            {/* File Upload Zone */}
            <div className="border-t border-border pt-6">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Media & Property Photos (Max 5MB)</label>
              
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-background/50 hover:bg-muted/30 transition-colors relative">
                <input 
                  type="file" 
                  name="file"
                  onChange={handleFileChange}
                  accept=".jpg,.png,.webp,.pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                  {fileName ? (
                    <>
                      <FileType className="w-8 h-8 text-primary" />
                      <p className="font-medium text-sm text-white">{fileName}</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-muted-foreground" />
                      <p className="font-medium text-sm text-white">Click or drag property image to upload</p>
                      <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, WEBP (Max 5MB)</p>
                    </>
                  )}
                </div>
              </div>
              
              {fileError && <p className="text-red-500 text-xs mt-2 font-medium">{fileError}</p>}
              {createError && <p className="text-red-500 text-xs mt-2 font-medium">{createError}</p>}
            </div>

            <div className="flex justify-end gap-3 border-t border-border pt-4">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : "Publish Listing Live"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Property Modal / Drawer */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative custom-scrollbar animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Edit Property Listing</h2>
                  <p className="text-xs text-muted-foreground">Updates will reflect live immediately across the public homepage and map.</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingProperty(null)}
                className="w-8 h-8 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {updateError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-xs font-medium mb-4">
                {updateError}
              </div>
            )}

            {(() => {
              const { lat, lng } = getLatLngFromProp(editingProperty);
              const specs = editingProperty.specs || {};
              const selectedCategory = specs.sub_type || editingProperty.type || "house";

              return (
                <form onSubmit={handleEditSubmit} className="space-y-5">
                  {/* Hidden ID input */}
                  <input type="hidden" name="id" value={editingProperty.id} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Property Title</label>
                      <input 
                        name="title" 
                        defaultValue={editingProperty.title}
                        required 
                        className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Asset Type</label>
                      <select 
                        name="type" 
                        defaultValue={selectedCategory}
                        className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary capitalize font-medium"
                      >
                        <option value="land">Land</option>
                        <option value="plot">Plot</option>
                        <option value="house">House</option>
                        <option value="villa">Villa</option>
                        <option value="commercial">Commercial Space</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Listing Price (₹ INR / Rupees)</label>
                      <input 
                        name="price" 
                        type="number" 
                        defaultValue={editingProperty.price}
                        required 
                        className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Street Address</label>
                      <input 
                        name="address" 
                        defaultValue={editingProperty.address}
                        required 
                        className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">City</label>
                      <input 
                        name="city" 
                        defaultValue={editingProperty.city}
                        required 
                        className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Publish Status</label>
                      <select 
                        name="status" 
                        defaultValue={editingProperty.status || "published"}
                        className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
                      >
                        <option value="published">Published (Live)</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Property Size / Area</label>
                      <input 
                        name="area" 
                        defaultValue={specs.area || ""}
                        className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary" 
                        placeholder="e.g. 3,500 sq ft or 2.5 Acres"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Latitude (GPS)</label>
                      <input 
                        name="lat" 
                        type="number" 
                        step="any" 
                        defaultValue={lat}
                        required 
                        className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Longitude (GPS)</label>
                      <input 
                        name="lng" 
                        type="number" 
                        step="any" 
                        defaultValue={lng}
                        required 
                        className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary" 
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Full Description & Highlights</label>
                      <textarea 
                        name="description" 
                        rows={4} 
                        defaultValue={specs.description || ""}
                        className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:border-primary resize-none" 
                        placeholder="Provide detailed information about the land or house, zoning, utilities, road access..." 
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                    <button 
                      type="button" 
                      onClick={() => setEditingProperty(null)}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg text-sm transition-colors shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...</> : <><CheckCircle2 className="w-4 h-4" /> Save & Update Listing</>}
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* Live Properties List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white">Live Active Listings ({properties.length})</h2>
          <span className="text-xs text-muted-foreground">Click &quot;Edit&quot; to modify details or pricing</span>
        </div>

        {properties.length === 0 ? (
          <div className="border border-dashed border-border bg-card/40 rounded-xl p-12 text-center text-muted-foreground">
            <Building className="w-12 h-12 mx-auto mb-3 opacity-40 text-muted-foreground" />
            <h3 className="text-base font-semibold text-white mb-1">No custom listings uploaded yet</h3>
            <p className="text-xs max-w-sm mx-auto mb-4">
              Click &quot;Add Asset&quot; above to publish your first property live to the public user portal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((prop) => {
              const displayCategory = (prop.specs?.sub_type || prop.type || "house").toUpperCase();

              return (
                <div 
                  key={prop.id}
                  className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-primary/50 transition-colors group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {displayCategory}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        ₹{Number(prop.price).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {prop.title}
                    </h3>

                    <p className="text-xs text-muted-foreground flex items-center mb-3">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-primary flex-shrink-0" />
                      <span className="truncate">{prop.address}, {prop.city}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                    <span className="text-[10px] text-muted-foreground capitalize">
                      Status: <strong className="text-emerald-400">{prop.status}</strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingProperty(prop);
                          setIsAdding(false);
                          setUpdateError("");
                        }}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/90 bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-md font-semibold transition-colors border border-primary/20"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 py-1 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
