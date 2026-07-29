import { hrPayrollMock } from "../mock/hrPayrollMock";
import { createMockResponse, createPayrollView } from "../utils/payroll";

export const hrPayrollService = {
  getPayroll: () => createMockResponse(hrPayrollMock),
  getPersonalPayroll: () => createMockResponse(createPayrollView(hrPayrollMock.personalPayroll)),
  freezeAttendance: () => createMockResponse({ success: true, attendanceFrozen: true }, 300),
  submitToFinance: () => createMockResponse({ success: true, nextStage: 3, attendanceFrozen: true }, 300),
  updateSalaryHold: (employees, payload) => createMockResponse(
    employees.map((employee) => (
      (employee.id || employee.empId) === payload.empId
        ? {
            ...employee,
            isHold: payload.isHold,
            status: payload.isHold ? "On Hold" : "Verified",
            holdReason: payload.reason,
            holdNotes: payload.notes,
            holdUpdatedAt: payload.updatedAt,
          }
        : employee
    )),
    200,
  ),
};
