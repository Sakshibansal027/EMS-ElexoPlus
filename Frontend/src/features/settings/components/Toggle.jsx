const Toggle = ({ enabled, onChange, label, description }) => {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <div className="flex-1">
        {label && (
          <p className="text-sm font-medium text-foreground">{label}</p>
        )}
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="relative">
        <input
          type="checkbox"
          checked={enabled}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="h-7 w-12 rounded-full border border-border bg-input transition-all duration-300 after:absolute after:left-0.5 after:top-0.5 after:h-6 after:w-6 after:rounded-full after:bg-muted-foreground after:shadow-md after:transition-all after:duration-300 peer-checked:bg-primary peer-checked:after:translate-x-5 peer-checked:after:bg-primary-foreground peer-focus:ring-2 peer-focus:ring-primary/20" />
      </div>
    </label>
  );
};

export default Toggle;
