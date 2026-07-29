import { asmPayrollMock } from "../mock/asmPayrollMock.js";
import { createPayrollView, createMockResponse } from "../utils/payroll.js";

export const asmPayrollService = {
  getPayroll: () => createMockResponse({
    ...createPayrollView(asmPayrollMock),
    team: asmPayrollMock.dashboard,
  }),
};
