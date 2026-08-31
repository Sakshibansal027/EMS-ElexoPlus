// src/features/sales/hooks/useSEDashboardData.js
import { useState, useEffect } from 'react';
import { fetchSEDashboardData } from '../services/seSalesService';

export const useSEDashboardData = (executiveId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const result = await fetchSEDashboardData(executiveId);
        setData(result);
      } catch {
        setError('Failed to sync executive metrics');
      } finally {
        setIsLoading(false);
      }
    };

    if (executiveId) {
      loadDashboard();
    }
  }, [executiveId]);

  return { data, isLoading, error };
};
