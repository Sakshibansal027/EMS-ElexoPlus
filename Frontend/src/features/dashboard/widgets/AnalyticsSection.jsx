import { useNavigate } from "react-router-dom";

import ANALYTICS_MOCK from "../mock/analyticsMock";
import CHART_MAP from "../config/chartMap";

const AnalyticsSection = ({ data = [] }) => {
  const navigate = useNavigate();

  return (
    <section className="space-y-6">
      {/* =====================================
                  Section Header
      ===================================== */}

      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Business Insights
        </h2>

        <p className="mt-1 text-sm text-foreground-muted">
          Real-time trends and performance overview.
        </p>
      </div>

      {/* =====================================
                    Top Grid
      ===================================== */}

      <div className="grid grid-cols-12 gap-6">
        {data.slice(0, 2).map((item) => {
          const Chart = CHART_MAP[item.chart];

          const chartData = ANALYTICS_MOCK[item.mock];

          return (
            <div
              key={item.id}
              className={
                item.size === "large"
                  ? "col-span-12 xl:col-span-8"
                  : "col-span-12 xl:col-span-4"
              }
            >
              <div className="dashboard-card h-full p-6 cursor-pointer">
                {/* ==========================
                          Header
                ========================== */}

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-foreground-muted">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* ==========================
                          Chart
                ========================== */}

                <div className="mt-6">
                  <Chart
                    data={chartData}
                    tooltipLabel={item.tooltipLabel}
                    centerLabel={item.centerLabel}
                    valuePrefix={item.valuePrefix}
                    valueSuffix={item.valueSuffix}
                  />
                </div>

                {/* ==========================
                          Footer
                ========================== */}

                <button
                  onClick={() => navigate(item.route)}
                  className="
                    mt-5
                    border-t
                    border-border
                    pt-4
                    text-sm
                    font-medium
                    text-primary
                    transition-all
                    duration-300
                    hover:translate-x-1
                  "
                >
                  Explore →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================
                  Bottom Card
      ===================================== */}

      {data[2] &&
        (() => {
          const item = data[2];

          const Chart = CHART_MAP[item.chart];

          const chartData = ANALYTICS_MOCK[item.mock];

          return (
            <div className="dashboard-card p-6">
              {/* ==========================
                        Header
            ========================== */}

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-foreground-muted">
                  {item.subtitle}
                </p>
              </div>

              {/* ==========================
                        Chart
            ========================== */}

              <div className="mt-6">
                <Chart
                  data={chartData}
                  tooltipLabel={item.tooltipLabel}
                  centerLabel={item.centerLabel}
                  valuePrefix={item.valuePrefix}
                  valueSuffix={item.valueSuffix}
                />
              </div>

              {/* ==========================
                        Footer
            ========================== */}

              <button
                onClick={() => navigate(item.route)}
                className="
                mt-5
                border-t
                border-border
                pt-4
                text-sm
                font-medium
                text-primary
                transition-all
                duration-300
                hover:translate-x-1
              "
              >
                Explore →
              </button>
            </div>
          );
        })()}
    </section>
  );
};

export default AnalyticsSection;
