import React from "react";
import { FileText, Eye, Download } from "lucide-react";
import PayslipModal from "./payslipModal.jsx";

const LatestPayslipCard = ({ payslip, payslipData, isPayslipOpen, onOpenPayslip, onClosePayslip, onDownloadPayslip }) => {
  const month = payslip?.month || "July 2026";
  const status = payslip?.status || "Paid";
  const creditedOn = payslip?.creditedOn || "31 Jul 2026";
  const netPay = payslip?.netPay ?? 89900;

  // Agar payslipData hook se nahi aa raha, toh payslip object ya default values se complete object bana lo
  const resolvedPayslipData = payslipData || {
    employeeName: payslip?.employeeName || "Harshit Goel",
    employeeId: payslip?.employeeId || "EMP001",
    designation: payslip?.designation || payslip?.role || "Sales Executive",
    department: payslip?.department || "Sales",
    month: month,
    basicSalary: payslip?.basicSalary || 45000,
    hra: payslip?.hra || 18000,
    allowances: payslip?.allowances || 12000,
    incentives: payslip?.incentives || payslip?.incentive || 24500,
    deductions: payslip?.deductions || {
      pf: 5400,
      professionalTax: 200,
      tds: 3600,
      other: 400,
    },
    netPay: netPay,
  };

  return (
    <div className="card p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <FileText size={14} className="text-yellow-500" />
        <h3 className="text-yellow-500 text-sm font-semibold uppercase">Latest Payslip</h3>
      </div>

      <div className="flex gap-4 items-center mb-5">
        <div className="h-14 w-14 rounded-xl bg-gradient-to-b from-[#2a2a2a] to-[#1b1b1b] border border-[#333] flex items-center justify-center shrink-0">
          <FileText size={24} className="text-yellow-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold">{month}</h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">
              {status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Salary Credited on {creditedOn}</p>
        </div>
      </div>

      <div className="border-t border-[#2a2a2a] pt-4">
        <p className="text-xs text-muted-foreground">Net Pay</p>
        <h2 className="text-5xl font-bold mt-2">₹{Number(netPay).toLocaleString("en-IN")}</h2>
      </div>

      <div className="mt-auto pt-6">
        <button 
          onClick={onOpenPayslip} 
          className="w-full mb-3 rounded-xl border border-yellow-500 bg-yellow-500/10 py-3 text-sm text-yellow-500 flex items-center justify-center gap-2 hover:bg-yellow-500/15 transition-all cursor-pointer"
        >
          <Eye size={16} /> View Payslip
        </button>
        <button 
          onClick={onDownloadPayslip} 
          className="w-full rounded-xl border border-[#2f2f2f] py-3 text-sm flex items-center justify-center gap-2 hover:bg-[#202020] transition-all cursor-pointer"
        >
          <Download size={16} /> Download PDF
        </button>
      </div>

      {/* Modal ko ab resolved data milega, toh ₹0 wali problem khatam */}
      {isPayslipOpen && <PayslipModal data={resolvedPayslipData} onClose={onClosePayslip} />}
    </div>
  );
};

export default LatestPayslipCard;