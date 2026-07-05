import { IndianRupee } from "lucide-react";
import FormInput from "../FormInput";

const SalarySection = ({
  formData,
  handleChange,
  setFormData,
}) => {
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
  name="basicSalary"
  placeholder="50000"
  value={formData.basicSalary}
  onChange={handleChange}
/>

        <FormInput
  label="HRA"
  type="number"
  name="hra"
  placeholder="15000"
  value={formData.hra}
  onChange={handleChange}
/>
<FormInput
  label="Allowance"
  type="number"
  name="allowance"
  placeholder="5000"
  value={formData.allowance}
  onChange={handleChange}
/>

        <FormInput
  label="Bonus"
  type="number"
  name="bonus"
  placeholder="10000"
  value={formData.bonus}
  onChange={handleChange}
/>

      <FormInput
  label="Gross Salary"
  type="number"
  name="grossSalary"
  placeholder="80000"
  value={formData.grossSalary}
  onChange={handleChange}
/>
      <FormInput
  label="Net Salary"
  type="number"
  name="netSalary"
  placeholder="65000"
  value={formData.netSalary}
  onChange={handleChange}
/>

      </div>
    </div>
  );
};

export default SalarySection;