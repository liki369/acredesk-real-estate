"use client";

import React, { useState, useTransition } from "react";
import { 
  Search, 
  Filter, 
  Trash2, 
  Mail, 
  Phone, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  X,
  User,
  AlertCircle
} from "lucide-react";
import { updateLeadStage, deleteLead } from "@/app/actions/leads";

export type DealItem = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  property: string;
  value: string;
  stage: "new" | "contacted" | "site_visit" | "negotiating" | "closed" | string;
  date?: string;
  notes?: string;
};

const STAGE_OPTIONS = [
  { id: "new", label: "New Enquiry", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
  { id: "contacted", label: "Contacted", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  { id: "site_visit", label: "Site Visit", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  { id: "negotiating", label: "Negotiating", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  { id: "closed", label: "Closed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
];

export default function DealsListView({ initialDeals }: { initialDeals: DealItem[] }) {
  const [deals, setDeals] = useState<DealItem[]>(initialDeals);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter deals based on search and stage
  const filteredDeals = deals.filter((deal) => {
    const matchesSearch = 
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal.email && deal.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (deal.phone && deal.phone.includes(searchQuery));

    const matchesStage = stageFilter === "all" || deal.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  const handleStageChange = (dealId: string, newStage: string) => {
    // Optimistic UI update
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );

    setUpdatingId(dealId);
    startTransition(async () => {
      if (!dealId.startsWith("demo-lead-")) {
        await updateLeadStage(dealId, newStage);
      }
      setUpdatingId(null);
    });
  };

  const handleDelete = (dealId: string) => {
    const confirmed = window.confirm("Are you sure you want to permanently remove this closed deal from the database?");
    if (!confirmed) return;

    // Optimistic UI removal
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
    setDeletingId(dealId);

    startTransition(async () => {
      if (!dealId.startsWith("demo-lead-")) {
        await deleteLead(dealId);
      }
      setDeletingId(null);
    });
  };

  const getStageBadgeStyle = (stage: string) => {
    const found = STAGE_OPTIONS.find((s) => s.id === stage);
    return found ? found.color : "bg-slate-800 text-slate-300 border-slate-700";
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/60 border border-border rounded-xl p-4 shadow-sm backdrop-blur-sm">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, property, phone, or email..."
            className="w-full bg-background/80 border border-border rounded-lg pl-10 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Stage Filter Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Filter className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-background/80 border border-border rounded-lg pl-9 pr-8 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-primary appearance-none cursor-pointer"
            >
              <option value="all">All Stages ({deals.length})</option>
              {STAGE_OPTIONS.map((opt) => {
                const count = deals.filter((d) => d.stage === opt.id).length;
                return (
                  <option key={opt.id} value={opt.id}>
                    {opt.label} ({count})
                  </option>
                );
              })}
            </select>
            <div className="absolute right-3 pointer-events-none text-xs text-muted-foreground">▼</div>
          </div>

          {(searchQuery || stageFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStageFilter("all");
              }}
              className="px-3 py-2.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors border border-primary/20"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Counter summary bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing <strong className="text-white">{filteredDeals.length}</strong> of <strong className="text-white">{deals.length}</strong> deals
        </span>
        {stageFilter !== "all" && (
          <span className="bg-card px-2.5 py-0.5 rounded-full border border-border capitalize">
            Filter: {STAGE_OPTIONS.find(s => s.id === stageFilter)?.label}
          </span>
        )}
      </div>

      {/* Deals List */}
      {filteredDeals.length === 0 ? (
        <div className="bg-card/40 border border-border border-dashed rounded-xl p-12 text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-white mb-1">No deals match your criteria</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Try adjusting your search keywords or switching the stage filter to view other deals.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStageFilter("all");
            }}
            className="px-4 py-2 bg-card border border-border hover:border-primary text-xs font-semibold text-white rounded-lg transition-colors"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="bg-card/40 border border-border rounded-xl divide-y divide-border overflow-hidden shadow-sm">
          {filteredDeals.map((deal) => {
            const isClosed = deal.stage === "closed";

            return (
              <div 
                key={deal.id} 
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-card/80 transition-colors group"
              >
                {/* Left: Customer Info */}
                <div className="flex items-start gap-3.5 min-w-[220px]">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 shadow-inner">
                    {deal.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base leading-tight group-hover:text-primary transition-colors">
                      {deal.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      {deal.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[160px]">{deal.email}</span>
                        </span>
                      )}
                      {deal.phone && (
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{deal.phone}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle: Property & Value Info */}
                <div className="flex-1 md:px-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                    <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="truncate">{deal.property}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                      {deal.value}
                    </span>
                    {deal.notes && (
                      <span className="text-muted-foreground truncate max-w-xs" title={deal.notes}>
                        📝 {deal.notes}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Stage Dropdown & Closed Delete Action */}
                <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0">
                  {/* Stage Dropdown Selector */}
                  <div className="relative">
                    <select
                      value={deal.stage}
                      onChange={(e) => handleStageChange(deal.id, e.target.value)}
                      disabled={updatingId === deal.id}
                      className={`
                        appearance-none cursor-pointer pl-3 pr-8 py-2 rounded-lg text-xs font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-primary/50
                        ${getStageBadgeStyle(deal.stage)}
                        ${updatingId === deal.id ? "opacity-50" : ""}
                      `}
                    >
                      {STAGE_OPTIONS.map((opt) => (
                        <option 
                          key={opt.id} 
                          value={opt.id}
                          className="bg-card text-foreground py-1 font-medium"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] opacity-70">
                      ▼
                    </div>
                  </div>

                  {/* Delete Option for Closed Deals */}
                  {isClosed ? (
                    <button
                      onClick={() => handleDelete(deal.id)}
                      disabled={deletingId === deal.id}
                      title="Permanently remove closed deal from database"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  ) : (
                    <div className="w-20 hidden sm:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
