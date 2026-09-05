import { useMemo } from "react";
import { Users, TrendingUp, CheckCircle, FileText, IndianRupee, Activity, Target } from "lucide-react";

import { REPORT_TABS, DEPARTMENTS, REGIONS } from "../config/reportsConfig";
import { useReports } from "../hooks/useReports";

import ReportStatCard from "../components/ReportStatCard";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";
import ExportOptions from "../components/ExportOptions";

import ReportAreaChart from "../charts/ReportAreaChart";
import ReportBarChart from "../charts/ReportBarChart";
import ReportLineChart from "../charts/ReportLineChart";
import ReportPieChart from "../charts/ReportPieChart";

const AdminReports = () => {
  const {
    activeTab, setActiveTab,
    loading, error, metrics, chartData,
    filters, setSearch, setDateFrom, setDateTo, setEmployee, setDepartment, setStatus, setRegion,
    filteredAttendance, filteredSales, filteredAsm, filteredEmployees, employeeRecords,
    handleExportCSV, handleExportPDF, handlePrint,
  } = useReports();

  const allEmployees = useMemo(() => ["All", ...Array.from(new Set(employeeRecords.map(e => e.name)))], [employeeRecords]);
  const allAsms = useMemo(() => ["All", ...Array.from(new Set(employeeRecords.filter(e => e.designation === "Area Sales Manager").map(e => e.name)))], [employeeRecords]);

  const statusDist = useMemo(() => {
    const counts = {};
    filteredAttendance.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredAttendance]);

  const asmChartData = useMemo(() => {
    const grouped = {};
    filteredAsm.forEach(r => {
      if (!grouped[r.asmName]) grouped[r.asmName] = { name: r.asmName, value: 0, count: 0 };
      grouped[r.asmName].value += r.percentage;
      grouped[r.asmName].count += 1;
    });
    return Object.values(grouped).map(g => ({ name: g.name, value: g.value / g.count }));
  }, [filteredAsm]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading reports data...</p>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!metrics || !chartData) return <div className="p-6 text-muted-foreground">No report data is available yet.</div>;

  const renderOverviewTab = () => (
    <div className="space-y-6 page-enter">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <ReportStatCard label="Total Employees" value={metrics.overview.totalEmployees} icon={Users} tone="primary" />
        <ReportStatCard label="Avg Attendance" value={`${metrics.overview.avgAttendance}%`} icon={CheckCircle} tone="success" />
        <ReportStatCard label="Sales Achievement" value={`${metrics.overview.salesAchievement}%`} icon={TrendingUp} tone="warning" />
        <ReportStatCard label="Active Reports" value={metrics.overview.activeReports} icon={FileText} tone="info" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Monthly Attendance Trend</h3>
          <ReportAreaChart data={chartData.monthlyAttendanceTrend} />
        </div>
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Sales by Category</h3>
          <ReportPieChart data={chartData.salesCategoryBreakdown} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Department Performance</h3>
          <ReportBarChart data={chartData.departmentPerformance} />
        </div>
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Monthly Sales Trend</h3>
          <ReportLineChart data={chartData.monthlySalesTrend} />
        </div>
      </div>
    </div>
  );

  const renderAttendanceTab = () => {
    const columns = [
      { key: "employeeName", label: "Employee Name" },
      { key: "employeeId", label: "ID" },
      { key: "department", label: "Department" },
      { key: "date", label: "Date" },
      { key: "checkIn", label: "Check In" },
      { key: "checkOut", label: "Check Out" },
      { key: "workingHours", label: "Working Hours" },
      { key: "status", label: "Status" },
      { key: "remarks", label: "Remarks" },
    ];

    return (
      <div className="space-y-6 page-enter">
        <ReportFilters
          showSearch
          showDates
          search={filters.search} onSearchChange={setSearch}
          dateFrom={filters.dateFrom} onDateFromChange={setDateFrom}
          dateTo={filters.dateTo} onDateToChange={setDateTo}
          employee={filters.employee} onEmployeeChange={setEmployee} employees={allEmployees}
          department={filters.department} onDepartmentChange={setDepartment} departments={["All", ...DEPARTMENTS]}
          status={filters.status} onStatusChange={setStatus} statuses={["All", "Present", "Absent", "Late", "WFH", "Leave", "Half Day"]}
        />

        <div className="flex justify-end">
          <ExportOptions
            onExportCSV={() => handleExportCSV(filteredAttendance, columns, "Attendance_Report")}
            onExportPDF={() => handleExportPDF(filteredAttendance, columns, "Attendance Report", "Attendance_Report")}
            onPrint={handlePrint}
          />
        </div>

        <ReportTable columns={columns} data={filteredAttendance} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Attendance by Department</h3>
            <ReportBarChart data={chartData.departmentPerformance} />
          </div>
          <div className="card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Status Distribution</h3>
            <ReportPieChart data={statusDist} />
          </div>
        </div>
      </div>
    );
  };

  const renderSalesTab = () => {
    const columns = [
      { key: "salesExecutive", label: "Sales Executive" },
      { key: "asm", label: "ASM" },
      { key: "region", label: "Region" },
      { key: "month", label: "Month" },
      { key: "target", label: "Target (₹)" },
      { key: "achievement", label: "Achievement (₹)" },
      { key: "percentage", label: "%" },
      { key: "rank", label: "Rank" },
      { key: "status", label: "Status" },
    ];

    return (
      <div className="space-y-6 page-enter">
        <ReportFilters
          showSearch
          search={filters.search} onSearchChange={setSearch}
          employee={filters.employee} onEmployeeChange={setEmployee} employees={allEmployees}
          region={filters.region} onRegionChange={setRegion} regions={REGIONS}
          status={filters.status} onStatusChange={setStatus} statuses={["All", "On Track", "Behind Target", "Exceeded"]}
        />

        <div className="flex justify-end">
          <ExportOptions
            onExportCSV={() => handleExportCSV(filteredSales, columns, "Sales_Report")}
            onExportPDF={() => handleExportPDF(filteredSales, columns, "Sales Report", "Sales_Report")}
            onPrint={handlePrint}
          />
        </div>

        <ReportTable columns={columns} data={filteredSales} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Region-wise Achievement %</h3>
            <ReportBarChart data={chartData.regionAchievement} />
          </div>
          <div className="card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Monthly Sales Trend</h3>
            <ReportLineChart data={chartData.monthlySalesTrend} />
          </div>
        </div>
      </div>
    );
  };

  const renderAsmTab = () => {
    const columns = [
      { key: "asmName", label: "ASM Name" },
      { key: "region", label: "Region" },
      { key: "teamSize", label: "Team Size" },
      { key: "target", label: "Target (₹)" },
      { key: "achievement", label: "Achievement (₹)" },
      { key: "percentage", label: "Ach %" },
      { key: "teamPerformance", label: "Team Perf %" },
      { key: "rank", label: "Rank" },
    ];

    return (
      <div className="space-y-6 page-enter">
        <ReportFilters
          showSearch
          search={filters.search} onSearchChange={setSearch}
          employee={filters.employee} onEmployeeChange={setEmployee} employees={allAsms}
          region={filters.region} onRegionChange={setRegion} regions={REGIONS}
        />

        <div className="flex justify-end">
          <ExportOptions
            onExportCSV={() => handleExportCSV(filteredAsm, columns, "ASM_Performance_Report")}
            onExportPDF={() => handleExportPDF(filteredAsm, columns, "ASM Performance Report", "ASM_Performance")}
            onPrint={handlePrint}
          />
        </div>

        <ReportTable columns={columns} data={filteredAsm} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">ASM Achievement Comparison</h3>
            <ReportBarChart data={asmChartData} />
          </div>
          <div className="card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Region-wise Team Distribution</h3>
            <ReportPieChart data={chartData.regionTeamDistribution} />
          </div>
        </div>
      </div>
    );
  };

  const renderEmployeeTab = () => {
    const columns = [
      { key: "id", label: "Employee ID" },
      { key: "name", label: "Name" },
      { key: "department", label: "Department" },
      { key: "designation", label: "Designation" },
      { key: "branch", label: "Branch" },
      { key: "employmentType", label: "Employment Type" },
      { key: "joiningDate", label: "Joining Date" },
      { key: "status", label: "Status" },
    ];

    return (
      <div className="space-y-6 page-enter">
        <ReportFilters
          showSearch
          search={filters.search} onSearchChange={setSearch}
          department={filters.department} onDepartmentChange={setDepartment} departments={["All", ...DEPARTMENTS]}
          status={filters.status} onStatusChange={setStatus} statuses={["All", "Active", "Inactive"]}
        />

        <div className="flex justify-end">
          <ExportOptions
            onExportCSV={() => handleExportCSV(filteredEmployees, columns, "Employee_Report")}
            onExportPDF={() => handleExportPDF(filteredEmployees, columns, "Employee Report", "Employee_Report")}
            onPrint={handlePrint}
          />
        </div>

        <ReportTable columns={columns} data={filteredEmployees} />
      </div>
    );
  };

  const renderCompanyTab = () => {
    const { companyKpis } = metrics;

    return (
      <div className="space-y-6 page-enter">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <div className="card p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-3xl font-bold text-foreground">{companyKpis.totalRevenue.value}</h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                <IndianRupee className="text-emerald-500" size={20} />
              </div>
            </div>
            <p className="mt-4 flex items-center text-sm text-emerald-500">
              <TrendingUp size={14} className="mr-1" /> {companyKpis.totalRevenue.trend} vs last month
            </p>
          </div>

          <div className="card p-6">
            <p className="text-sm font-medium text-muted-foreground">Overall Attendance</p>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-3xl font-bold text-foreground">{companyKpis.overallAttendance.value}</h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Activity className="text-primary" size={20} />
              </div>
            </div>
            <p className="mt-4 flex items-center text-sm text-primary">
              <TrendingUp size={14} className="mr-1" /> {companyKpis.overallAttendance.trend} vs last month
            </p>
          </div>

          <div className="card p-6">
            <p className="text-sm font-medium text-muted-foreground">Active Employees</p>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-3xl font-bold text-foreground">{companyKpis.activeEmployees.value}</h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10">
                <Users className="text-sky-500" size={20} />
              </div>
            </div>
            <p className="mt-4 flex items-center text-sm text-sky-500">
              <TrendingUp size={14} className="mr-1" /> {companyKpis.activeEmployees.trend} this month
            </p>
          </div>

          <div className="card p-6">
            <p className="text-sm font-medium text-muted-foreground">Customer Satisfaction</p>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-3xl font-bold text-foreground">{companyKpis.customerSatisfaction.value}</h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10">
                <Target className="text-violet-500" size={20} />
              </div>
            </div>
            <p className="mt-4 flex items-center text-sm text-violet-500">
              <TrendingUp size={14} className="mr-1" /> {companyKpis.customerSatisfaction.trend} vs last month
            </p>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">6-Month Company Performance</h3>
          <ReportAreaChart data={chartData.companyPerformanceTrend} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Department wise Attendance</h3>
            <ReportBarChart data={chartData.departmentPerformance} />
          </div>
          <div className="card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Sales Distribution</h3>
            <ReportPieChart data={chartData.salesCategoryBreakdown} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights across all modules</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border">
        {REPORT_TABS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setActiveTab(t);
              setSearch("");
              setEmployee("All");
              setDepartment("All");
              setStatus("All");
              setRegion("All");
            }}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === t
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && renderOverviewTab()}
      {activeTab === "Attendance" && renderAttendanceTab()}
      {activeTab === "Sales" && renderSalesTab()}
      {activeTab === "ASM Performance" && renderAsmTab()}
      {activeTab === "Employee" && renderEmployeeTab()}
      {activeTab === "Company" && renderCompanyTab()}
    </div>
  );
};

export default AdminReports;
