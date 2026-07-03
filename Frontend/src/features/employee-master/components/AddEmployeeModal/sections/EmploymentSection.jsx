import { BriefcaseBusiness } from "lucide-react";

import FormInput from "../FormInput";
import FormSelect from "../FormSelect";

import { departments } from "../../../data/departments";
import {roles} from "../../../data/roles";
import { employmentTypes } from "../../../data/employmentTypes";
import { employeeStatus } from "../../../data/employeeStatus";

const EmploymentSection = () => {
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
          <BriefcaseBusiness
            size={22}
            className="text-[var(--color-primary)]"
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold">
            Employment Information
          </h3>

          <p className="text-sm text-gray-400">
            Employee organization details
          </p>
        </div>
      </div>

      {/* Form */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormSelect
          label="Department"
          options={departments}
        />

        <FormSelect
          label="Role"
          options={roles}
        />

        <FormInput
          label="Designation"
          placeholder="Enter Designation"
        />

        <FormInput
          label="Reporting Manager"
          placeholder="Enter Reporting Manager"
        />

        <FormInput
          label="Joining Date"
          type="date"
        />

        <FormSelect
          label="Employment Type"
          options={employmentTypes}
        />

        <FormInput
          label="Work Location"
          placeholder="Enter Work Location"
        />

        <FormSelect
          label="Employee Status"
          options={employeeStatus}
        />
      </div>
    </div>
  );
};

export default EmploymentSection;