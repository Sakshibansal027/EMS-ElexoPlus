// src/features/sales/services/seSalesService.js
import { seMockData } from '../mock/seMockData.js';
import { salesApi } from './salesApi';

// Simulating Async API Promise Call
export const fetchSEDashboardData = async (executiveId) => {
  const [leads, orders, dashboard, targets, visits, expenses, reports] = await Promise.all([
    salesApi.listLeads({ employee_id: executiveId }),
    salesApi.orders(),
    salesApi.dashboard(),
    salesApi.targets(),
    salesApi.visits(),
    salesApi.expenses(),
    salesApi.dailyReports(),
  ]);
  const myOrders = orders.map((order) => ({
    id: order.order_id,
    customer: order.client_name || "Unknown customer",
    type: order.order_type || "B2B",
    value: Number(order.order_value || 0),
    status: order.order_status,
    date: order.order_date,
    items: Number(order.item_count || 0),
    paymentStatus: order.payment_status,
    address: order.delivery_address || "—",
  }));
  const myLeads = leads.map((lead) => ({
    ...lead,
    id: lead.id || lead.lead_id,
    leadName: lead.name || lead.lead_name,
    customer: lead.contact_person || lead.company || lead.lead_name,
    type: lead.type || lead.segment,
    stage: lead.status || "New",
    value: Number(lead.value || lead.estimated_value || 0),
    notes: lead.activities || [],
  }));
  const activeTarget = targets.find((target) => target.status === "Active") || targets[0];
  const achievement = myOrders.filter((order) => order.status === "Delivered").reduce((sum, order) => sum + order.value, 0);
  const targetValue = Number(activeTarget?.target_value || 0);
  const liveMetrics = { target: targetValue, achievement, achievementPercentage: targetValue ? Math.round((achievement / targetValue) * 100) : 0, totalOrders: myOrders.length, ordersSubText: "Orders from live database", projectedIncentive: 0, incentiveSubText: "Calculated from active target" };
  const visitsData = visits.map((visit) => ({
    ...visit,
    location: [visit.address, visit.city].filter(Boolean).join(", ") || "—",
    status: visit.outcome ? "Completed" : "Scheduled",
  }));
  return { ...seMockData, profile: { ...seMockData.profile, id: executiveId }, topMetrics: liveMetrics, performanceGauge: { target: targetValue, achieved: achievement, balance: Math.max(targetValue - achievement, 0), percentage: liveMetrics.achievementPercentage }, mockSummaryData: { ...seMockData.mockSummaryData, totalOrderValue: myOrders.reduce((sum, order) => sum + order.value, 0), totalVisits: visitsData.length, newLeads: myLeads.filter((lead) => lead.stage === "New").length, ordersCreated: myOrders.length, leadExpenses: expenses.map((expense) => ({ id: expense.expense_id, leadName: expense.description || "Sales expense", amount: Number(expense.amount || 0), category: expense.expense_type, status: expense.status })) }, myLeads, myOrders, targets, visitsData, expenses, dailyReports: reports, apiDashboard: dashboard };
};
