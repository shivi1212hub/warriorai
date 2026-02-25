import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsBar from "@/components/dashboard/StatsBar";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import CreditPoints from "@/components/dashboard/CreditPoints";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <StatsBar />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <NotificationsPanel />
          </div>
          <div>
            <CreditPoints />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
