import { asmPayrollMock } from "../mock/asmPayrollMock.js";
import { createPayrollView, createMockResponse } from "../utils/payroll.js";
import client from "../../../api/client";

export const asmPayrollService = {
  getPayroll: async () => {
    try {
      const response = await client.get("/payroll/my-payslips").then((r) => r.data);
      const payslips = response.payslips || [];
      const latest = payslips[0];

      const personalPayroll = {
        latestPayslip: latest ? {
          id: latest.payslip_id,
          month: `${new Date(2000, Number(latest.payroll_month) - 1).toLocaleString("en", { month: "long" })} ${latest.payroll_year}`,
          creditedOn: latest.generated_at,
          status: latest.payroll_status,
          employeeName: latest.full_name,
          employeeId: latest.employee_code,
          designation: latest.designation_name,
          department: latest.department_name,
          netPay: Number(latest.net_salary || 0),
          pdfUrl: latest.pdf_url,
        } : asmPayrollMock.latestPayslip,
        payrollHistory: payslips.map((p) => ({
          month: `${new Date(2000, Number(p.payroll_month) - 1).toLocaleString("en", { month: "long" })} ${p.payroll_year}`,
          netPay: Number(p.net_salary || 0),
          status: p.payroll_status,
          payslipId: p.payslip_id,
          deductions: Number(p.total_deductions || 0),
          pdfUrl: p.pdf_url,
        })),
      };

      return {
        ...createPayrollView({ ...asmPayrollMock, ...personalPayroll }),
        team: asmPayrollMock.dashboard,
        stats: asmPayrollMock.payroll?.stats || [],
        expenseReimbursements: asmPayrollMock.expenseReimbursements || [],
        attendanceImpact: asmPayrollMock.attendanceImpact || {},
      };
    } catch {
      return createMockResponse({
        ...createPayrollView(asmPayrollMock),
        team: asmPayrollMock.dashboard,
      });
    }
  },
};
