import { useNavigate } from "react-router-dom";

const PRIORITY_STYLES = {
  high: {
    dot: "bg-red-500",
    badge: "bg-red-500/10 text-red-600 dark:text-red-400",
    label: "High",
  },

  medium: {
    dot: "bg-yellow-500",
    badge: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    label: "Medium",
  },

  low: {
    dot: "bg-blue-500",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    label: "Low",
  },
};

const STATUS_STYLES = {
  success: "bg-emerald-500",
  info: "bg-sky-500",
  warning: "bg-amber-500",
};

const TaskActivitySection = ({ pending = [], activity = [] }) => {
  const navigate = useNavigate();

  return (
    <section className="dashboard-section mt-8">

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* =====================================================
                        Pending Tasks
        ===================================================== */}

        <div className="dashboard-card flex h-[420px] flex-col p-6">

          {/* Header */}

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-foreground">

                Pending Tasks

              </h2>

              <p className="mt-1 text-sm text-foreground-muted">

                Complete your pending workflow.

              </p>

            </div>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">

              {pending.length}

            </span>

          </div>

          {/* Empty State */}

          {pending.length === 0 ? (

            <div className="flex flex-1 flex-col items-center justify-center text-center">

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">

                ✅

              </div>

              <h3 className="text-lg font-semibold text-foreground">

                You're all caught up!

              </h3>

              <p className="mt-2 max-w-xs text-sm text-foreground-muted">

                No pending tasks assigned.
                Enjoy your day.

              </p>

            </div>

          ) : (

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 py-2 dashboard-scrollbar">

              {pending.map((task) => {

                const priority =
                  PRIORITY_STYLES[task.priority] ??
                  PRIORITY_STYLES.low;

                return (

                  <button
                    key={task.id}
                    type="button"
                    onClick={() => navigate(task.route)}
                    className="group w-full rounded-2xl border border-border bg-card p-5 text-left transition-all duration-300 hover:border-primary/40 hover:shadow-xl"
                  >

                    <div className="flex items-start justify-between">

                      <div className="flex gap-4">

                        <span
                          className={`mt-2 h-3 w-3 rounded-full ${priority.dot}`}
                        />

                        <div>

                          <h3 className="font-semibold text-foreground">

                            {task.title}

                          </h3>

                          <p className="mt-1 text-sm text-foreground-muted">

                            {task.subtitle}

                          </p>

                        </div>

                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priority.badge}`}
                      >
                        {priority.label}
                      </span>

                    </div>

                    <div className="mt-4 flex items-center justify-end">

                      <span className="text-sm font-medium text-primary transition-transform duration-300 group-hover:translate-x-1">

                        Complete →

                      </span>

                    </div>

                  </button>

                );

              })}

            </div>

          )}

        </div>

        {/* =====================================================
                      Recent Activity
        ===================================================== */}

        <div className="dashboard-card flex h-[420px] flex-col p-6">

          {/* Header */}

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-foreground">

                Recent Activity

              </h2>

              <p className="mt-1 text-sm text-foreground-muted">

                Latest updates across your workspace.

              </p>

            </div>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">

              {activity.length}

            </span>

          </div>

          {/* Empty State */}

          {activity.length === 0 ? (

            <div className="flex flex-1 flex-col items-center justify-center text-center">

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">

                🕘

              </div>

              <h3 className="text-lg font-semibold text-foreground">

                No Recent Activity

              </h3>

              <p className="mt-2 max-w-xs text-sm text-foreground-muted">

                Activities will appear here automatically.

              </p>

            </div>

          ) : (

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 dashboard-scrollbar">

              {activity.map((item) => (

                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex gap-4">

                      <span
                        className={`mt-2 h-3 w-3 rounded-full ${STATUS_STYLES[item.status]
                          }`}
                      />

                      <div>

                        <h3 className="font-semibold text-foreground">

                          {item.title}

                        </h3>

                        <p className="mt-1 text-sm text-foreground-muted">

                          {item.subtitle}

                        </p>

                      </div>

                    </div>

                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground-muted">

                      {item.time}

                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </section>

  );

};

export default TaskActivitySection;