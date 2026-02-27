import { AppProvider, useAppContext } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import DashboardView from "./views/DashboardView";
import ScreeningView from "./views/ScreeningView";
import ReferralsView from "./views/ReferralsView";
import PatientsView from "./views/PatientsView";
import AnalyticsView from "./views/AnalyticsView";
import AgentView from "./views/AgentView";
import ScreenerScheduleView from "./views/ScreenerScheduleView";
import { ScreenerResourcesView } from "./views/ScreenerResourcesView";
import { PatientMyHealth, PatientMyReferrals, PatientResources, PatientMessages } from "./views/PatientPortalViews";
import { CHWFieldDashboard, CHWFieldVisits, CHWOutreach, CHWCommunityResources } from "./views/CHWPortalViews";
import { Toaster } from "sonner";

function AppContent() {
  const { activeView, setActiveView } = useAppContext();

  const renderView = () => {
    switch (activeView) {
      // Admin
      case "dashboard": return <DashboardView />;
      case "screening": return <ScreeningView />;
      case "referrals": return <ReferralsView />;
      case "patients": return <PatientsView />;
      case "analytics": return <AnalyticsView />;
      case "agent": return <AgentView />;
      // Screener
      case "my_schedule": return <ScreenerScheduleView />;
      case "my_screenings": return <ScreeningView />;
      case "resources": return <ScreenerResourcesView />;
      // Patient
      case "my_health": return <PatientMyHealth />;
      case "my_referrals": return <PatientMyReferrals />;
      case "my_resources": return <PatientResources />;
      case "my_messages": return <PatientMessages />;
      // CHW
      case "field_dashboard": return <CHWFieldDashboard />;
      case "field_visits": return <CHWFieldVisits />;
      case "outreach": return <CHWOutreach />;
      case "community_resources": return <CHWCommunityResources />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0f1a] text-gray-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1f2937', color: '#e5e7eb', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px' },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
