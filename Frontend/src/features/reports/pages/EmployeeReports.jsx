import { CheckCircle, FileText, TrendingUp } from "lucide-react";
import { useReports } from "../hooks/useReports";
import ReportStatCard from "../components/ReportStatCard";
import ReportTable from "../components/ReportTable";
import ExportOptions from "../components/ExportOptions";

const EmployeeReports = () => {
  const {
    loading, metrics, filteredAttendance, handleExportCSV, handleExportPDF, handlePrint,
  } = useReports();

  if (loading || !metrics) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading your reports...</p>
        </div>
      </div>
    );
  }

  const columns = [
    { key: "date", label: "Date" },
    { key: "checkIn", label: "Check In" },
    { key: "checkOut", label: "Check Out" },
    { key: "workingHours", label: "Working Hours" },
    { key: "status", label: "Status" },
    { key: "remarks", label: "Remarks" },
  ];

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Reports</h1>
          <p className="text-muted-foreground">View your attendance and performance history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ReportStatCard label="Present Days" value={22} icon={CheckCircle} tone="success" hint="This month" />
        <ReportStatCard label="Leaves Taken" value={2} icon={FileText} tone="warning" hint="This month" />
        <ReportStatCard label="Avg Hours" value={"8.5h"} icon={TrendingUp} tone="primary" hint="This month" />
      </div>

      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Recent Attendance</h3>
          <ExportOptions
            onExportCSV={() => handleExportCSV(filteredAttendance, columns, "My_Attendance")}
            onExportPDF={() => handleExportPDF(filteredAttendance, columns, "My Attendance Report", "My_Attendance")}
            onPrint={handlePrint}
          />
        </div>
        <ReportTable columns={columns} data={filteredAttendance.slice(0, 30)} />
      </div>
    </div>
  );
};

export default EmployeeReports;
