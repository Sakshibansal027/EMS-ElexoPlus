import { Search, Filter } from "lucide-react";
import { ATTENDANCE_STATUS } from "../config/attendanceStatus";

const STATUS_OPTIONS = [
  "All",
  ATTENDANCE_STATUS.PRESENT,
  ATTENDANCE_STATUS.ABSENT,
  ATTENDANCE_STATUS.LATE,
  ATTENDANCE_STATUS.HALF_DAY,
  ATTENDANCE_STATUS.WFH,
  ATTENDANCE_STATUS.LEAVE,
];

const AttendanceFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  department,
  onDepartmentChange,
  departments = [],
  branch,
  onBranchChange,
  branches = [],
}) => (
  <div className="card p-5">
    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
      <Filter size={16} className="text-primary" /> Filters
    </div>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search employee or ID…"
          className="input w-full rounded-md py-2.5 pl-9 pr-3 text-sm outline-none"
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="input rounded-md px-3 py-2.5 text-sm outline-none"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s === "All" ? "All Statuses" : s}
          </option>
        ))}
      </select>

      {departments.length > 0 && (
        <select
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="input rounded-md px-3 py-2.5 text-sm outline-none"
        >
          <option value="All">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      )}

      {branches.length > 0 && (
        <select
          value={branch}
          onChange={(e) => onBranchChange(e.target.value)}
          className="input rounded-md px-3 py-2.5 text-sm outline-none"
        >
          <option value="All">All Branches</option>
          {branches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      )}
    </div>
  </div>
);

export default AttendanceFilters;
