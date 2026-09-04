import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
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
import { AttendanceLoading } from "../components/AttendanceStates";
import AttendanceRecordModal from "../components/AttendanceRecordModal";

import { attendanceService } from "../services/attendanceService";
import { ATTENDANCE_STATUS } from "../config/attendanceStatus";
import { buildWeeklyTrend } from "../utils/analytics";

const TABS = ["Overview", "All Records", "Corrections", "Reports"];

// Static UI defaults extracted to remove magic strings from JSX.
const FILTER_ALL = "All";

const AdminAttendance = () => {
  const [tab, setTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(FILTER_ALL);
  const [department, setDepartment] = useState(FILTER_ALL);
  const [branch, setBranch] = useState(FILTER_ALL);

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [todays, setTodays] = useState([]);
  const [corrections, setCorrections] = useState([]);
  const [actionError, setActionError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError("");
    Promise.all([
      attendanceService.getEmployees(),
      attendanceService.getAllRecords(),
      attendanceService.getTodayRecords(),
      attendanceService.getCorrections(),
    ]).then(([emps, recs, today, corrs]) => {
      if (cancelled) return;
      setEmployees(emps);
      setRecords(recs);
      setTodays(today);
      setCorrections(corrs);
    }).catch((error) => {
      if (!cancelled) setLoadError(error.message || "Unable to load organization attendance.");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const departments = useMemo(
    () => [...new Set(employees.map((e) => e.department))],
    [employees],
  );
  const branches = useMemo(
    () => [...new Set(employees.map((e) => e.branch))],
    [employees],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      if (
        q &&
        !r.employeeName.toLowerCase().includes(q) &&
        !(r.employeeCode || "").toLowerCase().includes(q)
      )
        return false;
      if (status !== FILTER_ALL && r.status !== status) return false;
      if (department !== FILTER_ALL && r.department !== department) return false;
      if (branch !== FILTER_ALL && r.branch !== branch) return false;
      return true;
    });
  }, [records, search, status, department, branch]);

  const totals = useMemo(() => {
    const count = (s) => todays.filter((r) => r.status === s).length;
    const total = employees.length;
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
  }, [todays, employees]);

  const breakdown = useMemo(
    () =>
      [
        { name: "Present", value: totals.present },
        { name: "Late", value: totals.late },
        { name: "WFH", value: totals.wfh },
        { name: "Half Day", value: totals.halfDay },
        { name: "Leave", value: totals.leave },
        { name: "Absent", value: totals.absent },
      ].filter((d) => d.value > 0),
    [totals],
  );

  const trend = useMemo(() => buildWeeklyTrend(records), [records]);

  const deptData = useMemo(
    () =>
      departments.map((d) => {
        const rec = todays.filter((r) => r.department === d);
        const p = rec.filter((r) =>
          [
            ATTENDANCE_STATUS.PRESENT,
            ATTENDANCE_STATUS.LATE,
            ATTENDANCE_STATUS.WFH,
          ].includes(r.status),
        ).length;
        return {
          name: d,
          value: rec.length ? Math.round((p / rec.length) * 100) : 0,
        };
      }),
    [departments, todays],
  );

  const handleApproveCorrection = async (r) => {
    setActionError("");
    try { const updated = await attendanceService.approveCorrection(r.id); setCorrections((prev) => prev.map((c) => (c.id === r.id ? updated : c))); }
    catch (error) { setActionError(error.message || "Unable to approve correction."); }
  };
  const handleRejectCorrection = async (r) => {
    setActionError("");
    try { const updated = await attendanceService.rejectCorrection(r.id); setCorrections((prev) => prev.map((c) => (c.id === r.id ? updated : c))); }
    catch (error) { setActionError(error.message || "Unable to reject correction."); }
  };
  const handleSaveRecord = async (id, payload) => {
    const updated = await attendanceService.updateRecord(id, payload);
    setRecords((current) => current.map((record) => record.id === id ? updated : record));
    setTodays((current) => current.map((record) => record.id === id ? updated : record));
  };

  if (loading) return <AttendanceLoading label="Loading organization attendance…" />;
  if (loadError) return <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-400">{loadError}</div>;

  return (
    <div className="page-enter">
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
        <AttendanceStatCard label="Total" value={totals.total} icon={Users} tone="default" />
        <AttendanceStatCard label="Present" value={totals.present} icon={UserCheck} tone="success" />
        <AttendanceStatCard label="Late" value={totals.late} icon={Clock} tone="warning" />
        <AttendanceStatCard label="Absent" value={totals.absent} icon={UserX} tone="danger" />
        <AttendanceStatCard label="Half Day" value={totals.halfDay} icon={Clock} tone="warning" />
        <AttendanceStatCard label="WFH" value={totals.wfh} icon={Home} tone="info" />
        <AttendanceStatCard label="On Leave" value={totals.leave} icon={Plane} tone="primary" />
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
          <AttendanceTable records={filtered} showActions onView={(record) => { setSelectedRecord(record); setEditingRecord(false); }} onEdit={(record) => { setSelectedRecord(record); setEditingRecord(true); }} />
        </div>
      )}

      {tab === "Corrections" && (
        <div className="space-y-3">
          {actionError && <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{actionError}</p>}
          <CorrectionsTable requests={corrections} canApprove onApprove={handleApproveCorrection} onReject={handleRejectCorrection} />
        </div>
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
      {selectedRecord && <AttendanceRecordModal record={selectedRecord} editable={editingRecord} onClose={() => setSelectedRecord(null)} onSave={handleSaveRecord} />}
    </div>
  );
};

export default AdminAttendance;
