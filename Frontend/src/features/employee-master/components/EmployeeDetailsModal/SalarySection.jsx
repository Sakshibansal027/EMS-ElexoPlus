import { BadgeIndianRupee } from "lucide-react";
import SectionTitle from "./SectionTitle";

const SalarySection = ({ employee }) => {
  return (
    <div className="mt-10">

      <SectionTitle title="Salary Information" />

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Salary Breakdown */}

        <div
          className="
          lg:col-span-2
          rounded-2xl
          border
          border-[var(--color-border)]
          bg-[var(--color-background-secondary)]
          p-6
        "
        >
          <div className="space-y-5">

            <SalaryRow
              label="Basic Salary"
              value={employee.basicSalary}
            />

            <SalaryRow
              label="HRA"
              value={employee.hra}
            />

            <SalaryRow
              label="Allowance"
              value={employee.allowance}
            />

            <SalaryRow
              label="Bonus"
              value={employee.bonus}
            />

            <div className="border-t border-[var(--color-border)] pt-5">

              <SalaryRow
                label="Gross Salary"
                value={employee.grossSalary}
                highlight
              />

            </div>

          </div>
        </div>

        {/* Net Salary Card */}

        <div
          className="
          rounded-2xl
          border
          border-[var(--color-primary)]
          bg-gradient-to-br
          from-[#1f1b0d]
          to-[#111111]
          p-6
          flex
          flex-col
          items-center
          justify-center
          text-center
          shadow-[0_0_18px_rgba(244,194,28,.12)]
        "
        >

          <BadgeIndianRupee
            size={36}
            className="text-[var(--color-primary)]"
          />

          <p className="mt-4 text-sm uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Net Salary
          </p>

          <h2 className="mt-2 text-4xl font-bold text-[var(--color-primary)]">
            {employee.netSalary}
          </h2>

          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Monthly Take Home
          </p>

        </div>

      </div>

    </div>
  );
};

const SalaryRow = ({ label, value, highlight }) => {
  return (
    <div className="flex items-center justify-between">

      <span
        className={`${
          highlight
            ? "font-semibold text-white"
            : "text-[var(--color-muted-foreground)]"
        }`}
      >
        {label}
      </span>

      <span
        className={`${
          highlight
            ? "font-bold text-[var(--color-primary)]"
            : "text-white"
        }`}
      >
        {value}
      </span>

    </div>
  );
};

export default SalarySection;