import { useOutletContext } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import HERO_DATA from "../config/heroData";

import KPI_DATA from "../config/kpiData";
import KPISection from "../widgets/KPISection";

const Dashboard = () => {
  const { role, user } = useOutletContext();
  const heroData = HERO_DATA[role];

  return (
    <div className="dashboard-bg">
      {/* Hero */}

      <HeroBanner user={user} heroData={heroData} />

      {/* KPI */}
      <KPISection data={KPI_DATA[role]} />

      {/* Charts */}

      {/* Activities */}
    </div>
  );
};

export default Dashboard;
