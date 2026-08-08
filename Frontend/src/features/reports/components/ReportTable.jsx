import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";

const Pagination = ({ currentPage, totalPages, totalEntries, startEntry, endEntry, onPageChange }) => {
  const pages = [];
  const max = 5;
  let s = Math.max(1, currentPage - Math.floor(max / 2));
  let e = Math.min(totalPages, s + max - 1);
  if (e - s + 1 < max) s = Math.max(1, e - max + 1);
  for (let i = s; i <= e; i++) pages.push(i);

  return (
    <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
      <p>
        Showing <span className="font-semibold text-foreground">{startEntry}</span> – <span className="font-semibold text-foreground">{endEntry}</span> of <span className="font-semibold text-foreground">{totalEntries}</span> entries
      </p>
      <div className="flex items-center gap-1">
        <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40">&lt;</button>
        {pages.map(p => (
          <button key={p} onClick={() => onPageChange(p)} className={`flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs font-semibold transition-colors ${p === currentPage ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>{p}</button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40">&gt;</button>
      </div>
    </div>
  );
};

const STATUS_COLORS = {
  "Present": "bg-emerald-500/10 text-emerald-500",
  "Late": "bg-amber-500/10 text-amber-500",
  "Absent": "bg-rose-500/10 text-rose-500",
  "Half Day": "bg-orange-500/10 text-orange-500",
  "WFH": "bg-sky-500/10 text-sky-500",
  "Leave": "bg-violet-500/10 text-violet-500",
  "On Track": "bg-emerald-500/10 text-emerald-500",
  "Behind Target": "bg-rose-500/10 text-rose-500",
  "Exceeded": "bg-primary/10 text-primary",
  "Pending": "bg-amber-500/10 text-amber-500",
  "Active": "bg-emerald-500/10 text-emerald-500",
  "Inactive": "bg-rose-500/10 text-rose-500",
};

const ReportTable = ({ columns, data, pageSize = 8 }) => {
  const [sortKey, setSortKey] = useState(columns[0]?.key);
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const res = av > bv ? 1 : -1;
      return sortDir === "asc" ? res : -res;
    });
    return copy;
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  // ensure page doesn't exceed total pages if filter changes
  if (page > totalPages) setPage(totalPages);

  const start = (page - 1) * pageSize;
  const rows = sorted.slice(start, start + pageSize);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const renderCell = (row, col) => {
    const val = row[col.key];
    if (col.key === "status") {
      return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[val] || "bg-muted/50 text-muted-foreground"}`}>
          {val}
        </span>
      );
    }
    if (col.key === "target" || col.key === "achievement") {
      return `₹${val.toLocaleString()}`;
    }
    if (col.key === "percentage" || col.key === "teamPerformance") {
      return (
        <span className={`font-semibold ${val >= 100 ? "text-primary" : val >= 80 ? "text-emerald-500" : "text-rose-500"}`}>
          {val.toFixed(1)}%
        </span>
      );
    }
    if (col.key === "date" || col.key === "joiningDate") {
      return new Date(val).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
    }
    if (col.key === "checkIn" || col.key === "checkOut") {
      return val ? new Date(val).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";
    }
    if (col.key === "workingHours") {
      return <span className="font-semibold text-primary">{Number(val).toFixed(2)}h</span>;
    }
    if (col.key === "employeeName" && row.avatar) {
      return (
        <div className="flex items-center gap-3">
          <div className="avatar !h-9 !w-9 text-xs">{row.avatar}</div>
          <p className="font-semibold text-foreground">{val}</p>
        </div>
      );
    }
    return val || "—";
  };

  return (
    <div className="card overflow-hidden">
      <div className="custom-scrollbar overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background-elevated/60 text-[11px] uppercase tracking-wider text-muted-foreground">
              {columns.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-4 py-4 font-semibold">
                  <button onClick={() => toggleSort(c.key)} className="flex items-center gap-1 hover:text-primary">
                    {c.label}
                    <ArrowUpDown size={11} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">
                  No records match your filters.
                </td>
              </tr>
            )}
            {rows.map((r, idx) => (
              <tr key={r.id || idx} className="border-b border-border/60 transition-colors hover:bg-background-elevated/40">
                {columns.map((c) => (
                  <td key={c.key} className="whitespace-nowrap px-4 py-3">
                    {renderCell(r, c)}
                  </td>
                ))}
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

export default ReportTable;
