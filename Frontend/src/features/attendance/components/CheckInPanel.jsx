import { useEffect, useState } from "react";
import { LogIn, LogOut, Coffee, Play } from "lucide-react";
import { formatHours } from "../utils/date";

const STORAGE_KEY = "elexoplus_attendance_state";

const loadState = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const CheckInPanel = () => {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const checkIn = () => setState({ ...state, checkInAt: new Date().toISOString() });
  const checkOut = () =>
    setState({ ...state, checkOutAt: new Date().toISOString(), onBreak: false });
  const toggleBreak = () => setState({ ...state, onBreak: !state.onBreak });
  const reset = () => setState({});

  const worked = state.checkInAt
    ? ((state.checkOutAt ? new Date(state.checkOutAt) : new Date()) -
        new Date(state.checkInAt)) /
      3600000
    : 0;

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="card-title">Attendance Actions</p>
          <p className="card-subtitle">Mark your attendance for today</p>
        </div>
        {state.checkInAt && (
          <button
            onClick={reset}
            className="text-xs font-semibold text-muted-foreground hover:text-primary"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg border border-border bg-background-elevated p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Check In
          </p>
          <p className="mt-1 text-sm font-bold text-foreground">
            {state.checkInAt
              ? new Date(state.checkInAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background-elevated p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Check Out
          </p>
          <p className="mt-1 text-sm font-bold text-foreground">
            {state.checkOutAt
              ? new Date(state.checkOutAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background-elevated p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Working
          </p>
          <p className="mt-1 text-sm font-bold text-primary">
            {state.checkInAt ? formatHours(worked) : "—"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={checkIn}
          disabled={!!state.checkInAt}
          className="btn-primary flex items-center justify-center gap-2 px-4 py-3 font-semibold transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LogIn size={16} /> Check In
        </button>
        <button
          onClick={checkOut}
          disabled={!state.checkInAt || !!state.checkOutAt}
          className="flex items-center justify-center gap-2 rounded-md border border-border bg-background-elevated px-4 py-3 font-semibold text-foreground transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LogOut size={16} /> Check Out
        </button>
        <button
          onClick={toggleBreak}
          disabled={!state.checkInAt || !!state.checkOutAt}
          className="col-span-2 flex items-center justify-center gap-2 rounded-md border border-border bg-background-elevated px-4 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          {state.onBreak ? <Play size={16} /> : <Coffee size={16} />}
          {state.onBreak ? "Resume Work" : "Start Break"}
        </button>
      </div>
    </div>
  );
};

export default CheckInPanel;
