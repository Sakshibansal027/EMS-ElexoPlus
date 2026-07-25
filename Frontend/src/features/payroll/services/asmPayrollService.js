import { asmPayrollMock } from "../mock/asmPayrollMock";
import { createPayrollView, createMockResponse } from "../utils/payroll";

export const asmPayrollService = {
  getPayroll: () => createMockResponse({
    ...createPayrollView(asmPayrollMock),
    team: asmPayrollMock.dashboard,
  }),
};
