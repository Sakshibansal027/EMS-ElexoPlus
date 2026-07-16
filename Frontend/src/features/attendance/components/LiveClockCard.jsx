import { CalendarClock } from "lucide-react";
import useLiveClock from "../hooks/useLiveClock";
import { formatPrettyDate } from "../utils/date";

const LiveClockCard = () => {
  const now = useLiveClock();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return (
    <div className="hero-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="caption uppercase tracking-wider">Live Clock</p>
          <p className="mt-2 text-4xl font-extrabold tracking-tight text-primary">
            {time}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatPrettyDate(now)}
          </p>
        </div>
        <div className="avatar">
          <CalendarClock size={22} />
        </div>
      </div>
    </div>
  );
};

export default LiveClockCard;
