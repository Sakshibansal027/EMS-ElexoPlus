const InfoCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div
      className="
      group
      rounded-2xl
      border
      border-[var(--color-border)]
      bg-[var(--color-background-secondary)]
      p-5
      transition-all
      duration-300
      hover:border-[var(--color-primary)]
      hover:shadow-[0_0_15px_rgba(244,194,28,.08)]
      "
    >
      {/* Icon */}

      <div
        className="
        mb-4
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-xl
        bg-[rgba(244,194,28,.12)]
        transition
        group-hover:scale-110
        "
      >
        <Icon
          size={20}
          className="text-[var(--color-primary)]"
        />
      </div>

      {/* Label */}

      <p
        className="
        text-xs
        uppercase
        tracking-wider
        text-[var(--color-muted-foreground)]
        "
      >
        {label}
      </p>

      {/* Value */}

      <p
        className="
        mt-2
        text-base
        font-medium
        text-white
        break-words
        "
      >
        {value || "--"}
      </p>
    </div>
  );
};

export default InfoCard;