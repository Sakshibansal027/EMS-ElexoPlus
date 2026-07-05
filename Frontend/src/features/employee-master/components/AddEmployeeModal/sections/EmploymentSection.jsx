import { BriefcaseBusiness } from "lucide-react";

import FormInput from "../FormInput";
import FormSelect from "../FormSelect";

import { departments } from "../../../data/departments";
import { roles } from "../../../data/roles";
import { employmentTypes } from "../../../data/employmentTypes";
import { employeeStatus } from "../../../data/employeeStatus";

const EmploymentSection = ({
  formData,
  handleChange,
  setFormData,
  errors,
  setErrors,
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
          value={formData.department}
           required
          error={errors.department}
          onChange={(value) => {
            setFormData((prev) => ({
              ...prev,
              department: value,
            }))
            setErrors((prev) => ({
              ...prev,
              department: "",
            }));
          }


          }
         
        />
        <FormSelect
          label="Role"
          options={roles}
          value={formData.role}
          onChange={(value) =>{  setFormData((prev) => ({
              ...prev,
              role: value,
            }))
             setErrors((prev) => ({
          ...prev,
          role: "",
  }));}
          
            
          }
        required
        error={errors.role}
        />

        <FormInput
          label="Designation"
          name="designation"
          placeholder="Enter Designation"
          value={formData.designation}
          onChange={handleChange}
          required
          error={errors.designation}
        />

        <FormInput
          label="Reporting Manager"
          name="manager"
          placeholder="Enter Reporting Manager"
          value={formData.manager}
          onChange={handleChange}
        />

        <FormInput
          label="Joining Date"
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          required
          error={errors.joiningDate}

        />
        <FormSelect
          label="Employment Type"
          options={employmentTypes}
          value={formData.employmentType}
          required
          error={errors.employmentType}
          onChange={(value) =>{
            setFormData((prev) => ({
              ...prev,
              employmentType: value,
            }))
            setErrors((prev) => ({
              ...prev,
              employmentType: "",
            }));}
            
          }
        />

        <FormInput
          label="Work Location"
          name="location"
          placeholder="Enter Work Location"
          value={formData.location}
          onChange={handleChange}
          required
          error={errors.location}
        />
        <FormSelect
          label="Employee Status"
          options={employeeStatus}
          value={formData.status}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              status: value,
            }))
          }
        />
      </div>
    </div>
  );
};

export default EmploymentSection;