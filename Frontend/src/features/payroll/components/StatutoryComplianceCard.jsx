
const StatutoryComplianceCard = ({ items = [] }) => (
  <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-300 hover:border-[var(--color-primary)]/50 w-full h-full flex flex-col justify-between min-h-[380px]">
    <div className="mb-4"><h2 className="text-xs font-bold tracking-wider text-[var(--color-primary,yellow)] uppercase">STATUTORY COMPLIANCE BREAKDOWN</h2><p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">Government Portals Monthly Liability</p></div>
    <div className="flex-1 flex flex-col justify-between gap-3">{items.map((item) => <div key={item.id || item.title} className="bg-[var(--color-card-sub,rgba(255,255,255,0.02))] border border-[var(--color-border)] hover:border-[var(--color-border-hover,rgba(255,255,255,0.15))] p-3.5 sm:p-4 rounded-xl flex items-center justify-between transition-all duration-200"><div><h3 className="text-xs font-bold text-[var(--color-foreground)]">{item.title}</h3><p className="text-[11px] text-[var(--color-foreground-muted)] mt-0.5">{item.subtitle}</p></div><span className="text-sm font-extrabold text-[var(--color-primary,yellow)] tracking-tight shrink-0 ml-3">{item.amount}</span></div>)}</div>
  </div>
);
export default StatutoryComplianceCard;



