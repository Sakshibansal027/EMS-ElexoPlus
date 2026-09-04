import { useEffect, useMemo, useState } from "react";
import { LogIn, LogOut, Coffee, Play } from "lucide-react";
import { formatHours } from "../utils/date";
import { attendanceService } from "../services/attendanceService";

const time = (value) => value ? new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";

const CheckInPanel = () => {
  const [record, setRecord] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { attendanceService.getTodayState().then(setRecord).catch((e) => setError(e.message)); }, []);
  const worked = useMemo(() => {
    if (!record?.checkIn) return 0;
    const end = record.checkOut ? new Date(record.checkOut) : new Date();
    return Math.max(0, (end - new Date(record.checkIn)) / 3600000 - (record.breakMinutes || 0) / 60);
  }, [record]);
  const act = async (fn) => {
    setBusy(true); setError("");
    try { setRecord(await fn()); } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  const checkedIn = Boolean(record?.checkIn);
  const checkedOut = Boolean(record?.checkOut);
  const onBreak = Boolean(record?.breakStartedAt);

  return <div className="card p-6">
    <div className="mb-4"><p className="card-title">Attendance Actions</p><p className="card-subtitle">Mark your attendance for today</p></div>
    {error && <p className="mb-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>}
    <div className="mb-5 grid grid-cols-3 gap-3 text-center">
      <Metric label="Check In" value={time(record?.checkIn)} />
      <Metric label="Check Out" value={time(record?.checkOut)} />
      <Metric label="Working" value={checkedIn ? formatHours(worked) : "—"} primary />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <button onClick={() => act(attendanceService.checkIn)} disabled={busy || checkedIn} className="btn-primary flex items-center justify-center gap-2 px-4 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-40"><LogIn size={16} /> Check In</button>
      <button onClick={() => act(attendanceService.checkOut)} disabled={busy || !checkedIn || checkedOut || onBreak} className="flex items-center justify-center gap-2 rounded-md border border-border bg-background-elevated px-4 py-3 font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-40"><LogOut size={16} /> Check Out</button>
      <button onClick={() => act(onBreak ? attendanceService.endBreak : attendanceService.startBreak)} disabled={busy || !checkedIn || checkedOut} className="col-span-2 flex items-center justify-center gap-2 rounded-md border border-border bg-background-elevated px-4 py-3 text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-40">{onBreak ? <Play size={16} /> : <Coffee size={16} />}{onBreak ? "Resume Work" : "Start Break"}</button>
    </div>
  </div>;
};

const Metric = ({ label, value, primary = false }) => <div className="rounded-lg border border-border bg-background-elevated p-3"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p><p className={`mt-1 text-sm font-bold ${primary ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
export default CheckInPanel;
