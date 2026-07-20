import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  Timer,
  TrendingUp,
  Plus,
  Percent,
} from "lucide-react";

import AttendanceStatCard from "../components/AttendanceStatCard";
import LiveClockCard from "../components/LiveClockCard";
import CheckInPanel from "../components/CheckInPanel";
import TodayShiftCard from "../components/TodayShiftCard";
import QuickActions from "../components/QuickActions";
import NotificationsList from "../components/NotificationsList";
import AttendanceCalendar from "../components/AttendanceCalendar";
import AttendanceTimeline from "../components/AttendanceTimeline";
import AttendanceTable from "../components/AttendanceTable";
import CorrectionsTable from "../components/CorrectionsTable";
import CorrectionModal from "../components/CorrectionModal";
import { AttendanceTrendChart } from "../components/AttendanceCharts";
import { AttendanceLoading } from "../components/AttendanceStates";

import attendanceService from "../services/attendanceService";
import { ATTENDANCE_STATUS } from "../config/attendanceStatus";

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FALLBACK_EMPLOYEE_ID = "EMP004"; // demo fallback used only when no matching user

const EmployeeAttendance = () => {
  const ctx = useOutletContext() || {};

  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [myRecords, setMyRecords] = useState([]);
  const [corrections, setCorrections] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showCorrection, setShowCorrection] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const employees = await attendanceService.getEmployees();
      const emp =
        employees.find((e) => e.name === ctx.user?.name) ||
        employees.find((e) => e.id === FALLBACK_EMPLOYEE_ID) ||
        null;

      const [records, corrs, notifs] = await Promise.all([
        emp ? attendanceService.getRecordsForEmployee(emp.id) : Promise.resolve([]),
        emp ? attendanceService.getCorrectionsForEmployee(emp.id) : Promise.resolve([]),
        attendanceService.getNotifications(),
      ]);

      if (cancelled) return;
      setEmployee(emp);
      setMyRecords(records);
      setCorrections(corrs);
      setNotifications(notifs);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [ctx.user?.name]);

  const monthly = useMemo(() => {
    const now = new Date();
    const thisMonth = myRecords.filter((r) => {
      const d = new Date(r.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
    const isPresentish = (s) =>
      [
        ATTENDANCE_STATUS.PRESENT,
        ATTENDANCE_STATUS.LATE,
        ATTENDANCE_STATUS.WFH,
      ].includes(s);

    const present = thisMonth.filter((r) => isPresentish(r.status)).length;
    const workingDays = thisMonth.filter(
      (r) => r.status !== ATTENDANCE_STATUS.WEEKEND,
    ).length;
    const late = thisMonth.filter((r) => r.status === ATTENDANCE_STATUS.LATE).length;
    const absent = thisMonth.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length;
    const totalHours = thisMonth.reduce((s, r) => s + (r.workingHours || 0), 0);
    const overtime = thisMonth.reduce((s, r) => s + (r.overtime || 0), 0);
    const percentage = workingDays
      ? Math.round((present / workingDays) * 100)
      : 0;
    return { present, workingDays, late, absent, totalHours, overtime, percentage };
  }, [myRecords]);

  const trend = useMemo(
    () =>
      WEEK_LABELS.map((d, i) => ({
        day: d,
        present: 5 + ((i * 7) % 3),
        late: (i * 3) % 2,
        absent: i === 5 || i === 6 ? 0 : (i * 2) % 2,
      })),
    [],
  );

  const submitCorrection = async (form) => {
    const created = await attendanceService.submitCorrection({ employee, form });
    setCorrections((prev) => [created, ...prev]);
  };

  if (loading) return <AttendanceLoading label="Loading your attendance…" />;

  return (
    <div className="page-enter">
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowCorrection(true)}
          className="btn-primary flex items-center gap-2 px-5 py-3 font-semibold transition-all hover:scale-105 hover:shadow-lg"
        >
          <Plus size={18} /> Request Correction
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <LiveClockCard />
        <CheckInPanel />
        <TodayShiftCard />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <AttendanceStatCard
          label="Attendance %"
          value={`${monthly.percentage}%`}
          icon={Percent}
          tone="primary"
          hint="This month"
        />
        <AttendanceStatCard label="Present" value={monthly.present} icon={ClipboardList} tone="success" />
        <AttendanceStatCard label="Late" value={monthly.late} icon={Clock} tone="warning" />
        <AttendanceStatCard label="Absent" value={monthly.absent} icon={ClipboardList} tone="danger" />
        <AttendanceStatCard
          label="Total Hours"
          value={monthly.totalHours.toFixed(1)}
          icon={Timer}
          tone="info"
        />
        <AttendanceStatCard
          label="Overtime"
          value={`${monthly.overtime.toFixed(1)}h`}
          icon={TrendingUp}
          tone="primary"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceCalendar records={myRecords} />
        </div>
        <div className="flex flex-col gap-6">
          <QuickActions />
          <NotificationsList notifications={notifications} />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceTrendChart data={trend} />
        </div>
        <AttendanceTimeline records={myRecords} />
      </div>

      <div className="mb-8">
        <div className="mb-4">
          <h2 className="section-title">Attendance History</h2>
          <p className="text-sm text-muted-foreground">
            Complete log with search, sorting and export.
          </p>
        </div>
        <AttendanceTable records={myRecords} />
      </div>

      <div className="mb-8">
        <div className="mb-4">
          <h2 className="section-title">Correction Requests</h2>
          <p className="text-sm text-muted-foreground">
            Track your pending, approved and rejected corrections.
          </p>
        </div>
        <CorrectionsTable requests={corrections} />
      </div>

      {showCorrection && (
        <CorrectionModal
          onClose={() => setShowCorrection(false)}
          onSubmit={submitCorrection}
        />
      )}
    </div>
  );
};

export default EmployeeAttendance;
