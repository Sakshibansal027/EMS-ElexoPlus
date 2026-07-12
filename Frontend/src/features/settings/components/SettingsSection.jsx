const SettingsSection = ({ title, description, children }) => {
  return (
    <div className="dashboard-card p-8">
      <div className="mb-8">
        <h2 className="heading-primary text-2xl text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-foreground-muted">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

export default SettingsSection;
