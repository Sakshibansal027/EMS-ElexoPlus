import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Users, UserCheck, Clock, UserX } from "lucide-react";

import PageHeader from "../components/PageHeader";
import AttendanceStatCard from "../components/AttendanceStatCard";
import AttendanceFilters from "../components/AttendanceFilters";
import AttendanceTable from "../components/AttendanceTable";
import { AttendanceTrendChart } from "../components/AttendanceCharts";
import AttendanceTimeline from "../components/AttendanceTimeline";
import {
  ATTENDANCE_RECORDS,
  ATTENDANCE_EMPLOYEES,
} from "../mock/attendanceRecords";
import { ATTENDANCE_STATUS } from "../config/attendanceStatus";

const ManagerAttendance = () => {
  const ctx = useOutletContext() || {};
  const managerBranch =
    ATTENDANCE_EMPLOYEES.find((e) => e.name === ctx.user?.name)?.branch ||
    "Delhi";

  const team = useMemo(
    () =>
      ATTENDANCE_EMPLOYEES.filter(
        (e) =>
          e.branch === managerBranch && e.role !== "Area Sales Manager",
      ),
    [managerBranch],
  );

  const teamIds = team.map((t) => t.id);
  const teamRecords = ATTENDANCE_RECORDS.filter((r) =>
    teamIds.includes(r.employeeId),
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [department, setDepartment] = useState("All");

  const filtered = teamRecords.filter((r) => {
    const q = search.trim().toLowerCase();
    if (
      q &&
      !r.employeeName.toLowerCase().includes(q) &&
      !r.employeeId.toLowerCase().includes(q)
    )
      return false;
    if (status !== "All" && r.status !== status) return false;
    if (department !== "All" && r.department !== department) return false;
    return true;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todays = teamRecords.filter((r) => {
    const d = new Date(r.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  const count = (s) => todays.filter((r) => r.status === s).length;
  const totals = {
    total: team.length,
    present: count(ATTENDANCE_STATUS.PRESENT),
    late: count(ATTENDANCE_STATUS.LATE),
    absent: count(ATTENDANCE_STATUS.ABSENT),
  };

  const trend = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
    day: d,
    present: Math.max(0, team.length - ((i * 2) % team.length || 0)),
    late: (i * 2) % 2,
    absent: i >= 5 ? 0 : i % 2,
  }));

  return (
    <div className="page-enter">
      <PageHeader
        title="Team Attendance"
        description={
          <>
            Monitor{" "}
            <span className="font-semibold text-primary">{managerBranch}</span>{" "}
            team attendance, approvals and late arrivals.
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <AttendanceStatCard
          label="Team Size"
          value={totals.total}
          icon={Users}
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
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceTrendChart data={trend} />
        </div>
        <AttendanceTimeline records={teamRecords} />
      </div>

      <div className="mb-6">
        <AttendanceFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          department={department}
          onDepartmentChange={setDepartment}
          departments={[...new Set(team.map((t) => t.department))]}
          branch="All"
          onBranchChange={() => {}}
          branches={[]}
        />
      </div>

      <AttendanceTable
        records={filtered}
        showActions
        onApprove={() => {}}
        onReject={() => {}}
        onView={() => {}}
      />
    </div>
  );
};

export default ManagerAttendance;
