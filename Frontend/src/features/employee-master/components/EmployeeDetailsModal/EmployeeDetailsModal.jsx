import EmployeeHeader from "./EmployeeHeader";
import SectionTitle from "./SectionTitle";
import InfoGrid from "./InfoGrid";
import SalarySection from "./SalarySection";
import LeaveSection from "./LeaveSection";
import DocumentsSection from "./DocumentsSection";
import FooterActions from "./FooterActions";

import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Building2,
} from "lucide-react";

const EmployeeDetailsModal = ({ employee, onClose }) => {
  if (!employee) return null;

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
      <div
        className="
        max-h-[92vh]
        w-full
        max-w-6xl
        overflow-y-auto
        rounded-3xl
        border
        border-[var(--color-border)]
        bg-[var(--color-background)]
        shadow-2xl
        "
        style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#F4C21C transparent",
          }}
      >
        {/* Header */}

        <EmployeeHeader
          employee={employee}
          onClose={onClose}
        />

        {/* Body */}

        <div className="p-8">

          {/* Personal */}

          <SectionTitle title="Personal Information" />

          <InfoGrid
            items={[
              {
                icon: Mail,
                label: "Email",
                value: employee.email,
              },
              {
                icon: Phone,
                label: "Phone",
                value: employee.phone,
              },
              {
                icon: Calendar,
                label: "Date of Birth",
                value: employee.dob,
              },
              {
                icon: MapPin,
                label: "Address",
                value: employee.address,
              },
              {
                icon: Building2,
                label: "Department",
                value: employee.department,
              },
              {
                icon: User,
                label: "Reporting Manager",
                value: employee.manager,
              },
            ]}
          />

          {/* Salary */}

          <SalarySection employee={employee} />

          {/* Leave */}

          <LeaveSection employee={employee} />

          {/* Documents */}

          <DocumentsSection employee={employee} />

          {/* Footer */}

          <FooterActions onClose={onClose} />

        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;