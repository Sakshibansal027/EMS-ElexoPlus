const StatsCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="card group p-5 flex items-center justify-between
                transition-all duration-300
                hover:-translate-y-1
                hover:border-[var(--color-primary)]
                hover:shadow-[var(--shadow-primary)]">

      <div>
        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {value}
        </h2>
      </div>

      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted transition-all duration-300">

        <Icon
  size={28}
  className="text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-110"
/>

      </div>

    </div>
  );
};

export default StatsCard;