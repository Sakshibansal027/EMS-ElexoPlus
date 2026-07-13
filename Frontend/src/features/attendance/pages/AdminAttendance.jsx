import { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Percent,
  Home,
  Plane,
} from "lucide-react";

import AttendanceStatCard from "../components/AttendanceStatCard";
import AttendanceFilters from "../components/AttendanceFilters";
import AttendanceTable from "../components/AttendanceTable";
import CorrectionsTable from "../components/CorrectionsTable";
import QuickActions from "../components/QuickActions";
import {
  AttendanceTrendChart,
  AttendanceBreakdownChart,
  DepartmentBarChart,
} from "../components/AttendanceCharts";

import {
  ATTENDANCE_RECORDS,
  ATTENDANCE_EMPLOYEES,
  getTodayRecords,
} from "../mock/attendanceRecords";
import { CORRECTION_REQUESTS } from "../mock/corrections";
import { ATTENDANCE_STATUS, CORRECTION_STATUS } from "../config/attendanceStatus";

const TABS = ["Overview", "All Records", "Corrections", "Reports"];

const AdminAttendance = ({ title = "Attendance Management", description }) => {
  const [tab, setTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [department, setDepartment] = useState("All");
  const [branch, setBranch] = useState("All");
  const [corrections, setCorrections] = useState(CORRECTION_REQUESTS);

  const departments = useMemo(
    () => [...new Set(ATTENDANCE_EMPLOYEES.map((e) => e.department))],
    [],
  );
  const branches = useMemo(
    () => [...new Set(ATTENDANCE_EMPLOYEES.map((e) => e.branch))],
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ATTENDANCE_RECORDS.filter((r) => {
      if (
        q &&
        !r.employeeName.toLowerCase().includes(q) &&
        !r.employeeId.toLowerCase().includes(q)
      )
        return false;
      if (status !== "All" && r.status !== status) return false;
      if (department !== "All" && r.department !== department) return false;
      if (branch !== "All" && r.branch !== branch) return false;
      return true;
    });
  }, [search, status, department, branch]);

  const todays = useMemo(() => getTodayRecords(), []);
  const totals = useMemo(() => {
    const count = (s) => todays.filter((r) => r.status === s).length;
    const total = ATTENDANCE_EMPLOYEES.length;
    const present = count(ATTENDANCE_STATUS.PRESENT);
    const late = count(ATTENDANCE_STATUS.LATE);
    const absent = count(ATTENDANCE_STATUS.ABSENT);
    const wfh = count(ATTENDANCE_STATUS.WFH);
    const leave = count(ATTENDANCE_STATUS.LEAVE);
    const halfDay = count(ATTENDANCE_STATUS.HALF_DAY);
    const percentage = total
      ? Math.round(((present + late + wfh) / total) * 100)
      : 0;
    return { total, present, late, absent, wfh, leave, halfDay, percentage };
  }, [todays]);

  const breakdown = [
    { name: "Present", value: totals.present },
    { name: "Late", value: totals.late },
    { name: "WFH", value: totals.wfh },
    { name: "Half Day", value: totals.halfDay },
    { name: "Leave", value: totals.leave },
    { name: "Absent", value: totals.absent },
  ].filter((d) => d.value > 0);

  const trend = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
    day: d,
    present: 8 + ((i * 5) % 4),
    late: (i * 2) % 3,
    absent: i >= 5 ? 0 : (i * 3) % 2,
  }));

  const deptData = departments.map((d) => {
    const rec = todays.filter((r) => r.department === d);
    const p = rec.filter((r) =>
      [
        ATTENDANCE_STATUS.PRESENT,
        ATTENDANCE_STATUS.LATE,
        ATTENDANCE_STATUS.WFH,
      ].includes(r.status),
    ).length;
    return { name: d, value: rec.length ? Math.round((p / rec.length) * 100) : 0 };
  });

  const handleApproveCorrection = (r) =>
    setCorrections((prev) =>
      prev.map((c) =>
        c.id === r.id ? { ...c, status: CORRECTION_STATUS.APPROVED } : c,
      ),
    );
  const handleRejectCorrection = (r) =>
    setCorrections((prev) =>
      prev.map((c) =>
        c.id === r.id ? { ...c, status: CORRECTION_STATUS.REJECTED } : c,
      ),
    );

  return (
    <div className="page-enter">

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
        <AttendanceStatCard
          label="Total"
          value={totals.total}
          icon={Users}
          tone="default"
        />
        <AttendanceStatCard
          label="Present"
          value={totals.present}
          icon={UserCheck}
          tone="success"
        />
        <AttendanceStatCard
          label="Late"
          value={totals.late}
          icon={Clock}
          tone="warning"
        />
        <AttendanceStatCard
          label="Absent"
          value={totals.absent}
          icon={UserX}
          tone="danger"
        />
        <AttendanceStatCard
          label="Half Day"
          value={totals.halfDay}
          icon={Clock}
          tone="warning"
        />
        <AttendanceStatCard
          label="WFH"
          value={totals.wfh}
          icon={Home}
          tone="info"
        />
        <AttendanceStatCard
          label="On Leave"
          value={totals.leave}
          icon={Plane}
          tone="primary"
        />
        <AttendanceStatCard
          label="Attendance %"
          value={`${totals.percentage}%`}
          icon={Percent}
          tone="primary"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AttendanceTrendChart data={trend} />
            </div>
            <AttendanceBreakdownChart data={breakdown} />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DepartmentBarChart data={deptData} />
            </div>
            <QuickActions />
          </div>
        </div>
      )}

      {tab === "All Records" && (
        <div className="space-y-6">
          <AttendanceFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            department={department}
            onDepartmentChange={setDepartment}
            departments={departments}
            branch={branch}
            onBranchChange={setBranch}
            branches={branches}
          />
          <AttendanceTable
            records={filtered}
            showActions
            onView={() => {}}
            onEdit={() => {}}
            onApprove={() => {}}
            onReject={() => {}}
          />
        </div>
      )}

      {tab === "Corrections" && (
        <CorrectionsTable
          requests={corrections}
          canApprove
          onApprove={handleApproveCorrection}
          onReject={handleRejectCorrection}
        />
      )}

      {tab === "Reports" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DepartmentBarChart data={deptData} />
            </div>
            <AttendanceBreakdownChart data={breakdown} />
          </div>
          <QuickActions />
          <AttendanceTable records={filtered.slice(0, 50)} />
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;
