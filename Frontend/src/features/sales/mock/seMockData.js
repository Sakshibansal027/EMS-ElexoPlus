// src/features/sales/data/seMockData.js

export const seMockData = {
  profile: {
    id: "SE001",
    name: "Vikram Mehta",
    role: "Sales Executive",
    region: "North Region",
    goodEveningText: "Good Evening, Vikram Mehta",
  },
  topMetrics: {
    target: 500000,
    achievement: 410000,
    achievementPercentage: 82,
    totalOrders: 16,
    projectedIncentive: 12850,
  },
  todaysSummary: {
    checkInTime: "09:32 AM",
    checkOutTime: "06:45 PM",
    totalVisits: 5,
    newLeads: 3,
    darStatus: "Submitted",
    expenseStatus: "Submitted",
  },
  darLogs: [
    { date: "19 May 2026", submittedAt: "08:45 PM", status: "Submitted" },
    { date: "18 May 2026", submittedAt: "08:15 PM", status: "Submitted" },
    { date: "17 May 2026", submittedAt: "09:05 PM", status: "Late" },
  ],
  expenses: [
    { id: "EXP-101", date: "19 May", category: "Travel", amount: 1250, status: "Approved" },
    { id: "EXP-102", date: "18 May", category: "Client Meeting", amount: 750, status: "Approved" },
    { id: "EXP-103", date: "17 May", category: "Stationery", amount: 300, status: "Pending" },
  ],
  performanceGauge: {
    target: 500000,
    achieved: 410000,
    balance: 90000,
    percentage: 82,
  },
};