import { useEffect, useMemo, useState } from "react";
import { Users, UserCheck, Clock, UserX } from "lucide-react";
import useAuth from "../../auth/hooks/useAuth";

import AttendanceStatCard from "../components/AttendanceStatCard";
import AttendanceFilters from "../components/AttendanceFilters";
import AttendanceTable from "../components/AttendanceTable";
import { AttendanceTrendChart } from "../components/AttendanceCharts";
import AttendanceTimeline from "../components/AttendanceTimeline";
import CorrectionsTable from "../components/CorrectionsTable";
import { AttendanceLoading } from "../components/AttendanceStates";

import { attendanceService } from "../services/attendanceService";
import { ATTENDANCE_STATUS } from "../config/attendanceStatus";
import { buildWeeklyTrend } from "../utils/analytics";

const FILTER_ALL = "All";
const DEFAULT_MANAGER_BRANCH = "Delhi";
const EXCLUDED_TEAM_ROLES = ["Area Sales Manager"];

const ManagerAttendance = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState([]);
  const [teamRecords, setTeamRecords] = useState([]);
  const [corrections, setCorrections] = useState([]);
  const [actionError, setActionError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(FILTER_ALL);
  const [department, setDepartment] = useState(FILTER_ALL);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const employees = await attendanceService.getEmployees();
      const me = employees.find((e) => e.name === user?.name);
      const branch = me?.branch || DEFAULT_MANAGER_BRANCH;
      const teamMembers = employees.filter(
        (e) => e.branch === branch && !EXCLUDED_TEAM_ROLES.includes(e.role),
      );
      const teamIds = teamMembers.map((t) => t.id);
      const [records, correctionRequests] = await Promise.all([
        attendanceService.getRecordsForTeam(teamIds),
        attendanceService.getCorrections(),
      ]);
      if (cancelled) return;
      setTeam(teamMembers);
      setTeamRecords(records);
      setCorrections(correctionRequests.filter((request) => request.employeeId !== me?.id));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.name]);

  const decide = async (request, decision) => {
    setActionError("");
    try {
      const updated = decision === "Approved"
        ? await attendanceService.approveCorrection(request.id)
        : await attendanceService.rejectCorrection(request.id);
      setCorrections((current) => current.map((item) => item.id === request.id ? updated : item));
    } catch (error) { setActionError(error.message || "Unable to update correction."); }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teamRecords.filter((r) => {
      if (
        q &&
        !r.employeeName.toLowerCase().includes(q) &&
        !(r.employeeCode || "").toLowerCase().includes(q)
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

  const trend = useMemo(() => buildWeeklyTrend(teamRecords), [teamRecords]);

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

      <AttendanceTable records={filtered} />

      <div className="mt-6">
        <div className="mb-4"><h2 className="section-title">Team Correction Requests</h2><p className="text-sm text-muted-foreground">Approve or reject requests assigned to you.</p></div>
        {actionError && <p className="mb-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{actionError}</p>}
        <CorrectionsTable requests={corrections} canApprove onApprove={(request) => decide(request, "Approved")} onReject={(request) => decide(request, "Rejected")} />
      </div>
    </div>
  );
};

export default ManagerAttendance;
