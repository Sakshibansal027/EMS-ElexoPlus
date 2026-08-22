import { X, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PersonalSection from "./sections/PersonalSection";
import EmploymentSection from "./sections/EmploymentSection";
import SalarySection from "./sections/SalarySection";
import BankSection from "./sections/BankSection";
import DocumentsSection from "./sections/DocumentSection";
import { uploadEmployeeDocument } from "../../services/employeeService";

import ModalFooter from "./ModalFooter";

const AddEmployeeModal = ({ onClose, addEmployee, isEditMode, updateEmployee, employee }) => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "",
    role: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
    joiningDate: "",
    manager: "",
    employmentType: "",
    location: "",
    status: "Active",
    bankName: "",
    accountNo: "",
    ifsc: "",
    pan: "",
    aadhaar: "",
    uan: "",
    grossSalary: "",
    basicSalary: "",
    hra: "",
    allowance: "",
    bonus: "",
    netSalary: ""
  });


  useEffect(() => {
    if (employee) {
      void Promise.resolve().then(() => setFormData(employee));
    }
  }, [employee]);
  
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [documentFiles, setDocumentFiles] = useState({});
  const formTopRef = useRef(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone Number must be 10 digits";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = "Joining Date is required";
    }

    if (!formData.employmentType) {
      newErrors.employmentType = "Employment Type is required";
    }

    if (!formData.location) {
      newErrors.location = "Work Location is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      setErrors((prev) => ({ ...prev, form: "Please complete the required fields before saving." }));
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    try {
      setIsSaving(true);
      const savedEmployee = isEditMode ? await updateEmployee(formData) : await addEmployee(formData);
      await Promise.all(Object.entries(documentFiles).filter(([, file]) => file).map(([type, file]) => uploadEmployeeDocument(savedEmployee.id, type, file)));
      onClose();
    } catch (error) {
      setErrors({ form: error.response?.data?.message || "Unable to save employee. Please try again." });
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } finally {
      setIsSaving(false);
    }
  };
  const handleReset = () => {
  setFormData({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    designation: "",
    address: "",
    gender: "",
    dob: "",

    joiningDate: "",
    manager: "",
    employmentType: "",
    location: "",
    status: "Active",

    bankName: "",
    accountNo: "",
    ifsc: "",

    pan: "",
    aadhaar: "",
    uan: "",

    grossSalary: "",
    basicSalary: "",
    hra: "",
    allowance: "",
    bonus: "",
    netSalary: "",

    casualLeave: 0,
    earnedLeave: 0,
    sickLeave: 0,

    documents: [
      { name: "PAN Card", status: "Pending" },
      { name: "Aadhaar", status: "Pending" },
      { name: "Resume", status: "Pending" },
      { name: "Offer Letter", status: "Pending" },
    ],
  });
  setErrors({});
};
return (
  <div
    className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/70
      backdrop-blur-sm
      p-6
    "
  >
    {/* Modal */}

    <div
      className="
        relative
        flex
        h-[92vh]
        w-full
        max-w-6xl
        flex-col
        overflow-hidden
        rounded-3xl
        border
        border-[var(--color-border)]
        bg-[var(--color-card)]
        shadow-2xl
      "
    >
      {/* Header */}

      <div
        className="
          shrink-0
          flex
          items-center
          justify-between
          border-b
          border-[var(--color-border)]
          bg-[var(--color-card)]
          px-8
          py-6
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-[var(--color-primary)]
              text-black
            "
          >
            <UserPlus size={28} />
          </div>

          <div>

            <h2 className="text-3xl font-bold">
              {isEditMode ? "Edit " : "Add "}
              <span className="text-[var(--color-primary)]">
                Employee
              </span>
            </h2>



            {isEditMode ? (
              <p className="mt-1 text-sm text-gray-400">
                Update the employee profile in your organization.
              </p>
            ) : (
              <p className="mt-1 text-sm text-gray-400">
                Create a new employee profile for your organization.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="
            flex
            h-11
            w-11
            cursor-pointer
            items-center
            justify-center
            rounded-xl
            bg-[var(--color-secondary)]
            transition-all
            duration-300
            hover:bg-red-500
            hover:text-white
          "
        >
          <X size={22} />
        </button>

      </div>

      {errors.form && (
        <div className="shrink-0 border-b border-red-500/30 bg-red-500/10 px-8 py-3 text-sm text-red-300" role="alert">
          {errors.form}
        </div>
      )}

      {/* Scrollable Form */}

      <div
        className="
          flex-1
          overflow-y-auto
          px-8
          py-8
          space-y-10
        "
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#F4C21C transparent",
        }}
      >
        <div ref={formTopRef} />
        <PersonalSection
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
          errors={errors} />

        <EmploymentSection
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors} />

        <SalarySection
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData} />

        <BankSection
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData} />

        <DocumentsSection
          documentFiles={documentFiles}
          onFileChange={(type, file) => setDocumentFiles((previous) => ({ ...previous, [type]: file }))} />
      </div>

      {/* Footer */}

      <div
        className="
          shrink-0
          border-t
          border-[var(--color-border)]
          bg-[var(--color-card)]
        "
      >
        <ModalFooter onClose={onClose} onSave={handleSubmit} onReset={handleReset} isEditMode={isEditMode} isSaving={isSaving} />
      </div>

    </div>
  </div>
);
};





export default AddEmployeeModal;
