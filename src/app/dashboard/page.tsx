export default function DealerOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Leads</h3>
          <p className="text-3xl font-bold text-white">24</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Listings</h3>
          <p className="text-3xl font-bold text-white">12</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Pending Deals</h3>
          <p className="text-3xl font-bold text-white">3</p>
        </div>
      </div>
    </div>
  );
}
