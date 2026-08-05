const ReportStatCard = ({
  label,
  value,
  icon: Icon,
  tone = "default",
  hint,
}) => {
  const tones = {
    default: "text-foreground",
    primary: "text-primary",
    success: "text-[#2ecc71]",
    warning: "text-[#ffbf00]",
    danger: "text-[#e74c3c]",
    info: "text-[#4dabf7]",
  };

  return (
    <div
      className="card group relative flex items-center justify-between p-7 min-h-[170px] transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-primary"
    >
      <div>
        <p className="text-base font-medium text-muted-foreground">{label}</p>
        <h2 className={`mt-3 text-4xl font-bold tracking-tight ${tones[tone]}`}>{value}</h2>
        {hint && <p className="mt-2 text-sm text-muted-foreground">{hint}</p>}
      </div>

      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
          <Icon size={30} className={`${tones[tone]} transition-transform duration-300 group-hover:scale-110`} />
        </div>
      )}
    </div>
  );
};

export default ReportStatCard;
