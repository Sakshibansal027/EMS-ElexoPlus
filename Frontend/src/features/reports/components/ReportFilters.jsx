import { useEffect, useRef, useState } from "react";
import { Search, Filter, ChevronDown, Check } from "lucide-react";

const STATUS_DOT = {
  "Present": "bg-emerald-500",
  "Late": "bg-amber-500",
  "Absent": "bg-rose-500",
  "Half Day": "bg-orange-500",
  "WFH": "bg-sky-500",
  "Leave": "bg-violet-500",
  "On Track": "bg-emerald-500",
  "Behind Target": "bg-rose-500",
  "Exceeded": "bg-primary",
  "Pending": "bg-amber-500",
  "Active": "bg-emerald-500",
  "Inactive": "bg-rose-500",
  "All": "bg-muted-foreground/60",
};

const FancySelect = ({ value, onChange, options, label, displayMap, showDots = false }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const display = displayMap?.[value] ?? value;

  return (
    <div ref={rootRef} className="relative">
      <span className={`pointer-events-none absolute -top-2 left-3 z-10 rounded-md bg-card px-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${open ? "text-primary" : "text-muted-foreground"}`}>
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-gradient-to-b from-background-elevated/90 to-background-elevated/60 px-4 py-3 text-left text-sm font-medium text-foreground shadow-sm outline-none transition-all ${open ? "border-primary ring-2 ring-primary/25 shadow-[0_8px_24px_-12px] shadow-primary/40" : "border-border hover:border-primary/60 hover:shadow-md"}`}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          {showDots && (
            <span className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT[value] ?? "bg-muted-foreground/60"} shadow-[0_0_8px] shadow-current/60`} />
          )}
          <span className="truncate">{display}</span>
        </span>
        <ChevronDown size={16} className={`shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180 text-primary" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-40 mt-2 origin-top overflow-hidden rounded-xl border border-border bg-popover/95 p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-1" role="listbox">
          <div className="max-h-64 overflow-y-auto pr-1">
            {options.map((opt) => {
              const active = opt === value;
              const optDisplay = displayMap?.[opt] ?? opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-primary/12 text-primary" : "text-foreground hover:bg-accent"}`}
                >
                  <span className="flex min-w-0 items-center gap-2 truncate">
                    {showDots && (
                      <span className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT[opt] ?? "bg-muted-foreground/60"}`} />
                    )}
                    <span className="truncate">{optDisplay}</span>
                  </span>
                  {active && <Check size={14} className="shrink-0 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ReportFilters = ({
  search, onSearchChange,
  dateFrom, onDateFromChange,
  dateTo, onDateToChange,
  employee, onEmployeeChange, employees = [],
  department, onDepartmentChange, departments = [],
  status, onStatusChange, statuses = [],
  region, onRegionChange, regions = [],
  designation, onDesignationChange, designations = [],
  showSearch = true,
  showDates = false,
}) => {
  return (
    <div className="card p-5">
      <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary/25 to-primary/10 text-primary shadow-inner">
          <Filter size={14} />
        </span>
        Filters
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {showSearch && (
          <div className="group relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-xl border border-border bg-gradient-to-b from-background-elevated/90 to-background-elevated/60 py-3 pl-9 pr-3 text-sm text-foreground shadow-sm outline-none transition-all hover:border-primary/60 hover:shadow-md focus:border-primary focus:ring-2 focus:ring-primary/25"
            />
          </div>
        )}

        {showDates && (
          <>
            <div className="group relative">
              <span className="pointer-events-none absolute -top-2 left-3 z-10 rounded-md bg-card px-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors group-focus-within:text-primary">From Date</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
                className="w-full rounded-xl border border-border bg-gradient-to-b from-background-elevated/90 to-background-elevated/60 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-all hover:border-primary/60 hover:shadow-md focus:border-primary focus:ring-2 focus:ring-primary/25 [color-scheme:dark]"
              />
            </div>
            <div className="group relative">
              <span className="pointer-events-none absolute -top-2 left-3 z-10 rounded-md bg-card px-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors group-focus-within:text-primary">To Date</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
                className="w-full rounded-xl border border-border bg-gradient-to-b from-background-elevated/90 to-background-elevated/60 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-all hover:border-primary/60 hover:shadow-md focus:border-primary focus:ring-2 focus:ring-primary/25 [color-scheme:dark]"
              />
            </div>
          </>
        )}

        {employees.length > 0 && (
          <FancySelect label="Employee" value={employee} onChange={onEmployeeChange} options={employees} />
        )}

        {departments.length > 0 && (
          <FancySelect label="Department" value={department} onChange={onDepartmentChange} options={departments} />
        )}

        {regions.length > 0 && (
          <FancySelect label="Region" value={region} onChange={onRegionChange} options={regions} />
        )}

        {designations.length > 0 && (
          <FancySelect label="Designation" value={designation} onChange={onDesignationChange} options={designations} />
        )}

        {statuses.length > 0 && (
          <FancySelect label="Status" value={status} onChange={onStatusChange} options={statuses} showDots />
        )}
      </div>
    </div>
  );
};

export default ReportFilters;
