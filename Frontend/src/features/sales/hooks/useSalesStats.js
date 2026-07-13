import { useEffect, useState } from "react";

const useSalesStats = () => {
  const [stats, setStats] = useState({
    totalASM: 0,
    totalSE: 0,
    totalSales: 0,
    targetAchieved: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setStats({
        totalASM: 12,
        totalSE: 48,
        totalSales: 24000000,
        targetAchieved: 78,
      });
      setLoading(false);
    }, 800);
  }, []);

  return { stats, loading };
};

export default useSalesStats;