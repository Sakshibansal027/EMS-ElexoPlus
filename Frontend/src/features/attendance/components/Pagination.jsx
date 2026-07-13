import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  totalEntries,
  startEntry,
  endEntry,
  onPageChange,
}) => {
  const pages = [];
  const max = 5;
  let s = Math.max(1, currentPage - Math.floor(max / 2));
  let e = Math.min(totalPages, s + max - 1);
  if (e - s + 1 < max) s = Math.max(1, e - max + 1);
  for (let i = s; i <= e; i++) pages.push(i);

  return (
    <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
      <p>
        Showing <span className="font-semibold text-foreground">{startEntry}</span>{" "}
        – <span className="font-semibold text-foreground">{endEntry}</span> of{" "}
        <span className="font-semibold text-foreground">{totalEntries}</span>{" "}
        entries
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs font-semibold transition-colors ${
              p === currentPage
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
