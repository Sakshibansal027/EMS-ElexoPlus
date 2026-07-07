import { useNavigate } from "react-router-dom";

import KPICard from "../components/KPICard";

const KPISection = ({ data = [] }) => {

  const navigate = useNavigate();

  const handleCardClick = (item) => {

    if (!item.route) return;

    navigate(item.route);

  };

  return (

    <section className="dashboard-section">

      {/* =========================================
                    Section Header
      ========================================= */}

      <div className="mb-6 flex items-end justify-between">

        <div>

          <h2 className="text-2xl font-bold text-foreground">

            Overview

          </h2>

          <p className="mt-1 text-sm text-foreground-muted">

            Key insights based on your role.

          </p>

        </div>

      </div>

      {/* =========================================
                    KPI Grid
      ========================================= */}

      <div
        className="
          grid
          gap-6

          sm:grid-cols-2

          xl:grid-cols-4
        "
      >

        {data.map((item) => (

          <KPICard
            key={item.id}
            data={item}
            onClick={() => handleCardClick(item)}
          />

        ))}

      </div>

    </section>

  );

};

export default KPISection;