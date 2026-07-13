import { useMemo, useState } from "react";
import { ArrowUpDown, Eye, Pencil, Check, X } from "lucide-react";
import StatusBadge from "./StatusBadge";
import Pagination from "./Pagination";
import { formatHours } from "../utils/date";

const COLUMNS = [
  { key: "employeeName", label: "Employee" },
  { key: "employeeId", label: "ID" },
  { key: "department", label: "Department" },
  { key: "role", label: "Role" },
  { key: "date", label: "Date" },
  { key: "checkIn", label: "Check In" },
  { key: "checkOut", label: "Check Out" },
  { key: "breakMinutes", label: "Break" },
  { key: "workingHours", label: "Working Hours" },
  { key: "status", label: "Status" },
  { key: "remarks", label: "Remarks" },
];

const timeCell = (v) =>
  v
    ? new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";

const AttendanceTable = ({
  records,
  showActions = false,
  onApprove,
  onReject,
  onEdit,
  onView,
  pageSize = 8,
}) => {
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const copy = [...records];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const res = av > bv ? 1 : -1;
      return sortDir === "asc" ? res : -res;
    });
    return copy;
  }, [records, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const start = (page - 1) * pageSize;
  const rows = sorted.slice(start, start + pageSize);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="custom-scrollbar overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background-elevated/60 text-[11px] uppercase tracking-wider text-muted-foreground">
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  className="whitespace-nowrap px-4 py-4 font-semibold"
                >
                  <button
                    onClick={() => toggleSort(c.key)}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    {c.label}
                    <ArrowUpDown size={11} />
                  </button>
                </th>
              ))}
              {showActions && (
                <th className="whitespace-nowrap px-4 py-4 text-right font-semibold">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={COLUMNS.length + (showActions ? 1 : 0)}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No attendance records match your filters.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b border-border/60 transition-colors hover:bg-background-elevated/40"
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar !h-9 !w-9 text-xs">{r.avatar}</div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {r.employeeName}
                      </p>
                      <p className="text-xs text-muted-foreground">{r.branch}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                  {r.employeeId}
                </td>
                <td className="whitespace-nowrap px-4 py-3">{r.department}</td>
                <td className="whitespace-nowrap px-4 py-3">{r.role}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  {new Date(r.date).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {timeCell(r.checkIn)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {timeCell(r.checkOut)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {r.breakMinutes ? `${r.breakMinutes}m` : "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-primary">
                  {formatHours(r.workingHours)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="max-w-[220px] truncate px-4 py-3 text-xs text-muted-foreground">
                  {r.remarks || "—"}
                </td>
                {showActions && (
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      {onView && (
                        <button
                          onClick={() => onView(r)}
                          className="rounded-md p-2 text-muted-foreground hover:bg-background-elevated hover:text-primary"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(r)}
                          className="rounded-md p-2 text-muted-foreground hover:bg-background-elevated hover:text-primary"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      {onApprove && (
                        <button
                          onClick={() => onApprove(r)}
                          className="rounded-md p-2 text-muted-foreground hover:bg-[#2ecc71]/10 hover:text-[#2ecc71]"
                          title="Approve"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      {onReject && (
                        <button
                          onClick={() => onReject(r)}
                          className="rounded-md p-2 text-muted-foreground hover:bg-[#e74c3c]/10 hover:text-[#e74c3c]"
                          title="Reject"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border p-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalEntries={sorted.length}
          startEntry={sorted.length === 0 ? 0 : start + 1}
          endEntry={Math.min(start + pageSize, sorted.length)}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default AttendanceTable;
