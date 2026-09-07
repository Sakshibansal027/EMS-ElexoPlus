import { useOutletContext } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import KPISection from "../widgets/KPISection";
import useDashboard from "../hooks/useDashboard";
import AnalyticsSection from "../widgets/AnalyticsSection";
import { useNavigate } from "react-router-dom";
import TaskActivitySection from "../widgets/TaskActivitySection";
import QuickActionSection from "../widgets/QuickActionSection";
import InlineLoader from "../../../components/common/InlineLoader";

const Dashboard = () => {
  const { role, user } = useOutletContext();

  const { dashboard, loading, error, refresh } = useDashboard(role);
  const navigate = useNavigate();

  const handleHeroAction = (action) => {

    if (action.route) {
      navigate(action.route);
      return;
    }

    if (action.icon === "refresh") {
      refresh();
    }

  };

  if (!dashboard && loading) {
    return <InlineLoader message="Loading dashboard..." />;
  }

  if (error) return <div className="py-16 text-center text-red-400">{error}</div>;

  if (!dashboard) return null;

  return (
    <div className="dashboard-bg">
      <div className="space-y-10">
        <HeroBanner
          user={user}
          heroData={dashboard.hero}
          onAction={handleHeroAction}
        />
        {dashboard.permissions.showKpis && (
          <KPISection
            data={dashboard.kpis}
          />
        )}

        {dashboard.permissions.showAnalytics && (
          <AnalyticsSection
            data={dashboard.analytics}
          />
        )}

        {dashboard.permissions.showTasks && (
          <TaskActivitySection
            pending={dashboard.pending}
            activity={dashboard.activity}
          />
        )}

        {dashboard.permissions.showQuickActions && (
          <QuickActionSection
            actions={dashboard.actions}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
