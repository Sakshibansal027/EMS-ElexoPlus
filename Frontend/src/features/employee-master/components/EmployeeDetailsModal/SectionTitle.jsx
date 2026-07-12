const SectionTitle = ({ title }) => {
  return (
    <div className="mb-5 flex items-center gap-3">

      {/* Golden Line */}
      <div className="h-7 w-1 rounded-full bg-[var(--color-primary)]"></div>

      {/* Heading */}
      <h3 className="text-xl font-semibold text-foreground">
        {title}
      </h3>

    </div>
  );
};

export default SectionTitle;