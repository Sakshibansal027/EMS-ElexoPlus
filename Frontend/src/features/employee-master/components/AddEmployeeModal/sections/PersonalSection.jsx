import { UserCircle } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";

const PersonalSection = ({ formData,
  handleChange,
  setFormData,
  errors,
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

      <div className="flex items-center gap-3 mb-6">

        <div
          className="
w-11
h-11
rounded-xl
bg-[rgba(244,194,28,.12)]
flex
items-center
justify-center
"
        >
          <UserCircle
            size={22}
            className="text-[var(--color-primary)]"
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold">
            Personal Information
          </h3>

          <p className="text-sm text-gray-400">
            Basic employee information
          </p>
        </div>

      </div>

      {/* Form */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <FormInput
          label="Employee ID"
          placeholder="EMP001"
        />

        <FormInput
          label="Full Name"
          name="name"
          placeholder="Enter Full Name"
          value={formData.name}

          onChange={handleChange}
          required
           error={errors.name}
        />

        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          required
           error={errors.email}
        />
        <FormInput
          label="Phone Number"
          name="phone"
          placeholder="+91 9876543210"
          value={formData.phone}
          onChange={handleChange}
          required
           error={errors.phone}
        />


        <FormSelect
          label="Gender"
          options={[
            "Select Gender",
            "Male",
            "Female",
            "Other",
          ]}
          value={formData.gender}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              gender: value,
            }))
          }
          required
          error={errors.gender}
        />

        <FormInput
          label="Date of Birth"
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />

      </div>

      {/* Address */}

      <div className="mt-6">

    <label className="text-sm font-medium text-gray-300">
  Address
  <span className="ml-1 text-red-500">*</span>
</label>

        <textarea
          rows={4}
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          error={errors.address}
          placeholder="Enter complete address..."
          className="
mt-2
w-full
rounded-xl
border
border-[var(--color-border)]
bg-[var(--color-input)]
px-4
py-3
outline-none
resize-none
transition-all
duration-300
focus:border-[var(--color-primary)]
focus:ring-2
focus:ring-[var(--color-primary)]/20
placeholder:text-gray-500
"         required
          
        />
{errors.address && (
  <p className="mt-2 text-sm text-red-500">
    {errors.address}
  </p>
)}
      </div>

    </div>
  );
};

export default PersonalSection;