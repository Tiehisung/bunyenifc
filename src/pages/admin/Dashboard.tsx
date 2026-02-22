import TopPlayers from "./(components)/TopPlayers";
import AdminDashboardChartsSection from "./(components)/ChartsSection";
import { KeyTopStatsCards } from "./(components)/KeyTopStatsCards";

export default function AdminDashboardPage() {
  return (
    <div className="  ">
      {/* Main Content */}
      <main className="flex-1 _page px-4">
        {/* Header */}
        <div className="bg-linear-to-r from-primary via-primary/90 to-accent text-primary-foreground p-8 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black mb-2">
              CLUB MANAGEMENT & CONTROL ADMIN
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              Manage your squad, track performance, insights and analysis
            </p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="py-8 max-w-7xl mx-auto space-y-2.5">
          <KeyTopStatsCards />

          {/* Top Players */}
          <TopPlayers />

          {/* Charts Section */}
          <AdminDashboardChartsSection />
        </div>
      </main>
    </div>
  );
}
