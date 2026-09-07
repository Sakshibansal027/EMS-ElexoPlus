import client from "../../../api/client";
import { getPayrollPermissions } from "../config/permissions/payrollPermissions";

const unwrap = (response) => response?.data ?? response;
const asNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const normalizeRole = (role) => {
  const value = String(role || "SALES_EXECUTIVE").toUpperCase();
  return value === "SE" || value === "EMPLOYEE" ? "SALES_EXECUTIVE" : value;
};

const monthLabel = (month, year) => {
  const numericMonth = asNumber(month);
  const numericYear = asNumber(year);
  if (numericMonth < 1 || numericMonth > 12 || !numericYear) return "Unknown period";

  return new Date(numericYear, numericMonth - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

const maskAccount = (accountNumber, accountLastFour) => {
  const value = String(accountLastFour || accountNumber || "").replace(/\s/g, "");
  if (!value) return "Not available";

  const lastFour = value.slice(-4);
  return "•••• " + lastFour;
};

const mapRecord = (record = {}) => ({
  ...record,
  id: record.payroll_id || record.id,
  payrollId: record.payroll_id || record.id,
  employeeId: record.employee_id,
  employeeCode: record.employee_code || record.employeeCode || "—",
  employeeName: record.full_name || record.employee_name || record.employeeName || "Unknown employee",
  department: record.department_name || record.department || "—",
  role: record.designation_name || record.designation || record.role || "—",
  payPeriod: monthLabel(record.payroll_month, record.payroll_year),
  payrollMonth: asNumber(record.payroll_month),
  payrollYear: asNumber(record.payroll_year),
  grossPay: asNumber(record.gross_salary ?? record.grossPay),
  grossSalary: asNumber(record.gross_salary ?? record.grossPay),
  netPay: asNumber(record.net_salary ?? record.netPay),
  totalIncentives: asNumber(record.total_incentives ?? record.totalIncentives),
  totalDeductions: asNumber(record.total_deductions ?? record.totalDeductions),
  attendanceDays: asNumber(record.attendance_days ?? record.attendanceDays),
  payableDays: asNumber(record.payable_days ?? record.payableDays),
  lopDays: asNumber(record.lop_days ?? record.lopDays),
  overtimeHours: asNumber(record.overtime_hours ?? record.overtimeHours),
  status: record.payroll_status || record.status || "Draft",
  verificationStatus: record.verification_status || record.verificationStatus || "Pending",
  payslipId: record.payslip_id || record.payslipId || record.payslip?.payslip_id,
  pdfUrl: record.pdf_url || record.pdfUrl || record.payslip?.pdf_url,
});

const mapStructure = (structure = {}) => {
  const specialAllowance = asNumber(structure.special_allowance ?? structure.specialAllowance);
  const medicalAllowance = asNumber(structure.medical_allowance ?? structure.medicalAllowance);
  const conveyanceAllowance = asNumber(structure.conveyance_allowance ?? structure.conveyanceAllowance);
  const bonusType = structure.bonus_type ?? structure.bonusType ?? "";
  const bonusValue = asNumber(structure.bonus_value ?? structure.bonusValue);
  const bonusFrequency = structure.bonus_frequency ?? structure.bonusFrequency ?? "";

  return {
    ...structure,
    id: structure.salary_structure_id || structure.id,
    name: structure.structure_name || structure.name || "",
    code: structure.structure_code || structure.code || "",
    basicPercentage: asNumber(structure.basic_percentage ?? structure.basicPercentage),
    hraPercentage: asNumber(structure.hra_percentage ?? structure.hraPercentage),
    specialAllowance,
    medicalAllowance,
    conveyanceAllowance,
    bonusType,
    bonusValue,
    bonusFrequency,
    allowances: {
      specialAllowance,
      medicalAllowance,
      conveyanceAllowance,
    },
    bonus: {
      type: bonusType,
      value: bonusValue,
      frequency: bonusFrequency,
    },
    assignedCount: asNumber(structure.assigned_count ?? structure.assignedCount),
    assignedEmployees: (structure.assignments || structure.assignedEmployees || []).map(
      (assignment) => assignment.employee_id || assignment.id || assignment,
    ),
  };
};

const mapRevision = (revision = {}) => ({
  ...revision,
  id: revision.salary_revision_id || revision.id,
  employeeId: revision.employee_id || revision.employeeId,
  employeeCode: revision.employee_code || revision.employeeCode || "—",
  employeeName: revision.employee_name || revision.full_name || revision.employeeName || "Unknown employee",
  department: revision.department_name || revision.department || "—",
  currentSalary: asNumber(revision.current_salary ?? revision.currentSalary),
  requestedSalary: asNumber(revision.requested_salary ?? revision.requestedSalary),
  requestedAmount: asNumber(revision.requested_salary ?? revision.requestedAmount),
  effectiveFrom: revision.effective_from || revision.effectiveFrom || "—",
  requestedDate: revision.created_at || revision.requested_at || revision.effective_from || "—",
  date: revision.effective_from || revision.created_at || "—",
  type: "Salary revision",
  description: revision.reason || "No reason provided.",
  ctc: asNumber(revision.requested_salary ?? revision.ctc),
  status: revision.status || "Pending",
});

const mapLopCase = (item = {}) => ({
  ...item,
  id: item.lop_case_id || item.id,
  employeeId: item.employee_id || item.employeeId,
  employeeCode: item.employee_code || item.employeeCode || "—",
  employeeName: item.employee_name || item.full_name || item.employeeName || "Unknown employee",
  department: item.department_name || item.department || "—",
  daysMissed: asNumber(item.days_missed ?? item.daysMissed),
  deductionAmount: asNumber(item.deduction_amount ?? item.deductionAmount),
  status: item.status || "Pending",
});

const mapReimbursement = (item = {}) => ({
  ...item,
  id: item.reimbursement_id || item.id,
  employeeId: item.employee_id || item.employeeId,
  employeeCode: item.employee_code || item.employeeCode || "—",
  employeeName: item.employee_name || item.full_name || item.employeeName || "Unknown employee",
  department: item.department_name || item.department || "—",
  type: item.expense_type || item.type || "Expense claim",
  date: item.expense_date || item.date || "—",
  amount: asNumber(item.amount),
  status: item.status || "Pending",
  notes: item.notes || "",
  payrollId: item.payroll_id || item.payrollId || null,
});

const mapTransfer = (transfer = {}) => ({
  ...transfer,
  id: transfer.payroll_bank_transfer_id || transfer.payroll_id || transfer.id,
  payrollId: transfer.payroll_id || transfer.payrollId,
  employeeId: transfer.employee_id || transfer.employeeId,
  employeeCode: transfer.employee_code || transfer.employeeCode || "—",
  name: transfer.employee_name || transfer.full_name || transfer.employeeName || "Unknown employee",
  employeeName: transfer.employee_name || transfer.full_name || transfer.employeeName || "Unknown employee",
  account: transfer.account_masked || maskAccount(transfer.account_number, transfer.account_last_four),
  ifsc: transfer.ifsc_code || transfer.ifsc || "Not available",
  bankName: transfer.bank_name || transfer.bankName || "Not available",
  amount: asNumber(transfer.amount ?? transfer.net_salary),
  payrollStatus: transfer.payroll_status || transfer.payrollStatus || "Approved",
  transferStatus: transfer.transfer_status || transfer.status || "Ready",
  isOnHold: Boolean(asNumber(transfer.is_on_hold ?? transfer.isOnHold)),
  transactionReference: transfer.transaction_reference || transfer.transactionReference || "",
});

const mapTeamIncentive = (item = {}) => {
  const assignedTarget = asNumber(item.assigned_target ?? item.assignedTarget);
  const achieved = asNumber(item.achieved);

  return {
    ...item,
    id: item.employee_id || item.id,
    employeeId: item.employee_id || item.employeeId,
    employeeCode: item.employee_code || item.employeeCode || "—",
    name: item.full_name || item.employee_name || item.name || "Unknown employee",
    zone: item.zone || "Unassigned",
    assignedTarget,
    achieved,
    earnedIncentive: asNumber(item.earned_incentive ?? item.earnedIncentive),
    achievementPct: assignedTarget > 0 ? Math.round((achieved / assignedTarget) * 10000) / 100 : 0,
  };
};

const mapPayslip = (payslip = {}) => ({
  ...payslip,
  id: payslip.payslip_id || payslip.id,
  payslipId: payslip.payslip_id || payslip.id,
  payrollId: payslip.payroll_id || payslip.payrollId,
  employeeId: payslip.employee_id || payslip.employeeId,
  employeeCode: payslip.employee_code || payslip.employeeCode || "—",
  employeeName: payslip.full_name || payslip.employee_name || payslip.employeeName || "—",
  month: monthLabel(payslip.payroll_month, payslip.payroll_year),
  payrollMonth: asNumber(payslip.payroll_month),
  payrollYear: asNumber(payslip.payroll_year),
  status: payslip.payroll_status || payslip.status || "Paid",
  creditedOn: payslip.generated_at || payslip.created_at || "—",
  grossPay: asNumber(payslip.gross_salary ?? payslip.grossPay),
  netPay: asNumber(payslip.net_salary ?? payslip.netPay),
  pdfUrl: payslip.pdf_url || payslip.pdfUrl,
});

const mapDirectoryEmployee = (employee = {}, activeHold) => ({
  ...employee,
  id: employee.employee_id || employee.id,
  employeeId: employee.employee_id || employee.id,
  empId: employee.employee_code || employee.empId || "—",
  name: employee.employee_name || employee.full_name || employee.name || "Unknown employee",
  department: employee.department_name || employee.department || "—",
  role: employee.designation_name || employee.role || "—",
  status: activeHold ? "On Hold" : (employee.employee_status || employee.status || "Active"),
  isHold: Boolean(activeHold),
  holdReason: activeHold?.reason || "",
  holdNotes: activeHold?.notes || "",
});

const periodStages = [
  { id: 1, stageNumber: "Stage 1", title: "Attendance & Draft" },
  { id: 2, stageNumber: "Stage 2", title: "Processing" },
  { id: 3, stageNumber: "Stage 3", title: "Verification" },
  { id: 4, stageNumber: "Stage 4", title: "Completed" },
];

const periodWorkflow = (periods = []) => {
  const inProgress = periods.find((period) => !["Completed", "Locked"].includes(period.status));
  const period = inProgress || periods[0] || null;
  const stageByStatus = {
    Draft: 1,
    Processing: 2,
    Verification: 3,
    Locked: 4,
    Completed: 4,
  };
  const status = period?.status || "Draft";

  return {
    stages: periodStages,
    currentStage: stageByStatus[status] || 1,
    isAttendanceFrozen: status !== "Draft",
    currentPeriodId: period?.payroll_period_id || null,
    currentPeriodStatus: status,
    currentPeriodLabel: period
      ? monthLabel(period.payroll_month, period.payroll_year)
      : "No active payroll period",
  };
};

const buildPersonalPayroll = (records, payslips, revisions, reimbursements) => {
  const sortedPayslips = [...payslips].sort(
    (left, right) => (right.payrollYear * 12 + right.payrollMonth) - (left.payrollYear * 12 + left.payrollMonth),
  );
  const latestPayslip = sortedPayslips[0] || null;
  const recordByPayrollId = new Map(records.map((record) => [record.payrollId, record]));
  const latestRecord = latestPayslip ? recordByPayrollId.get(latestPayslip.payrollId) : null;
  const payrollData = latestRecord
    ? {
        grossSalary: latestRecord.grossSalary,
        totalIncentives: latestRecord.totalIncentives,
        totalDeductions: latestRecord.totalDeductions,
        netPay: latestRecord.netPay,
      }
    : latestPayslip
      ? {
          grossSalary: latestPayslip.grossPay,
          totalIncentives: 0,
          totalDeductions: 0,
          netPay: latestPayslip.netPay,
        }
      : {};

  const history = sortedPayslips.map((payslip) => {
    const record = recordByPayrollId.get(payslip.payrollId);
    return {
      ...payslip,
      month: payslip.month,
      netPay: payslip.netPay,
      deductions: record?.totalDeductions ?? 0,
      status: payslip.status,
    };
  });

  const stats = latestPayslip
    ? [
        { id: "gross", title: "CURRENT GROSS PAY", value: "₹" + payrollData.grossSalary.toLocaleString("en-IN") },
        { id: "deductions", title: "TOTAL DEDUCTIONS", value: "₹" + payrollData.totalDeductions.toLocaleString("en-IN") },
        { id: "net", title: "CURRENT NET PAY", value: "₹" + payrollData.netPay.toLocaleString("en-IN") },
      ]
    : [];

  return {
    currentMonth: latestPayslip?.month || "No payslip available",
    stats,
    payrollData,
    payrollHistory: history,
    salaryRevisions: revisions,
    expenseReimbursements: reimbursements,
    incentiveProjection: {
      currentSales: 0,
      targetQuota: 0,
      baseIncentivePercentage: 0,
    },
    latestPayslip,
    payslipData: latestPayslip
      ? {
          ...latestPayslip,
          grossSalary: payrollData.grossSalary,
          totalIncentives: payrollData.totalIncentives,
          totalDeductions: payrollData.totalDeductions,
          netPay: payrollData.netPay,
        }
      : null,
  };
};

const getResponseMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

// Keep every Payroll UI action on one safe error-message contract.
const getErrorMessage = (error, fallback = "The payroll request could not be completed.") =>
  getResponseMessage(error, fallback);

export const payrollService = {
  getPayrollDashboardData: async (role) => {
    const normalizedRole = normalizeRole(role);
    const manager = normalizedRole === "ADMIN" || normalizedRole === "HR";
    const isAdmin = normalizedRole === "ADMIN";
    const isAsm = normalizedRole === "ASM";
    const permissions = getPayrollPermissions(normalizedRole);

    const [
      payrollResponse,
      payslipsResponse,
      revisionsResponse,
      reimbursementResponse,
      dashboardResponse,
      structuresResponse,
      employeesResponse,
      lopResponse,
      holdResponse,
      periodsResponse,
      transferResponse,
      teamResponse,
    ] = await Promise.all([
      client.get("/payroll").then(unwrap),
      client.get("/payroll/my-payslips").then(unwrap),
      client.get("/payroll/salary-revisions").then(unwrap),
      client.get("/payroll/reimbursements").then(unwrap),
      manager ? client.get("/payroll/dashboard").then(unwrap) : Promise.resolve({ summary: {} }),
      manager ? client.get("/payroll/salary-structures?all=1").then(unwrap) : Promise.resolve({ structures: [] }),
      manager ? client.get("/reports/employees").then(unwrap) : Promise.resolve({ data: [] }),
      manager ? client.get("/payroll/lop-cases").then(unwrap) : Promise.resolve({ cases: [] }),
      manager ? client.get("/payroll/holds").then(unwrap) : Promise.resolve({ holds: [] }),
      manager ? client.get("/payroll/periods").then(unwrap) : Promise.resolve({ periods: [] }),
      isAdmin ? client.get("/payroll/bank-transfers").then(unwrap) : Promise.resolve({ transfers: [] }),
      isAsm ? client.get("/payroll/team-incentives").then(unwrap) : Promise.resolve({ incentives: [] }),
    ]);

    const records = (payrollResponse.payrolls || []).map(mapRecord);
    const payslips = (payslipsResponse.payslips || []).map(mapPayslip);
    const revisions = (revisionsResponse.revisions || []).map(mapRevision);
    const reimbursements = (reimbursementResponse.reimbursements || []).map(mapReimbursement);
    const lopCases = (lopResponse.cases || []).map(mapLopCase);
    const holdsByEmployeeId = new Map(
      (holdResponse.holds || []).map((hold) => [hold.employee_id, hold]),
    );
    const directory = (employeesResponse.data || employeesResponse.employees || []).map(
      (employee) => mapDirectoryEmployee(employee, holdsByEmployeeId.get(employee.employee_id || employee.id)),
    );
    const structures = (structuresResponse.structures || []).map(mapStructure);
    const bankTransfers = (transferResponse.transfers || []).map(mapTransfer);
    const teamIncentives = (teamResponse.incentives || []).map(mapTeamIncentive);
    const workflow = periodWorkflow(periodsResponse.periods || []);
    const summary = dashboardResponse.summary || payrollResponse.summary || {};
    const personalPayroll = buildPersonalPayroll(records, payslips, revisions, reimbursements);

    const teamData = isAsm
      ? {
          stats: [
            { id: "team-members", title: "TEAM MEMBERS", value: String(teamIncentives.length) },
            {
              id: "assigned-target",
              title: "ASSIGNED TARGET",
              value: "₹" + teamIncentives.reduce((sum, item) => sum + item.assignedTarget, 0).toLocaleString("en-IN"),
            },
            {
              id: "achieved",
              title: "ACHIEVED",
              value: "₹" + teamIncentives.reduce((sum, item) => sum + item.achieved, 0).toLocaleString("en-IN"),
            },
            {
              id: "incentive",
              title: "TEAM INCENTIVES",
              value: "₹" + teamIncentives.reduce((sum, item) => sum + item.earnedIncentive, 0).toLocaleString("en-IN"),
            },
          ],
          trendData: teamIncentives.map((item) => ({
            month: item.name,
            achievement: item.achievementPct,
            incentive: Math.round((item.earnedIncentive / 100000) * 100) / 100,
          })),
          teamIncentives,
          attendanceImpact: {
            summary: {
              totalUnplannedLeaves: "0 Days",
              impactLevel: "No impact",
              crossedLopCount: 0,
            },
            records: [],
          },
          expenseReimbursements: reimbursements,
          quickReports: [
            { id: "team-incentive-summary", title: "Team Incentive Summary", data: teamIncentives },
            { id: "team-reimbursements", title: "Team Reimbursements", data: reimbursements },
          ],
        }
      : null;

    return {
      permissions,
      metrics: manager
        ? [
            { id: "employees", title: "PAYROLL EMPLOYEES", value: String(asNumber(summary.employee_count)) },
            { id: "gross", title: "GROSS PAYROLL", value: "₹" + asNumber(summary.gross_salary).toLocaleString("en-IN") },
            { id: "net", title: "NET PAYABLE", value: "₹" + asNumber(summary.net_salary).toLocaleString("en-IN") },
          ]
        : [],
      records,
      summary,
      structures,
      directory,
      salaryRevisions: revisions,
      lopCases,
      reimbursements,
      reports: records,
      bankTransfers,
      teamData,
      personalPayroll,
      ...workflow,
    };
  },

  getSalaryStructures: async () => {
    const response = await client.get("/payroll/salary-structures?all=1").then(unwrap);
    return { data: (response.structures || []).map(mapStructure) };
  },

  getSalaryStructureDetail: async (structureId) => {
    const response = await client.get("/payroll/salary-structures/" + structureId).then(unwrap);
    return {
      structure: mapStructure({
        ...(response.structure || {}),
        assignments: response.assignments || [],
      }),
      assignments: response.assignments || [],
    };
  },

  getEmployees: async () => {
    const response = await client.get("/reports/employees").then(unwrap);
    return {
      data: (response.data || response.employees || []).map((employee) =>
        mapDirectoryEmployee(employee),
      ),
    };
  },

  getPayrollRecords: async () => {
    const response = await client.get("/payroll").then(unwrap);
    return { data: (response.payrolls || []).map(mapRecord), summary: response.summary || {} };
  },

  getPayrollDetail: async (payrollId) => {
    const response = await client.get("/payroll/" + payrollId).then(unwrap);
    const payroll = mapRecord(response.payroll || {});
    const payslip = response.payslip ? mapPayslip(response.payslip) : null;
    return {
      payroll,
      incentives: response.incentives || [],
      deductions: response.deductions || [],
      payslip,
      payslipData: {
        ...payroll,
        payslipId: payslip?.payslipId,
        pdfUrl: payslip?.pdfUrl,
        grossSalary: payroll.grossSalary,
        totalIncentives: payroll.totalIncentives,
        totalDeductions: payroll.totalDeductions,
        netPay: payroll.netPay,
      },
    };
  },

  getPayrollSummary: async () => {
    const response = await client.get("/payroll").then(unwrap);
    return { data: response.summary || {} };
  },

  getSalaryRevisions: async () => {
    const response = await client.get("/payroll/salary-revisions").then(unwrap);
    return { data: (response.revisions || []).map(mapRevision) };
  },

  getLopCases: async () => {
    const response = await client.get("/payroll/lop-cases").then(unwrap);
    return { data: (response.cases || []).map(mapLopCase) };
  },

  getPayrollReports: async () => {
    const response = await client.get("/payroll/reports").then(unwrap);
    return { data: (response.records || []).map(mapRecord) };
  },

  getBankTransfers: async () => {
    const response = await client.get("/payroll/bank-transfers").then(unwrap);
    return { data: (response.transfers || []).map(mapTransfer) };
  },

  getPayrollPeriods: async () => {
    const response = await client.get("/payroll/periods").then(unwrap);
    return { data: response.periods || [] };
  },

  processPayroll: async (payrollId) =>
    client.post("/payroll/" + payrollId + "/process").then(unwrap),

  verifyPayroll: async (payrollId) =>
    client.post("/payroll/" + payrollId + "/verify").then(unwrap),

  rejectPayroll: async (payrollId) =>
    client.post("/payroll/" + payrollId + "/reject").then(unwrap),

  approvePayroll: async (payrollId) =>
    client.post("/payroll/" + payrollId + "/approve").then(unwrap),

  payPayroll: async (payrollId) =>
    client.post("/payroll/" + payrollId + "/pay").then(unwrap),

  approveSalaryRevision: async (revisionId, notes = "") =>
    client.post("/payroll/salary-revisions/" + revisionId + "/review", {
      status: "Approved",
      notes,
    }).then(unwrap),

  rejectSalaryRevision: async (revisionId, notes = "") =>
    client.post("/payroll/salary-revisions/" + revisionId + "/review", {
      status: "Rejected",
      notes,
    }).then(unwrap),

  createSalaryRevision: async (payload) =>
    client.post("/payroll/salary-revisions", payload).then(unwrap),

  resolveLopCase: async (caseId, status = "Resolved", notes = "") =>
    client.post("/payroll/lop-cases/" + caseId + "/resolve", { status, notes }).then(unwrap),

  reviewReimbursement: async (reimbursementId, status, notes = "") =>
    client.post("/payroll/reimbursements/" + reimbursementId + "/review", {
      status,
      notes,
    }).then(unwrap),

  applyReimbursement: async (reimbursementId, payrollId) =>
    client.post(
      "/payroll/reimbursements/" + reimbursementId + "/apply",
      payrollId ? { payroll_id: payrollId } : {},
    ).then(unwrap),

  createReimbursement: async (payload) =>
    client.post("/payroll/reimbursements", payload).then(unwrap),

  dispatchBankTransfer: async (payrollId, transactionReference = "") =>
    client.post("/payroll/bank-transfers/" + payrollId + "/dispatch", {
      transaction_reference: transactionReference,
    }).then(unwrap),

  freezeAttendance: async (periodId) => {
    const response = await client.get("/payroll/periods").then(unwrap);
    const period = periodId
      ? (response.periods || []).find((item) => item.payroll_period_id === periodId)
      : (response.periods || []).find((item) => item.status === "Draft");

    if (!period || period.status !== "Draft") {
      throw new Error("No draft payroll period is available to start.");
    }

    return client
      .post("/payroll/periods/" + period.payroll_period_id + "/start")
      .then(unwrap);
  },

  submitToFinance: async (periodId) => {
    const response = await client.get("/payroll/periods").then(unwrap);
    const period = periodId
      ? (response.periods || []).find((item) => item.payroll_period_id === periodId)
      : (response.periods || []).find((item) => item.status === "Processing");

    if (!period || period.status !== "Processing") {
      throw new Error("No processing payroll period is ready for verification.");
    }

    return client
      .post("/payroll/periods/" + period.payroll_period_id + "/submit")
      .then(unwrap);
  },

  updateSalaryHold: async (payload) =>
    client.put("/payroll/holds", {
      employee_id: payload.employeeId || payload.empId,
      is_hold: payload.isHold,
      reason: payload.reason,
      notes: payload.notes,
    }).then(unwrap),

  saveSalaryStructure: async (structureData) => {
    const payload = {
      structure_name: String(structureData.name || "").trim(),
      structure_code: String(structureData.code || "").trim().toUpperCase(),
      basic_percentage: asNumber(structureData.basicPercentage),
      hra_percentage: asNumber(structureData.hraPercentage),
      special_allowance: asNumber(structureData.specialAllowance),
      medical_allowance: asNumber(structureData.medicalAllowance),
      conveyance_allowance: asNumber(structureData.conveyanceAllowance),
      bonus_type: structureData.bonusType || null,
      bonus_value: asNumber(structureData.bonusValue),
      bonus_frequency: structureData.bonusFrequency || null,
      status: structureData.status || "Active",
    };

    if (structureData.id) {
      return client.put("/payroll/salary-structures/" + structureData.id, payload).then(unwrap);
    }

    return client.post("/payroll/salary-structures", payload).then(unwrap);
  },

  assignStructureToEmployees: async (structureId, employeeIds, effectiveFrom) =>
    client.post("/payroll/salary-structures/" + structureId + "/assignments", {
      employee_ids: employeeIds,
      effective_from: effectiveFrom || new Date().toISOString().slice(0, 10),
    }).then(unwrap),

  deleteSalaryStructure: async (structureId) =>
    client.delete("/payroll/salary-structures/" + structureId).then(unwrap),

  downloadPayslip: async (payslipId, fileName = "Payslip.pdf") => {
    if (!payslipId) throw new Error("This payroll does not have a generated payslip yet.");

    const response = await client.get("/payroll/payslips/" + payslipId + "/download", {
      responseType: "blob",
    });
    const objectUrl = URL.createObjectURL(
      new Blob([response.data], { type: response.headers["content-type"] || "application/pdf" }),
    );
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  },

  getErrorMessage,
};

export default payrollService;
