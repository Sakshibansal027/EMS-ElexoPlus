// src/features/sales/config/salesRoleConfig.js

export const SALES_ROLES = {
  ADMIN: "ADMIN",
  HR: "HR",
  ASM: "ASM",
  SE: "SE",
};

export const salesRoleConfig = {
  [SALES_ROLES.ADMIN]: {
    statsCards: [
      "totalASM",
      "totalSE",
      "totalSales",
      "overallAchievement",
    ],

    permissions: {
      customers: "ALL",
      leads: "ALL",
      orders: "ALL",
      territories: "ALL",
      performance: "ALL",
    },

    actions: [
      "assignASMTarget",
      "reassignTerritory",
      "overrideTarget",
      "exportReports",
      "viewPipeline",
      "viewCustomerDetails",
    ],
  },

  [SALES_ROLES.HR]: {
    statsCards: [
      "activeASM",
      "activeSE",
      "performanceSummary",
      "monthlyAchievement",
    ],

    permissions: {
      customers: "ALL",
      leads: "ALL",
      orders: "VIEW",
      performance: "ALL",
    },

    actions: [
      "assignASMTarget",
      "viewPerformance",
      "viewIncentives",
      "performanceReports",
      "appraisalReports",
    ],
  },

  [SALES_ROLES.ASM]: {
    statsCards: [
      "teamTarget",
      "teamAchievement",
      "lowPerformers",
      "activeSE",
    ],

    permissions: {
      customers: "TEAM",
      leads: "TEAM",
      orders: "TEAM",
      visits: "TEAM",
      performance: "TEAM",
    },

    actions: [
      "assignTerritory",
      "changeTerritory",
      "setMonthlyTarget",
      "setQuarterlyTarget",
      "generateReport",
      "viewAttendance",
      "viewLeave",
      "reviewVisits",
      "reviewLeads",
      "giveFeedback",
      "submitOperationalReport",
      "escalateIssue",
    ],
  },

  [SALES_ROLES.SE]: {
    statsCards: [
      "myTarget",
      "achievement",
      "orders",
      "incentive",
    ],

    permissions: {
      customers: "OWN",
      leads: "OWN",
      orders: "OWN",
      visits: "OWN",
      expenses: "OWN",
      performance: "OWN",
    },

    actions: [
      "addLead",
      "updateLead",
      "createOrder",
      "checkIn",
      "checkOut",
      "addVisit",
      "submitDAR",
      "submitExpense",
      "viewTarget",
      "viewIncentive",
      "viewHistory",
    ],
  },
};