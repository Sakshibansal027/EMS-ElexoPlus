import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  LogIn,
  LogOut,
  Timer,
  X,
} from "lucide-react";
import { getMonthMatrix, monthName, formatDate } from "../utils/date";
import { STATUS_STYLES, ATTENDANCE_STATUS } from "../config/attendanceStatus";
const LEGEND = [
  ATTENDANCE_STATUS.PRESENT,
  ATTENDANCE_STATUS.LATE,
  ATTENDANCE_STATUS.WFH,
  ATTENDANCE_STATUS.HALF_DAY,
  ATTENDANCE_STATUS.LEAVE,
  ATTENDANCE_STATUS.ABSENT,
  ATTENDANCE_STATUS.HOLIDAY,
  ATTENDANCE_STATUS.WEEKEND,
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const AttendanceCalendar = ({ records = [] }) => {
  const today = new Date();
  const [cursor, setCursor] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const map = useMemo(() => {
    const m = {};
    records.forEach((r) => {
      m[formatDate(r.date)] = r;
    });
    return m;
  }, [records]);
  const matrix = getMonthMatrix(cursor.year, cursor.month);
  const todayKey = formatDate(today);
  const shift = (delta) => {
    let m = cursor.month + delta;
    let y = cursor.year;
    if (m < 0) {
      m = 11;
      y--;
    } else if (m > 11) {
      m = 0;
      y++;
    }
    setCursor({ year: y, month: m });
  };
  const goToToday = () => {
    setCursor({ year: today.getFullYear(), month: today.getMonth() });
    setSelected(map[todayKey] || { date: today });
  };
  // Monthly summary
  const summary = useMemo(() => {
    const inMonth = records.filter((r) => {
      const d = new Date(r.date);
      return (
        d.getFullYear() === cursor.year && d.getMonth() === cursor.month
      );
    });
    const present = inMonth.filter((r) =>
      [
        ATTENDANCE_STATUS.PRESENT,
        ATTENDANCE_STATUS.LATE,
        ATTENDANCE_STATUS.WFH,
      ].includes(r.status),
    ).length;
    const absent = inMonth.filter(
      (r) => r.status === ATTENDANCE_STATUS.ABSENT,
    ).length;
    const leave = inMonth.filter((r) => r.status === ATTENDANCE_STATUS.LEAVE)
      .length;
    return { present, absent, leave };
  }, [records, cursor]);
  return (
    <div className="card relative overflow-hidden p-6">
      {/* Decorative gradient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
      />
      {/* Header */}
      <div className="relative mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-white shadow-lg shadow-primary/25">
            <CalendarDays size={20} />
          </div>
          <div>
            <p className="card-title leading-tight">Attendance Calendar</p>
            <p className="card-subtitle">Tap a date to view details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="rounded-lg border border-border bg-background-elevated px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
          >
            Today
          </button>
          <div className="flex items-center gap-1 rounded-xl border border-border bg-background-elevated p-1">
            <button
              onClick={() => shift(-1)}
              aria-label="Previous month"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="min-w-[140px] px-2 text-center text-sm font-bold text-foreground">
              {monthName(cursor.month)}{" "}
              <span className="text-muted-foreground">{cursor.year}</span>
            </div>
            <button
              onClick={() => shift(1)}
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Mini stat pills */}
      <div className="relative mb-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-600/80">
            Present
          </p>
          <p className="text-lg font-bold text-emerald-600">{summary.present}</p>
        </div>
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-violet-600/80">
            Leave
          </p>
          <p className="text-lg font-bold text-violet-600">{summary.leave}</p>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-rose-600/80">
            Absent
          </p>
          <p className="text-lg font-bold text-rose-600">{summary.absent}</p>
        </div>
      </div>
      {/* Weekday header */}
      <div className="relative mb-2 grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[11px] font-semibold uppercase tracking-wider ${
              i === 0 || i === 6
                ? "text-primary/60"
                : "text-muted-foreground"
            }`}
          >
            {d}
          </div>
        ))}
      </div>
      {/* Day grid */}
      <div className="relative grid grid-cols-7 gap-1.5">
        {matrix.flat().map(({ date, currentMonth }, idx) => {
          const key = formatDate(date);
          const rec = map[key];
          const day = date.getDay();
          const status =
            rec?.status ||
            (day === 0 || day === 6 ? ATTENDANCE_STATUS.WEEKEND : null);
          const s = status ? STATUS_STYLES[status] : null;
          const isToday = key === todayKey;
          const isSelected = selected && formatDate(selected.date) === key;
          return (
            <button
              key={idx}
              onClick={() => setSelected(rec || { date, status })}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              className={`group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl border text-xs font-semibold transition-all duration-200 ease-out
                ${currentMonth ? "opacity-100" : "opacity-35"}
                ${
                  s
                    ? `${s.bg} ${s.border} ${s.text}`
                    : "border-border bg-background-elevated text-foreground"
                }
                ${
                  isSelected
                    ? "scale-[1.04] ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "hover:-translate-y-0.5 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
                }
                ${isToday ? "!border-primary/70" : ""}
              `}
            >
              {/* Today ribbon */}
              {isToday && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px] shadow-primary" />
              )}
              <span
                className={`text-sm ${
                  isToday ? "font-extrabold text-primary" : ""
                }`}
              >
                {date.getDate()}
              </span>
              {s && (
                <span
                  className={`mt-1 h-1.5 w-1.5 rounded-full ${s.dot} transition-transform group-hover:scale-125`}
                />
              )}
              {/* Hover tooltip for status */}
              {status && hovered === key && (
                <span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-[10px] font-medium text-background shadow-md">
                  {status}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {/* Legend */}
      <div className="relative mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4">
        {LEGEND.map((k) => {
          const s = STATUS_STYLES[k];
          return (
            <span
              key={k}
              className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              {k}
            </span>
          );
        })}
      </div>
      {/* Selected day detail */}
      {selected && (
        <div className="relative mt-5 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background-elevated to-background-elevated/50 p-5 shadow-inner dropdown-enter">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                {new Date(selected.date).toLocaleDateString("en-US", {
                  weekday: "long",
                })}
              </p>
              <p className="mt-0.5 text-lg font-bold text-foreground">
                {new Date(selected.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selected.status && (
                <span
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    STATUS_STYLES[selected.status]?.bg || ""
                  } ${STATUS_STYLES[selected.status]?.border || ""} ${
                    STATUS_STYLES[selected.status]?.text || ""
                  }`}
                >
                  {selected.status}
                </span>
              )}
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-background hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          {selected.checkIn ? (
            <div className="grid grid-cols-3 gap-3">
              <DetailTile
                icon={LogIn}
                label="Check In"
                value={new Date(selected.checkIn).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                tone="emerald"
              />
              <DetailTile
                icon={LogOut}
                label="Check Out"
                value={
                  selected.checkOut
                    ? new Date(selected.checkOut).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"
                }
                tone="rose"
              />
              <DetailTile
                icon={Timer}
                label="Hours"
                value={
                  selected.workingHours
                    ? `${selected.workingHours.toFixed(2)}h`
                    : "—"
                }
                tone="primary"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-background/50 px-3 py-2.5 text-xs text-muted-foreground">
              <Clock size={14} />
              {selected.status
                ? `Marked as ${selected.status}`
                : "No attendance recorded for this day"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const toneMap = {
  emerald: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  rose: "text-rose-600 bg-rose-500/10 border-rose-500/20",
  primary: "text-primary bg-primary/10 border-primary/20",
};
const DetailTile = ({ icon: Icon, label, value, tone = "primary" }) => (
  <div className={`rounded-xl border p-3 ${toneMap[tone]}`}>
    <div className="mb-1 flex items-center gap-1.5">
      <Icon size={12} />
      <p className="text-[10px] font-semibold uppercase tracking-wider">
        {label}
      </p>
    </div>
    <p className="text-base font-bold">{value}</p>
  </div>
);
export default AttendanceCalendar;
