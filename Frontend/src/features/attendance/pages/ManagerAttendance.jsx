import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Users, UserCheck, Clock, UserX } from "lucide-react";

import AttendanceStatCard from "../components/AttendanceStatCard";
import AttendanceFilters from "../components/AttendanceFilters";
import AttendanceTable from "../components/AttendanceTable";
import { AttendanceTrendChart } from "../components/AttendanceCharts";
import AttendanceTimeline from "../components/AttendanceTimeline";
import { AttendanceLoading } from "../components/AttendanceStates";

import attendanceService from "../services/attendanceService";
import { ATTENDANCE_STATUS } from "../config/attendanceStatus";

const FILTER_ALL = "All";
const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_MANAGER_BRANCH = "Delhi";
const EXCLUDED_TEAM_ROLES = ["Area Sales Manager"];

const ManagerAttendance = () => {
  const ctx = useOutletContext() || {};

  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState([]);
  const [teamRecords, setTeamRecords] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(FILTER_ALL);
  const [department, setDepartment] = useState(FILTER_ALL);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const employees = await attendanceService.getEmployees();
      const me = employees.find((e) => e.name === ctx.user?.name);
      const branch = me?.branch || DEFAULT_MANAGER_BRANCH;
      const teamMembers = employees.filter(
        (e) => e.branch === branch && !EXCLUDED_TEAM_ROLES.includes(e.role),
      );
      const teamIds = teamMembers.map((t) => t.id);
      const records = await attendanceService.getRecordsForTeam(teamIds);
      if (cancelled) return;
      setTeam(teamMembers);
      setTeamRecords(records);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [ctx.user?.name]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teamRecords.filter((r) => {
      if (
        q &&
        !r.employeeName.toLowerCase().includes(q) &&
        !r.employeeId.toLowerCase().includes(q)
      )
        return false;
      if (status !== FILTER_ALL && r.status !== status) return false;
      if (department !== FILTER_ALL && r.department !== department) return false;
      return true;
    });
  }, [teamRecords, search, status, department]);

  const totals = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todays = teamRecords.filter((r) => {
      const d = new Date(r.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });
    const count = (s) => todays.filter((r) => r.status === s).length;
    return {
      total: team.length,
      present: count(ATTENDANCE_STATUS.PRESENT),
      late: count(ATTENDANCE_STATUS.LATE),
      absent: count(ATTENDANCE_STATUS.ABSENT),
    };
  }, [teamRecords, team]);

  const trend = useMemo(
    () =>
      WEEK_LABELS.map((d, i) => ({
        day: d,
        present: Math.max(0, team.length - ((i * 2) % (team.length || 1))),
        late: (i * 2) % 2,
        absent: i >= 5 ? 0 : i % 2,
      })),
    [team.length],
  );

  const departments = useMemo(
    () => [...new Set(team.map((t) => t.department))],
    [team],
  );

  if (loading) return <AttendanceLoading label="Loading team attendance…" />;

  return (
    <div className="page-enter">
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <AttendanceStatCard label="Team Size" value={totals.total} icon={Users} />
        <AttendanceStatCard label="Present" value={totals.present} icon={UserCheck} tone="success" />
        <AttendanceStatCard label="Late" value={totals.late} icon={Clock} tone="warning" />
        <AttendanceStatCard label="Absent" value={totals.absent} icon={UserX} tone="danger" />
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
          departments={departments}
          branch={FILTER_ALL}
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
