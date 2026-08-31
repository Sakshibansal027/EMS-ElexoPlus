// src/features/sales/hooks/useSalesData.js
import { useState, useEffect, useMemo } from 'react';
import { salesService } from '../services/salesService';
import authStorage from '../../auth/utils/authStorage';

// Temporary Mock/Auth user fetcher (Change role to test: 'SE' | 'ASM' | 'HR' | 'ADMIN')
const useUser = () => {
  const storedUser = authStorage.getCurrentUser();
  return {
    role: String(storedUser?.role || window.currentUser?.role || "SE").toUpperCase(),
    id: storedUser?.employeeId || storedUser?.employee_id || storedUser?.id || "SE001",
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

  // 3. Fetch Data Dynamically from Service Layer Based on Role & User ID
  useEffect(() => {
    const fetchDashboardDetails = async () => {
      try {
        setLoading(true);
        let result = null;

        if (role === 'SE') {
          result = await salesService.getSeDashboardData(userId);
        } else if (role === 'ASM') {
          result = await salesService.getAsmDashboardData(userId);
        } else {
          result = await salesService.getAsmDashboardData(userId);
        }

        setData(result);
      } catch {
        setError('Failed to fetch sales performance data');
      } finally { // <--- Fixed line 69 here (flex -> finally)
        setLoading(false);
      }
    };

    if (userId) {
      fetchDashboardDetails();
    }
  }, [userId, role]);

  // 4. Return Everything Cleanly to UI
  return {
    role,
    cards: config.cards,
    permissions: config.permissions,
    data,
    summary: data?.mockSummaryData || null,
    visits: data?.visitsData || [],
    loading,
    error
  };
};
