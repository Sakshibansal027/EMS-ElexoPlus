import { useState, useRef, useEffect } from "react";
import { Download, FileText, FileSpreadsheet, Printer } from "lucide-react";

const ExportOptions = ({ onExportCSV, onExportPDF, onPrint }) => {
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

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-xl border border-border bg-background-elevated/60 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary hover:bg-background-elevated hover:shadow-md"
      >
        <Download size={16} />
        Export
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-popover/95 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95">
          <button
            onClick={() => { setOpen(false); onExportCSV(); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
          >
            <FileSpreadsheet size={16} className="text-[#2ecc71]" />
            CSV File
          </button>
          <button
            onClick={() => { setOpen(false); onExportPDF(); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
          >
            <FileText size={16} className="text-[#e74c3c]" />
            PDF Document
          </button>
          <button
            onClick={() => { setOpen(false); onPrint(); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
          >
            <Printer size={16} className="text-primary" />
            Print
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportOptions;
