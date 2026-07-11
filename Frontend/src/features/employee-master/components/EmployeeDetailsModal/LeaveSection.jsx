import {
  CalendarDays,
  BriefcaseBusiness,
  HeartPulse,
} from "lucide-react";

import SectionTitle from "./SectionTitle";

const LeaveSection = ({ employee }) => {
  const leaves = [
    {
      title: "Casual Leave",
      value: employee.casualLeave,
      icon: CalendarDays,
    },
    {
      title: "Earned Leave",
      value: employee.earnedLeave,
      icon: BriefcaseBusiness,
    },
    {
      title: "Sick Leave",
      value: employee.sickLeave,
      icon: HeartPulse,
    },
  ];

  return (
    <div className="mt-10">

      <SectionTitle title="Leave Balance" />

      <div className="grid gap-5 md:grid-cols-3">

        {leaves.map((leave) => {
          const Icon = leave.icon;

          return (
            <div
              key={leave.title}
              className="
                group
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-[var(--color-background-secondary)]
                p-6
                transition-all
                duration-300
                hover:border-[var(--color-primary)]
                hover:-translate-y-1
              "
            >

              <div
                className="
                  mb-5
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-[rgba(244,194,28,.12)]
                "
              >
                <Icon
                  size={24}
                  className="text-[var(--color-primary)]"
                />
              </div>

              <p className="text-sm text-[var(--color-muted-foreground)]">
                {leave.title}
              </p>

              <h2 className="mt-2 text-3xl font-bold text-foreground">
                {leave.value}
              </h2>

              <p className="mt-1 text-sm text-[var(--color-primary)]">
                Days Remaining
              </p>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default LeaveSection;