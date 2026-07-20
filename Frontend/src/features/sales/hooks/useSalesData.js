import { useState, useEffect, useMemo } from 'react';
import { salesService } from '../services/salesService';

// Temporary Mock/Auth user fetcher
const useUser = () => {
  return {
    role: "ASM", // change: ADMIN | HR | ASM | SE
    id: "ASM-992", // Real backend me login user ki ID yahan se milegi
  };
};

export const useSalesData = () => {
  const { role, id: userId } = useUser();

  // 1. Manage Dynamic Data Loading States
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Memoize Role-Based Layout Configuration
  const config = useMemo(() => {
    switch (role) {
      case "ADMIN":
        return {
          cards: ["totalASM", "totalSE", "totalSales", "targetAchievement"],
          permissions: { viewAll: true, canAssignTarget: true, canOverride: true },
        };
      case "HR":
        return {
          cards: ["activeASM", "activeSE", "performanceSummary", "monthlyAchievement"],
          permissions: { viewAll: true, canAssignTarget: true, readOnlyOps: true },
        };
      case "ASM":
        return {
          cards: ["teamTarget", "teamAchievement", "lowPerformers", "activeSE"],
          permissions: { viewTeamOnly: true, canAssignSE: true, canSetTarget: true },
        };
      case "SE":
        return {
          cards: ["myTarget", "achievement", "orders", "incentive"],
          permissions: { selfOnly: true, canCreateLead: true, canCreateOrder: true },
        };
      default:
        return { cards: [], permissions: {} };
    }
  }, [role]);

  // 3. Fetch Data from Service Layer based on User ID
  useEffect(() => {
    const fetchDashboardDetails = async () => {
      try {
        setLoading(true);
        const result = await salesService.getAsmDashboardData(userId);
        setData(result);
      } catch (err) {
        setError('Failed to fetch sales performance data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDashboardDetails();
    }
  }, [userId]);

  // 4. Return Everything cleanly to the UI Page Component
  return {
    role,
    cards: config.cards,
    permissions: config.permissions,
    data,
    loading,
    error
  };
};