import { Landmark } from "lucide-react";
import FormInput from "../FormInput";

const BankSection = ({
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
          <Landmark
            size={22}
            className="text-[var(--color-primary)]"
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold">
            Bank Information
          </h3>

          <p className="text-sm text-gray-400">
            Employee banking details
          </p>
        </div>
      </div>

      {/* Form */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <FormInput
          label="Bank Name"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
        />

        <FormInput
          label="Account Number"
          name="accountNo"
          value={formData.accountNo}
          onChange={handleChange}
        />
        <FormInput
          label="IFSC Code"
          name="ifsc"
          value={formData.ifsc}
          onChange={handleChange}
        />

        <FormInput
          label="PAN Number"
          placeholder="ABCDE1234F"
          name="pan"
          value={formData.pan}
          onChange={handleChange}

        />

        <FormInput
          label="Aadhaar Number"
          placeholder="1234 5678 9012"

          name="aadhaar"
          value={formData.aadhaar}
          onChange={handleChange}

        />

        <FormInput
          label="UAN Number"
          placeholder="100123456789"
          name="uan"
          value={formData.uan}
          onChange={handleChange}
        />

      </div>
    </div>
  );
};

export default BankSection;