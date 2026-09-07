import { CheckCircle, FileText, TrendingUp } from "lucide-react";
import { useReports } from "../hooks/useReports";
import ReportStatCard from "../components/ReportStatCard";
import ReportTable from "../components/ReportTable";
import ExportOptions from "../components/ExportOptions";
import InlineLoader from "../../../components/common/InlineLoader";

const EmployeeReports = () => {
  const {
    loading, error, filteredAttendance, handleExportCSV, handleExportPDF, handlePrint,
  } = useReports();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <InlineLoader message="Loading your reports..." />
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const presentDays = filteredAttendance.filter((row) => ["Present", "Late", "WFH"].includes(row.status)).length;
  const leaveDays = filteredAttendance.filter((row) => row.status === "Leave").length;
  const averageHours = filteredAttendance.length ? (filteredAttendance.reduce((total, row) => total + Number(row.workingHours || 0), 0) / filteredAttendance.length).toFixed(1) : "0.0";

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
        <ReportStatCard label="Present Days" value={presentDays} icon={CheckCircle} tone="success" hint="From live records" />
        <ReportStatCard label="Leaves Taken" value={leaveDays} icon={FileText} tone="warning" hint="From live records" />
        <ReportStatCard label="Avg Hours" value={`${averageHours}h`} icon={TrendingUp} tone="primary" hint="From live records" />
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
