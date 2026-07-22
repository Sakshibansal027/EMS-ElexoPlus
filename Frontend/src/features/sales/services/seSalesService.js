// src/features/sales/services/seSalesService.js
import { seMockData } from '../mock/seMockData.js';

// Simulating Async API Promise Call
export const fetchSEDashboardData = async (executiveId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Future API: axios.get(`/api/v1/sales/se-dashboard/${executiveId}`)
      resolve(seMockData);
    }, 300);
  });
};