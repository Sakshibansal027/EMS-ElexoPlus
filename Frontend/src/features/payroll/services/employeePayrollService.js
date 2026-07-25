import { employeePayrollMock } from "../mock/employeePayrollMock";
import { createPayrollView, createMockResponse } from "../utils/payroll";

export const employeePayrollService = {
  getPayroll: () => createMockResponse(createPayrollView(employeePayrollMock)),
};
