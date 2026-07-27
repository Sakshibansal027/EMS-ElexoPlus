import { 
  ADMIN_STATS_MOCK, 
  SALARY_STRUCTURES_MOCK, 
  EMPLOYEES_MOCK,
  mockPayrollRecords,
  mockPayrollSummary,
  initialSalaryRevisions,
  initialLopCases,
  payrollReportsList,
  bankTransferBatchMock
} from "../mock/adminMock.js"; 

import { hrPayrollMock, hrStatCardsMockData } from "../mock/hrPayrollMock.js";
import { asmPayrollMock, payrollDashboardData } from "../mock/asmPayrollMock.js";
import { employeePayrollMock } from "../mock/employeePayrollMock.js";
import { createPayrollView, createMockResponse } from "../utils/payroll.js";
import { getPayrollPermissions } from "../config/permissions/payrollPermissions.js";

// In-memory mutation state for mock data
let localStructures = [...SALARY_STRUCTURES_MOCK];
let localPayrollRecords = mockPayrollRecords.map(record => ({
  incentives: 5000,
  totalWorkingDays: 22,
  daysWorked: 20,
  taxes: 4000,
  pf: 1000,
  ...record
}));

let localSalaryRevisions = [...initialSalaryRevisions];
let localLopCases = [...initialLopCases];
let localReports = [...payrollReportsList];
let localBankTransfers = [...bankTransferBatchMock];
let localHrDirectory = [...(hrPayrollMock.directoryEmployees || EMPLOYEES_MOCK)];

const normalizeRole = (role) => {
  const upper = String(role || "SALES_EXECUTIVE").toUpperCase();
  if (upper === "SE" || upper === "EMPLOYEE") return "SALES_EXECUTIVE";
  return upper;
};

export const payrollService = {
  /**
   * Fetch role-filtered dashboard data.
   * Service decides data visibility according to role.
   */
  getPayrollDashboardData: async (role, userId) => {
    const normalizedRole = normalizeRole(role);
    const permissions = getPayrollPermissions(normalizedRole);

    return new Promise((resolve) => {
      setTimeout(() => {
        if (normalizedRole === "ADMIN") {
          const stats = ADMIN_STATS_MOCK.map((stat) => {
            if (stat.title === "SALARY REVISION PENDING") {
              return { ...stat, value: `${localSalaryRevisions.length} Requests` };
            }
            if (stat.title === "LOP CASES") {
              return { ...stat, value: `${localLopCases.length} Employees` };
            }
            return stat;
          });

          resolve({
            permissions,
            metrics: stats,
            directory: EMPLOYEES_MOCK,
            records: localPayrollRecords,
            summary: mockPayrollSummary,
            salaryRevisions: localSalaryRevisions,
            lopCases: localLopCases,
            reports: localReports,
            bankTransfers: localBankTransfers,
            structures: localStructures,
            personalPayroll: createPayrollView(employeePayrollMock),
          });
        } else if (normalizedRole === "HR") {
          resolve({
            permissions,
            metrics: hrStatCardsMockData || hrPayrollMock.statsData,
            directory: localHrDirectory,
            stages: hrPayrollMock.stages,
            currentStage: hrPayrollMock.currentStage,
            exceptions: hrPayrollMock.exceptions,
            complianceData: hrPayrollMock.complianceData,
            departmentLiability: hrPayrollMock.departmentLiability,
            joiningExitData: hrPayrollMock.joiningExitData,
            personalPayroll: createPayrollView(hrPayrollMock.personalPayroll || employeePayrollMock),
          });
        } else if (normalizedRole === "ASM") {
          const teamData = {
            stats: payrollDashboardData.stats || asmPayrollMock.dashboard?.stats || [],
            trendData: payrollDashboardData.trendData || asmPayrollMock.dashboard?.trendData || [],
            teamIncentives: payrollDashboardData.teamIncentives || asmPayrollMock.dashboard?.teamIncentives || [],
            attendanceImpact: payrollDashboardData.attendanceImpact || asmPayrollMock.dashboard?.attendanceImpact || [],
            expenseReimbursements: payrollDashboardData.expenseReimbursements || asmPayrollMock.dashboard?.expenseReimbursements || [],
            quickReports: asmPayrollMock.dashboard?.quickReports || asmPayrollMock.quickReports || payrollDashboardData.quickReports || [],
          };

          resolve({
            permissions,
            metrics: teamData.stats,
            teamData,
            personalPayroll: createPayrollView(asmPayrollMock),
          });
        } else {
          // SALES_EXECUTIVE / SE / Employee default
          resolve({
            permissions,
            metrics: [],
            teamData: null,
            directory: [],
            personalPayroll: createPayrollView(employeePayrollMock),
          });
        }
      }, 150);
    });
  },

  // --- QUERY METHODS FOR HOOKS & WIDGETS ---

  getSalaryStructures: async () => createMockResponse(localStructures),

  getEmployees: async () => createMockResponse(EMPLOYEES_MOCK),

  getPayrollRecords: async () => createMockResponse({ data: localPayrollRecords }),

  getPayrollSummary: async () => createMockResponse({ data: mockPayrollSummary }),

  getSalaryRevisions: async () => createMockResponse({ data: localSalaryRevisions }),

  getLopCases: async () => createMockResponse({ data: localLopCases }),

  getPayrollReports: async () => createMockResponse({ data: localReports }),

  getBankTransfers: async () => createMockResponse({ data: localBankTransfers }),

  // --- OPERATION METHODS ---

  processPayroll: async (payrollId) => {
    localPayrollRecords = localPayrollRecords.map((record) =>
      record.id === payrollId ? { ...record, status: "Processed" } : record
    );
    return createMockResponse({ success: true, id: payrollId, status: "Processed" });
  },

  approveSalaryRevision: async (revisionId) => {
    localSalaryRevisions = localSalaryRevisions.filter((item) => item.id !== revisionId);
    return createMockResponse({ success: true, id: revisionId });
  },

  rejectSalaryRevision: async (revisionId) => {
    localSalaryRevisions = localSalaryRevisions.filter((item) => item.id !== revisionId);
    return createMockResponse({ success: true, id: revisionId });
  },

  resolveLopCase: async (caseId) => {
    localLopCases = localLopCases.filter((item) => item.id !== caseId);
    return createMockResponse({ success: true, id: caseId });
  },

  freezeAttendance: async () => {
    return createMockResponse({ success: true, attendanceFrozen: true });
  },

  submitToFinance: async () => {
    return createMockResponse({ success: true, nextStage: 3, attendanceFrozen: true });
  },

  updateSalaryHold: async (employees, payload) => {
    localHrDirectory = localHrDirectory.map((emp) =>
      (emp.id || emp.empId) === payload.empId
        ? {
            ...emp,
            isHold: payload.isHold,
            status: payload.isHold ? "On Hold" : "Verified",
            holdReason: payload.reason,
            holdNotes: payload.notes,
            holdUpdatedAt: payload.updatedAt,
          }
        : emp
    );
    return createMockResponse(localHrDirectory);
  },

  saveSalaryStructure: async (structureData) => {
    const index = localStructures.findIndex((s) => (s.id || s._id) === structureData.id);
    if (index !== -1) {
      localStructures[index] = structureData;
    } else {
      localStructures = [structureData, ...localStructures];
    }
    return createMockResponse({ success: true, data: structureData });
  },

  assignStructureToEmployees: async (structureId, employeeIds) => {
    localStructures = localStructures.map((s) => {
      if ((s.id || s._id) === structureId) {
        return { ...s, assignedEmployees: employeeIds, assignedCount: employeeIds.length };
      }
      return s;
    });
    return createMockResponse({ success: true });
  },

  deleteSalaryStructure: async (structureId) => {
    localStructures = localStructures.filter((s) => (s.id || s._id) !== structureId);
    return createMockResponse({ success: true, id: structureId });
  },
};

export default payrollService;
