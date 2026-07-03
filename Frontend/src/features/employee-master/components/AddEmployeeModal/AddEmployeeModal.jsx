import { X, UserPlus } from "lucide-react";

import PersonalSection from "./sections/PersonalSection";
import EmploymentSection from "./sections/EmploymentSection";
import SalarySection from "./sections/SalarySection";
import BankSection from "./sections/BankSection";
import DocumentsSection from "./sections/DocumentSection";

import ModalFooter from "./ModalFooter";

const AddEmployeeModal = ({ onClose }) => {
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
                Add New{" "}
                <span className="text-[var(--color-primary)]">
                  Employee
                </span>
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Create a new employee profile for your organization.
              </p>
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
          <PersonalSection />

          <EmploymentSection />

          <SalarySection />

          <BankSection />

          <DocumentsSection />
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
          <ModalFooter onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;