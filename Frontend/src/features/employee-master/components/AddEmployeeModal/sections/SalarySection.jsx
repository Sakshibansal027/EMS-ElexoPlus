import { IndianRupee } from "lucide-react";
import FormInput from "../FormInput";

const SalarySection = () => {
  return (
    <div
      className="
      rounded-2xl
      border
      border-[var(--color-border)]
      bg-[var(--color-background-secondary)]
      p-7
      "
    >
      {/* Heading */}

      <div className="mb-6 flex items-center gap-3">

        <div
          className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-[rgba(244,194,28,.12)]
          "
        >
          <IndianRupee
            size={22}
            className="text-[var(--color-primary)]"
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold">
            Salary Information
          </h3>

          <p className="text-sm text-gray-400">
            Employee salary structure
          </p>
        </div>

      </div>

      {/* Form */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <FormInput
          label="Basic Salary"
          type="number"
          prefix="₹"
          placeholder="50000"
        />

        <FormInput
          label="HRA"
          type="number"
          prefix="₹"
          placeholder="15000"
        />

        <FormInput
          label="Allowance"
          type="number"
          prefix="₹"
          placeholder="5000"
        />

        <FormInput
          label="Bonus"
          type="number"
          prefix="₹"
          placeholder="10000"
        />

        <FormInput
          label="Gross Salary"
          type="number"
          prefix="₹"
          placeholder="80000"
        />

        <FormInput
          label="Net Salary"
          type="number"
            prefix="₹"
          placeholder="65000"
        />

      </div>
    </div>
  );
};

export default SalarySection;