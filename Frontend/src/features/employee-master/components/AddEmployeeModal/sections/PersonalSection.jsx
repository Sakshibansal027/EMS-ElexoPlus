import { UserCircle } from "lucide-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";

const PersonalSection = () => {
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
          placeholder="Enter Full Name"
          required
        />

        <FormInput
          label="Email"
          type="email"
          placeholder="example@email.com"
          required
        />

        <FormInput
          label="Phone Number"
          placeholder="+91 9876543210"
          required
        />
        

        <FormSelect
          label="Gender"
          options={[
            "Select Gender",
            "Male",
            "Female",
            "Other",
          ]}
        />

        <FormInput
          label="Date of Birth"
          type="date"
        />

      </div>

      {/* Address */}

      <div className="mt-6">

        <label className="text-sm font-medium text-gray-300">
          Address
        </label>

        <textarea
          rows={4}
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
"
        />

      </div>

    </div>
  );
};

export default PersonalSection;