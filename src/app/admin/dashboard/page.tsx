import { createAdminClient } from "@/lib/supabase/server";
import DealsListView, { DealItem } from "@/components/DealsListView";
import Link from "next/link";
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Flame,
  Plus
} from "lucide-react";

export const metadata = {
  title: "CRM Deals Dashboard | LandDesk",
  description: "Internal CRM Deals management, stage tracking, and client records.",
};

const DEFAULT_DEMO_DEALS: DealItem[] = [
  {
    id: "demo-lead-1",
    name: "Vikram Malhotra",
    email: "vikram.m@gmail.com",
    phone: "+91 98450 12345",
    property: "Emerald Meadows Plot 42",
    value: "₹45,00,000",
    stage: "new",
    notes: "Interested in corner plot with east entrance.",
  },
  {
    id: "demo-lead-2",
    name: "Sarah Chen",
    email: "sarah.chen@outlook.com",
    phone: "+1 (555) 349-8291",
    property: "Azure Horizon Villa #12",
    value: "₹78,00,000",
    stage: "contacted",
    notes: "Called yesterday, requested floor plans.",
  },
  {
    id: "demo-lead-3",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@corp.in",
    phone: "+91 99801 88412",
    property: "Sunrise Commercial Tech Park",
    value: "₹1,25,00,000",
    stage: "site_visit",
    notes: "Site visit scheduled for Saturday 11 AM.",
  },
  {
    id: "demo-lead-4",
    name: "Elena Rostova",
    email: "elena.r@investments.eu",
    phone: "+44 7700 900142",
    property: "The Highland Crest Acreage",
    value: "₹32,00,000",
    stage: "negotiating",
    notes: "Reviewing title deed and survey documentation.",
  },
  {
    id: "demo-lead-5",
    name: "David Kim",
    email: "dkim@ventures.co",
    phone: "+1 (555) 892-1144",
    property: "Skyline Luxury Penthouse",
    value: "₹95,00,000",
    stage: "closed",
    notes: "Deal finalized & payment escrow completed.",
  },
];

export default async function AdminCRMDashboardPage() {
  let deals: DealItem[] = [];

  try {
    const supabaseAdmin = await createAdminClient();
    const { data: leadsData } = await supabaseAdmin
      .from("leads")
      .select("*, properties(title, price)")
      .order("created_at", { ascending: false });

    if (leadsData && leadsData.length > 0) {
      deals = leadsData.map((l: any) => ({
        id: l.id,
        name: l.customer_info?.name || "Customer Enquiry",
        email: l.customer_info?.email,
        phone: l.customer_info?.phone,
        property: l.properties?.title || l.customer_info?.notes || "General Property Inquiry",
        value: l.customer_info?.budget || (l.properties?.price ? `₹${Number(l.properties.price).toLocaleString("en-IN")}` : "TBD"),
        stage: l.stage || "new",
        notes: l.customer_info?.notes,
        date: l.created_at ? new Date(l.created_at).toLocaleDateString() : undefined,
      }));
    } else {
      deals = DEFAULT_DEMO_DEALS;
    }
  } catch (error) {
    console.error("Error fetching CRM deals:", error);
    deals = DEFAULT_DEMO_DEALS;
  }

  const newCount = deals.filter(l => l.stage === "new").length;
  const inProgressCount = deals.filter(l => ["contacted", "site_visit", "negotiating"].includes(l.stage)).length;
  const closedCount = deals.filter(l => l.stage === "closed").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">CRM Deals Management</h1>
          <p className="text-muted-foreground text-sm">
            Search customer records, update deal stages with one click, and manage closed pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory"
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-md shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Add Property Listing
          </Link>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Total Inquiries</div>
            <div className="text-xl font-bold text-white">{deals.length}</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">New Opportunities</div>
            <div className="text-xl font-bold text-white">{newCount}</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">In Active Pipeline</div>
            <div className="text-xl font-bold text-white">{inProgressCount}</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Closed Deals</div>
            <div className="text-xl font-bold text-white">{closedCount}</div>
          </div>
        </div>
      </div>

      {/* Main Deals List Section */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Deal Stages & Customer Directory</h2>
            <p className="text-xs text-muted-foreground">Select a stage dropdown to update a deal, or delete closed deals from the database.</p>
          </div>
        </div>

        <DealsListView initialDeals={deals} />
      </div>
    </div>
  );
}
