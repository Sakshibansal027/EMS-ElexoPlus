import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const QuickActionSection = ({ actions = [] }) => {
  const navigate = useNavigate();

  return (
    <section className="space-y-6">

      {/* Heading */}

      <div>
        <h2 className="text-3xl font-bold text-foreground">
          Quick Actions
        </h2>

        <p className="text-foreground-muted mt-1">
          Jump directly to frequently used modules.
        </p>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((item) => {

          const Icon = item.icon;

          return (

            <button
              key={item.id}
              onClick={() => navigate(item.route)}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-border
                bg-card
                p-6
                transition-all
                duration-300
                hover:border-primary
                hover:-translate-y-1
                hover:shadow-[0_0_30px_rgba(255,196,0,0.15)]
                active:scale-95
              "
            >

              {/* glow */}

              <div
                className="
                  absolute
                  inset-0
                  opacity-0
                  group-hover:opacity-100
                  transition
                  bg-gradient-to-br
                  from-primary/10
                  via-transparent
                  to-transparent
                "
              />

              <div className="relative z-10 flex flex-col items-start gap-6">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-primary/10
                    text-primary
                    transition-all
                    duration-300
                    group-hover:scale-110
                    group-hover:rotate-6
                  "
                >
                  <Icon size={24} />
                </div>

                <div className="text-left">

                  <h3 className="font-semibold text-lg text-foreground">
                    {item.title}
                  </h3>

                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-primary
                    text-sm
                    font-medium
                  "
                >
                  Open

                  <ArrowRight
                    size={16}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />

                </div>

              </div>

            </button>

          );
        })}

      </div>

    </section>
  );
};

export default QuickActionSection;