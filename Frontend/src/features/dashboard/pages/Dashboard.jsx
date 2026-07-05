import { useOutletContext } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import HERO_DATA from "../config/heroData";

import KPI_DATA from "../config/kpiData";
import KPISection from "../widgets/KPISection";

import AnalyticsSection from "../widgets/AnalyticsSection";
import ANALYTICS_DATA from "../config/analyticsData";

const Dashboard = () => {
  const { role, user } = useOutletContext();
  const heroData = HERO_DATA[role];

  return (
    <div className="dashboard-bg">
      <div className="space-y-10">
        <HeroBanner user={user} heroData={heroData} />

        <KPISection data={KPI_DATA[role]} />

        <AnalyticsSection data={ANALYTICS_DATA[role]} />
      </div>
    </div>
  );
};

export default Dashboard;
