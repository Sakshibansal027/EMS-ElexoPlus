
const InfoCard = ({ title, data = [] }) => {
  return (
    <div className="dashboard-card h-full p-6">

      {/* ==========================================
                    Header
      ========================================== */}

      <div className="mb-6">

        <h2 className="text-xl font-bold text-foreground">
          {title}
        </h2>

      </div>

      {/* ==========================================
                    Content
      ========================================== */}

      <div className="space-y-5">

        {data.map((item) => (

          <div
            key={item.label}
            className="
              flex
              items-start
              justify-between
              gap-6
              border-b
              border-border/50
              pb-3
              last:border-none
              last:pb-0
            "
          >

            <span
              className="
                text-sm
                font-medium
                text-foreground-muted
              "
            >
              {item.label}
            </span>

            <span
              className="
                text-right
                text-sm
                font-semibold
                text-foreground
              "
            >
              {item.value}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
};

export default InfoCard;