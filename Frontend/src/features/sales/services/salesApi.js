import client from "../../../api/client";

const unwrap = (response) => response.data?.data ?? response.data;

export const salesApi = {
  listLeads: (params = {}) => client.get("/sales/leads", { params }).then(unwrap),
  createLead: (payload) => client.post("/sales/leads", payload).then(unwrap),
  updateLead: (id, payload) => client.put(`/sales/leads/${id}`, payload).then(unwrap),
  addActivity: (id, payload) => client.post(`/sales/leads/${id}/activities`, payload).then(unwrap),
  dashboard: () => client.get("/sales/dashboard").then(unwrap),
  orders: () => client.get("/sales/orders").then(unwrap),
  territories: () => client.get("/sales/territories").then(unwrap),
  assignOrderTerritory: (id, territory) => client.put(`/sales/orders/${id}/territory`, { territory }).then(unwrap),
  targets: () => client.get("/sales/targets").then(unwrap),
  createTarget: (payload) => client.post("/sales/targets", payload).then(unwrap),
  visits: () => client.get("/sales/visits").then(unwrap),
  expenses: () => client.get("/sales/expenses").then(unwrap),
  dailyReports: () => client.get("/sales/daily-reports").then(unwrap),
};
