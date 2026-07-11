const PageHeader = ({ title, description, action }) => (
  <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
    <div>
      <h1 className="page-title">{title}</h1>
      <p className="page-description">{description}</p>
    </div>
    {action}
  </div>
);

export default PageHeader;
