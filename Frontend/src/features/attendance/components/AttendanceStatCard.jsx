const AttendanceStatCard = ({ label, value, icon: Icon, tone = "default", hint }) => {
  const tones = {
    default: "text-foreground",
    primary: "text-primary",
    success: "text-[#2ecc71]",
    warning: "text-[#ffbf00]",
    danger: "text-[#e74c3c]",
    info: "text-[#4dabf7]",
  };
  return (
    <div className="card hover-lift p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="caption uppercase tracking-wider">{label}</p>
          <p className={`mt-3 text-3xl font-extrabold ${tones[tone]}`}>{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background-elevated">
            <Icon size={20} className={tones[tone]} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceStatCard;
