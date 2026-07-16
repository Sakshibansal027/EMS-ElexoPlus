import { Download, FileText, Printer, FileSpreadsheet } from "lucide-react";

const ACTIONS = [
  { label: "Export CSV", icon: Download },
  { label: "Download PDF", icon: FileText },
  { label: "Download Excel", icon: FileSpreadsheet },
  { label: "Print Report", icon: Printer },
];

const QuickActions = () => (
  <div className="card p-6">
    <p className="card-title">Quick Actions</p>
    <p className="card-subtitle">One-click export & print</p>
    <div className="mt-5 grid grid-cols-2 gap-3">
      {ACTIONS.map(({ label, icon: Icon }) => (
        <button
          key={label}
          className="flex items-center gap-2 rounded-lg border border-border bg-background-elevated px-3 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary hover:-translate-y-0.5"
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  </div>
);

export default QuickActions;
