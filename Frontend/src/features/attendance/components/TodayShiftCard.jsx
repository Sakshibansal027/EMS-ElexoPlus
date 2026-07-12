import { Sun, MapPin } from "lucide-react";

const TodayShiftCard = () => (
  <div className="card p-6">
    <p className="card-title">Today's Shift</p>
    <p className="card-subtitle">Your assigned schedule</p>
    <div className="mt-5 flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-background-elevated">
        <Sun className="text-primary" size={22} />
      </div>
      <div>
        <p className="text-lg font-bold text-foreground">General Shift</p>
        <p className="text-sm text-muted-foreground">09:00 AM — 06:00 PM</p>
      </div>
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="rounded-lg border border-border bg-background-elevated p-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Break
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">1h 00m</p>
      </div>
      <div className="rounded-lg border border-border bg-background-elevated p-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Location
        </p>
        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-foreground">
          <MapPin size={12} className="text-primary" /> Head Office
        </p>
      </div>
    </div>
  </div>
);

export default TodayShiftCard;
