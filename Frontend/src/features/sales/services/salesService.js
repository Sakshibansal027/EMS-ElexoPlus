// src/features/sales/services/salesService.js
import { salesApi } from './salesApi';
import { fetchSEDashboardData } from './seSalesService';

export const salesService = {
  getSeDashboardData: async (executiveId) => {
    return fetchSEDashboardData(executiveId);
  },
  getAsmDashboardData: async () => {
    const [dashboard, leads, orders, targets, visits, reports] = await Promise.all([
      salesApi.dashboard(), salesApi.listLeads(), salesApi.orders(), salesApi.targets(), salesApi.visits(), salesApi.dailyReports(),
    ]);
    const deliveredByEmployee = orders.filter((order) => order.order_status === 'Delivered').reduce((all, order) => ({
      ...all,
      [order.employee_id]: (all[order.employee_id] || 0) + Number(order.order_value || 0),
    }), {});
    const latestReportByEmployee = reports.reduce((all, report) => {
      if (!all[report.employee_id]) all[report.employee_id] = report;
      return all;
    }, {});
    const sePerformanceList = targets.map((target) => {
      const report = latestReportByEmployee[target.assigned_to_employee_id];
      return {
        id: target.assigned_to_employee_id,
        name: target.employee_name || 'Sales Executive',
        territory: target.territory_name || 'Unassigned',
        target: Number(target.target_value || 0),
        achievement: Number(target.achieved_value || deliveredByEmployee[target.assigned_to_employee_id] || 0),
        feedback: report?.asm_feedback || '',
        feedbackReportId: report?.report_id || null,
      };
    });
    return {
      apiDashboard: dashboard,
      kpiStats: {
        teamTarget: Number(dashboard.summary?.target_value || 0),
        teamAchievement: Number(dashboard.summary?.achieved_value || 0),
        lowPerformanceAlerts: sePerformanceList.filter((item) => item.target > 0 && item.achievement / item.target < 0.65).length,
        activeSalesExecutives: new Set([...sePerformanceList.map((item) => item.id), ...leads.map((item) => item.assigned_employee_id)]).size,
      },
      sePerformanceList,
      leadsPipeline: leads.map((lead) => ({
        id: lead.id || lead.lead_id,
        segment: lead.segment,
        name: lead.name || lead.lead_name,
        contact: lead.contact_person || '',
        phone: lead.phone || lead.phone_number || '',
        status: lead.status || lead.current_status,
        value: Number(lead.value || lead.estimated_value || 0),
        assignedSeId: lead.assigned_employee_id,
        assignedSeName: lead.assignedTo || 'Unassigned',
      })),
      visits,
      orders,
    };
  },

  // Future API layer handle karne ke liye create lead skeleton bhi ready rakha hai
  createLead: async (leadData) => {
    return salesApi.createLead(leadData);
  },

  // Executive ko target ya lead re-assign karne ke liye endpoint configuration
  assignTargetToSe: async (seId, targetData) => salesApi.createTarget({ assigned_to_employee_id: seId, ...targetData })
};
