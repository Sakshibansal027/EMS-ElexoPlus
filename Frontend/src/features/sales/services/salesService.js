// src/features/sales/services/salesService.js
import { mockAsmDashboardData } from '../mock/salesData';
import { salesApi } from './salesApi';

export const salesService = {
  getSeDashboardData: async (executiveId) => {
    const { fetchSEDashboardData } = await import('./seSalesService');
    return fetchSEDashboardData(executiveId);
  },
  // ASM Dashboard generic details fetcher
  getAsmDashboardData: async () => {
    const dashboard = await salesApi.dashboard();
    return { ...mockAsmDashboardData, apiDashboard: dashboard };
  },

  // Future API layer handle karne ke liye create lead skeleton bhi ready rakha hai
  createLead: async (leadData) => {
    return salesApi.createLead(leadData);
  },

  // Executive ko target ya lead re-assign karne ke liye endpoint configuration
  assignTargetToSe: async (seId, targetData) => salesApi.createTarget({ assigned_to_employee_id: seId, ...targetData })
};
