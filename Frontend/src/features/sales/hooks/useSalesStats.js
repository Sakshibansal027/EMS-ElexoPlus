import { useEffect, useState } from "react";
import { salesApi } from "../services/salesApi";

const useSalesStats = () => {
  const [stats, setStats] = useState({
    totalASM: 0,
    totalSE: 0,
    totalSales: 0,
    targetAchieved: 0,
  });

  const [dashboard, setDashboard] = useState({ trend: [], regions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    salesApi.dashboard().then((data) => {
      setDashboard(data);
      setStats({ totalASM: Number(data.summary?.total_asm || 0), totalSE: Number(data.summary?.total_se || 0), totalSales: Number(data.summary?.total_sales || 0), targetAchieved: Number(data.summary?.target_achievement || 0) });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return { stats, dashboard, loading };
};

export default useSalesStats;
