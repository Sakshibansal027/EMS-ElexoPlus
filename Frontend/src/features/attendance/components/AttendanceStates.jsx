/**
 * Small presentational helpers for loading and empty states in the
 * Attendance module. Kept in-module so no other feature is affected.
 */
import { Loader2, Inbox } from "lucide-react";

export const AttendanceLoading = ({ label = "Loading attendance…" }) => (
  <div className="flex min-h-[240px] w-full items-center justify-center rounded-xl border border-border bg-background-elevated p-8">
    <div className="flex flex-col items-center gap-3 text-muted-foreground">
      <Loader2 size={22} className="animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  </div>
);

export const AttendanceEmpty = ({
  title = "No records found",
  description = "Try adjusting your filters or search.",
}) => (
  <div className="flex min-h-[200px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background-elevated p-8 text-center">
    <Inbox size={22} className="mb-2 text-muted-foreground" />
    <p className="text-sm font-semibold text-foreground">{title}</p>
    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
  </div>
);

export default AttendanceLoading;
