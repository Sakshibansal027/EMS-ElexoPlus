import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  Timer,
  TrendingUp,
  Plus,
  Percent,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
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

import { ATTENDANCE_RECORDS, ATTENDANCE_EMPLOYEES } from "../mock/attendanceRecords";
import { CORRECTION_REQUESTS } from "../mock/corrections";
import { ATTENDANCE_STATUS, CORRECTION_STATUS } from "../config/attendanceStatus";

const EmployeeAttendance = () => {
  const ctx = useOutletContext() || {};
  // Bind mock records to the logged-in user, falling back to a demo employee
  const empId =
    ATTENDANCE_EMPLOYEES.find((e) => e.name === ctx.user?.name)?.id || "EMP004";
  const employee = ATTENDANCE_EMPLOYEES.find((e) => e.id === empId);

  const myRecords = useMemo(
    () => ATTENDANCE_RECORDS.filter((r) => r.employeeId === empId),
    [empId],
  );

  const [showCorrection, setShowCorrection] = useState(false);
  const [corrections, setCorrections] = useState(
    CORRECTION_REQUESTS.filter((c) => c.employeeId === empId),
  );

  const monthly = useMemo(() => {
    const now = new Date();
    const thisMonth = myRecords.filter((r) => {
      const d = new Date(r.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
    const present = thisMonth.filter((r) =>
      [
        ATTENDANCE_STATUS.PRESENT,
        ATTENDANCE_STATUS.LATE,
        ATTENDANCE_STATUS.WFH,
      ].includes(r.status),
    ).length;
    const workingDays = thisMonth.filter(
      (r) => r.status !== ATTENDANCE_STATUS.WEEKEND,
    ).length;
    const late = thisMonth.filter((r) => r.status === ATTENDANCE_STATUS.LATE)
      .length;
    const absent = thisMonth.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT)
      .length;
    const totalHours = thisMonth.reduce((s, r) => s + (r.workingHours || 0), 0);
    const overtime = thisMonth.reduce((s, r) => s + (r.overtime || 0), 0);
    const percentage = workingDays
      ? Math.round((present / workingDays) * 100)
      : 0;
    return { present, workingDays, late, absent, totalHours, overtime, percentage };
  }, [myRecords]);

  const trend = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((d, i) => ({
      day: d,
      present: 5 + ((i * 7) % 3),
      late: (i * 3) % 2,
      absent: i === 5 || i === 6 ? 0 : (i * 2) % 2,
    }));
  }, []);

  const submitCorrection = (form) => {
    setCorrections((prev) => [
      {
        id: `COR-${Math.floor(Math.random() * 9000) + 1000}`,
        employeeId: empId,
        employeeName: employee?.name || "You",
        department: employee?.department || "—",
        date: form.date,
        requestedCheckIn: form.checkIn,
        requestedCheckOut: form.checkOut,
        reason: form.reason,
        status: CORRECTION_STATUS.PENDING,
        submittedOn: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="My Attendance"
        description={
          <>
            Track your{" "}
            <span className="font-semibold text-primary">daily attendance</span>,
            working hours and correction requests.
          </>
        }
        action={
          <button
            onClick={() => setShowCorrection(true)}
            className="btn-primary flex items-center gap-2 px-5 py-3 font-semibold transition-all hover:scale-105 hover:shadow-lg"
          >
            <Plus size={18} /> Request Correction
          </button>
        }
      />

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
        <AttendanceStatCard
          label="Present"
          value={monthly.present}
          icon={ClipboardList}
          tone="success"
        />
        <AttendanceStatCard
          label="Late"
          value={monthly.late}
          icon={Clock}
          tone="warning"
        />
        <AttendanceStatCard
          label="Absent"
          value={monthly.absent}
          icon={ClipboardList}
          tone="danger"
        />
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
          <NotificationsList />
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
