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
import client from "../../../api/client";

const unwrap = (response) => response.data;
const mapRecord = (record) => ({
  ...record,
  id: record.payroll_id,
  employeeName: record.full_name,
  employeeId: record.employee_code,
  netPay: Number(record.net_salary || 0),
  grossPay: Number(record.gross_salary || 0),
  payPeriod: `${new Date(2000, Number(record.payroll_month || 1) - 1).toLocaleString("en", { month: "long" })} ${record.payroll_year}`,
  status: record.payroll_status === "Paid" ? "Processed" : record.payroll_status,
});
const mapStructure = (structure) => ({
  ...structure,
  id: structure.salary_structure_id,
  name: structure.structure_name,
  code: structure.structure_code,
  basicPercentage: Number(structure.basic_percentage || 0),
  hraPercentage: Number(structure.hra_percentage || 0),
  specialAllowance: Number(structure.special_allowance || 0),
  bonusType: structure.bonus_type,
  bonusValue: Number(structure.bonus_value || 0),
  assignedCount: Number(structure.assigned_count || 0),
});

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
    const manager = normalizedRole === "ADMIN" || normalizedRole === "HR";
    const [payrollResponse, dashboardResponse, structuresResponse, employeesResponse, payslipsResponse] = await Promise.all([
      client.get("/payroll").then(unwrap),
      manager ? client.get("/payroll/dashboard").then(unwrap) : Promise.resolve({ summary: {} }),
      manager ? client.get("/payroll/salary-structures?all=1").then(unwrap) : Promise.resolve({ structures: [] }),
      manager ? client.get("/reports/employees").then(unwrap) : Promise.resolve({ data: [] }),
      client.get("/payroll/my-payslips").then(unwrap),
    ]);
    const records = (payrollResponse.payrolls || []).map(mapRecord);
    const summary = payrollResponse.summary || dashboardResponse.summary || {};
    const myPayslips = payslipsResponse.payslips || [];
    const latest = myPayslips[0];
    const personalPayroll = {
      latestPayslip: latest && { month: `${new Date(2000, Number(latest.payroll_month) - 1).toLocaleString("en", { month: "long" })} ${latest.payroll_year}`, status: latest.payroll_status, creditedOn: latest.generated_at, netPay: Number(latest.net_salary || 0), pdfUrl: latest.pdf_url },
      payrollHistory: myPayslips.map((p) => ({ month: `${new Date(2000, Number(p.payroll_month) - 1).toLocaleString("en", { month: "long" })} ${p.payroll_year}`, netPay: Number(p.net_salary || 0), status: p.payroll_status, pdfUrl: p.pdf_url })),
    };
    if (manager) {
      return {
        permissions,
        metrics: [
          { id: "employees", title: "PAYROLL EMPLOYEES", value: `${summary.employee_count || 0} Employees` },
          { id: "gross", title: "GROSS PAYROLL", value: `₹${Number(summary.gross_salary || 0).toLocaleString("en-IN")}` },
          { id: "net", title: "NET PAYABLE", value: `₹${Number(summary.net_salary || 0).toLocaleString("en-IN")}` },
        ],
        records,
        summary,
        structures: (structuresResponse.structures || []).map(mapStructure),
        directory: (employeesResponse.data || []).map((e) => ({ id: e.employee_id, empId: e.employee_code, name: e.employee_name, department: e.department_name, role: e.designation_name, status: e.employee_status })),
        salaryRevisions: [], lopCases: [], reports: records, bankTransfers: [],
        personalPayroll,
      };
    }
    return { permissions, metrics: [], records, summary, directory: [], teamData: null, personalPayroll, salaryRevisions: [], lopCases: [], reports: [], bankTransfers: [], structures: [] };
        /*if (normalizedRole === "ADMIN") {
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
      }, 150);*/
  },

  // --- QUERY METHODS FOR HOOKS & WIDGETS ---

  getSalaryStructures: async () => ({ data: (await client.get("/payroll/salary-structures?all=1").then(unwrap)).structures.map(mapStructure) }),

  getEmployees: async () => ({ data: (await client.get("/reports/employees").then(unwrap)).data.map((e) => ({ id: e.employee_id, empId: e.employee_code, name: e.employee_name, department: e.department_name, role: e.designation_name })) }),

  getPayrollRecords: async () => ({ data: (await client.get("/payroll").then(unwrap)).payrolls.map(mapRecord) }),

  getPayrollSummary: async () => createMockResponse({ data: mockPayrollSummary }),

  getSalaryRevisions: async () => createMockResponse({ data: localSalaryRevisions }),

  getLopCases: async () => createMockResponse({ data: localLopCases }),

  getPayrollReports: async () => createMockResponse({ data: localReports }),

  getBankTransfers: async () => createMockResponse({ data: localBankTransfers }),

  // --- OPERATION METHODS ---

  processPayroll: async (payrollId) => client.post(`/payroll/${payrollId}/process`).then(unwrap),

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
    const payload = { structure_name: structureData.name, structure_code: structureData.code, basic_percentage: structureData.basicPercentage, hra_percentage: structureData.hraPercentage, special_allowance: structureData.specialAllowance || 0, medical_allowance: structureData.medicalAllowance || 0, conveyance_allowance: structureData.conveyanceAllowance || 0, bonus_type: structureData.bonusType || null, bonus_value: structureData.bonusValue || 0, bonus_frequency: structureData.bonusFrequency || null, status: structureData.status || "Active" };
    if (structureData.id) return client.put(`/payroll/salary-structures/${structureData.id}`, payload).then(unwrap);
    return client.post("/payroll/salary-structures", payload).then(unwrap);
    /*
    const index = localStructures.findIndex((s) => (s.id || s._id) === structureData.id);
    if (index !== -1) {
      localStructures[index] = structureData;
    } else {
      localStructures = [structureData, ...localStructures];
    }
    return createMockResponse({ success: true, data: structureData });*/
  },

  assignStructureToEmployees: async (structureId, employeeIds) => {
    return client.post(`/payroll/salary-structures/${structureId}/assignments`, { employee_ids: employeeIds, effective_from: new Date().toISOString().slice(0, 10) }).then(unwrap);
    /*
    localStructures = localStructures.map((s) => {
      if ((s.id || s._id) === structureId) {
        return { ...s, assignedEmployees: employeeIds, assignedCount: employeeIds.length };
      }
      return s;
    });
    return createMockResponse({ success: true });*/
  },

  deleteSalaryStructure: async (structureId) => {
    return client.delete(`/payroll/salary-structures/${structureId}`).then(unwrap);
    /*
    localStructures = localStructures.filter((s) => (s.id || s._id) !== structureId);
    return createMockResponse({ success: true, id: structureId });*/
  },
};

export default payrollService;
