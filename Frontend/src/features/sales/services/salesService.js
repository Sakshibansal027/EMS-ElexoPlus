// src/features/sales/services/salesService.js
import { mockAsmDashboardData } from '../mock/salesData';

export const salesService = {
  // ASM Dashboard generic details fetcher
  getAsmDashboardData: async (asmId) => {
    // Abhi ke liye API network delay ka mock simulation (500ms)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Baad me yahan replace hoga: const res = await axios.get(`/api/sales/asm/${asmId}`);
        resolve(mockAsmDashboardData);
      }, 500);
    });
  },

  // Future API layer handle karne ke liye create lead skeleton bhi ready rakha hai
  createLead: async (leadData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Production placeholder: const res = await axios.post('/api/sales/leads', leadData);
        resolve({ success: true, message: "Lead created successfully in service layer" });
      }, 300);
    });
  },

  // Executive ko target ya lead re-assign karne ke liye endpoint configuration
  assignTargetToSe: async (seId, targetData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Production placeholder: const res = await axios.put(`/api/sales/se/${seId}/target`, targetData);
        resolve({ success: true, message: "Target updated successfully" });
      }, 300);
    });
  }
};