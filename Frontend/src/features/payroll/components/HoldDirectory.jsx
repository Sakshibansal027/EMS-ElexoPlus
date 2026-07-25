import { useState } from "react";
import { Lock, Unlock, AlertCircle, CheckCircle2, Building, ExternalLink, X } from "lucide-react";
import { formatCurrency, getEmployeeInitials, isEmployeeOnHold, getHoldButtonClass } from "../utils/payroll";

const HoldDirectory = ({ data = [], onOpenHoldModal, limit = 5 }) => {
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);

  const displayedData = isFullViewOpen ? data : data.slice(0, limit);

  return (
    <>
      <div className="card border border-zinc-800 rounded-2xl p-5 backdrop-blur-xl shadow-xl space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div>
            <h3 className="text-primary font-semibold flex items-center gap-2">
              Master Employee Payroll Directory
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Real-time payout verification, deductions breakdown, and hold actions.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
              Total: {data.length} Employees
            </span>

            {/* 🟢 VIEW ALL BUTTON */}
            {data.length > limit && (
              <button
                type="button"
                onClick={() => setIsFullViewOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[var(--color-primary,yellow)] bg-[var(--color-primary,yellow)]/10 border border-[var(--color-primary,yellow)]/30 hover:bg-[var(--color-primary,yellow)]/20 transition-all cursor-pointer"
              >
                View All <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Department & Role</th>
                <th className="px-4 py-3 font-semibold">Monthly Gross</th>
                <th className="px-4 py-3 font-semibold">Deductions</th>
                <th className="px-4 py-3 font-semibold">Net Payable</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                    No employee directory records available.
                  </td>
                </tr>
              ) : (
                displayedData.map((emp, idx) => {
                  const isOnHold = isEmployeeOnHold(emp);
                  const empId = emp.id || emp.empId || `EMP-${idx + 1}`;
                  const employeeName = emp.name || emp.employeeName || "Employee Name";
                  const designation = emp.designation || emp.role || "Specialist";
                  const department = emp.dept || emp.department || "General";

                  const initials = getEmployeeInitials(employeeName);

                  return (
                    <tr key={`${empId}-${idx}`} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs shadow-sm">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-100 text-xs">
                              {employeeName}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                              {empId}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5">
                          <div className="font-medium text-zinc-200 text-xs flex items-center gap-1.5">
                            <Building className="w-3 h-3 text-zinc-500" />
                            {department}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            {designation}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-zinc-300">
                        {formatCurrency(emp.monthlyGross || emp.grossSalary)}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-rose-400/90">
                        {emp.deductions || "- ₹0"}
                      </td>

                      <td className="px-4 py-3.5 font-mono font-bold text-emerald-400 text-xs">
                        {formatCurrency(emp.netPayable || emp.netPay)}
                      </td>

                      <td className="px-4 py-3.5">
                        {isOnHold ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            <AlertCircle className="w-3 h-3" />
                            ON HOLD
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            {emp.status || "VERIFIED"}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => onOpenHoldModal && onOpenHoldModal(emp)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border shadow-sm ${getHoldButtonClass(isOnHold)}`}
                        >
                          {isOnHold ? (
                            <>
                              <Unlock className="w-3.5 h-3.5" /> Release
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" /> Hold
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🟢 FULL DIRECTORY MODAL (On View All Click) */}
      {isFullViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <div>
                <h2 className="text-lg font-bold text-zinc-100">Full Employee Payroll Directory</h2>
                <p className="text-xs text-zinc-400">Complete view of all {data.length} records</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFullViewOpen(false)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-[11px] sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Employee</th>
                    <th className="px-4 py-3 font-semibold">Department & Role</th>
                    <th className="px-4 py-3 font-semibold">Monthly Gross</th>
                    <th className="px-4 py-3 font-semibold">Deductions</th>
                    <th className="px-4 py-3 font-semibold">Net Payable</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                  {data.map((emp, idx) => {
                    const isOnHold = isEmployeeOnHold(emp);
                    const empId = emp.id || emp.empId || `EMP-${idx + 1}`;
                    const employeeName = emp.name || emp.employeeName || "Employee Name";
                    const designation = emp.designation || emp.role || "Specialist";
                    const department = emp.dept || emp.department || "General";

                    return (
                      <tr key={`full-${empId}-${idx}`} className="hover:bg-zinc-800/40">
                        <td className="px-4 py-3">{employeeName} ({empId})</td>
                        <td className="px-4 py-3">{department} - {designation}</td>
                        <td className="px-4 py-3 font-mono">{formatCurrency(emp.monthlyGross)}</td>
                        <td className="px-4 py-3 font-mono text-rose-400">{emp.deductions || "- ₹0"}</td>
                        <td className="px-4 py-3 font-mono font-bold text-emerald-400">{formatCurrency(emp.netPayable)}</td>
                        <td className="px-4 py-3">{isOnHold ? "ON HOLD" : emp.status || "VERIFIED"}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              onOpenHoldModal && onOpenHoldModal(emp);
                            }}
                            className="px-3 py-1 rounded-lg text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                          >
                            {isOnHold ? "Release" : "Hold"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HoldDirectory;
