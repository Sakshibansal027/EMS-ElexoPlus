import { useState } from "react";
import { Download, FileText, Printer, FileSpreadsheet } from "lucide-react";
import { attendanceService } from "../services/attendanceService";

const columns = ["Employee Code", "Employee", "Department", "Date", "Check In", "Check Out", "Working Hours", "Status", "Remarks"];
const rowsFor = (records) => records.map((r) => [r.employeeCode || "", r.employeeName, r.department, String(r.date).slice(0, 10), r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "", r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "", r.workingHours, r.status, r.remarks || ""]);
const download = (content, type, filename) => { const url = URL.createObjectURL(new Blob([content], { type })); const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); };
const escapedCsv = (rows) => rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");

const QuickActions = ({ records: suppliedRecords = null }) => {
  const [error, setError] = useState("");
  const run = async (kind) => {
    setError("");
    try {
      const records = suppliedRecords || await attendanceService.getAllRecords();
      const rows = rowsFor(records);
      const stamp = new Date().toISOString().slice(0, 10);
      if (kind === "csv") download(escapedCsv([columns, ...rows]), "text/csv;charset=utf-8", `attendance-${stamp}.csv`);
      if (kind === "excel") download([columns, ...rows].map((row) => row.join("\t")).join("\n"), "application/vnd.ms-excel", `attendance-${stamp}.xls`);
      if (kind === "print") window.print();
      if (kind === "pdf") { window.print(); }
    } catch (requestError) { setError(requestError.message || "Unable to export attendance."); }
  };
  const actions = [{ label: "Export CSV", icon: Download, kind: "csv" }, { label: "Save as PDF", icon: FileText, kind: "pdf" }, { label: "Download Excel", icon: FileSpreadsheet, kind: "excel" }, { label: "Print Report", icon: Printer, kind: "print" }];
  return <div className="card p-6"><p className="card-title">Quick Actions</p><p className="card-subtitle">Export and print your authorized attendance data</p>{error && <p className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>}<div className="mt-5 grid grid-cols-2 gap-3">{actions.map(({ label, icon: Icon, kind }) => <button key={kind} onClick={() => run(kind)} className="flex items-center gap-2 rounded-lg border border-border bg-background-elevated px-3 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary hover:-translate-y-0.5"><Icon size={16} />{label}</button>)}</div></div>;
};
export default QuickActions;
