import EmployeeStats from "../components/EmployeeStats";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddEmployeeModal from "../components/AddEmployeeModal/AddEmployeeModal";
import EmployeeSearch from "../components/EmployeeSearch";
import EmployeeFilters from "../components/EmployeeFilters";
import EmployeeGrid from "../components/EmployeeGrid";
import InlineLoader from "../../../components/common/InlineLoader";


import useEmployees from "../hooks/useEmployees";

const EmployeeMaster = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    filteredEmployees,
    stats,
    search,
    setSearch,
    department,
    setDepartment,
    role,
    setRole,
    status,
    setStatus,
    addEmployee,
    editEmployee,
    deleteEmployee,
    resetFilters,
    loading,
    error,
  } = useEmployees();


  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsEditMode(true);
    setOpenAddModal(true);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-10 flex items-start justify-between">
        {/* Left Content */}
        <div>
          <p className="mt-2 text-lg text-foreground-muted">
            Manage all{" "}
            <span className="font-semibold text-primary">
              employees
            </span>{" "}
            in your organization.
          </p>
        </div>

        {/* Add Employee Button */}
        <button
          className="btn-primary flex items-center gap-2 px-5 py-3 font-medium cursor-pointer
             hover:scale-105 hover:shadow-lg transition-all duration-300 font-semibold"
          onClick={() => {
            setSelectedEmployee(null);
            setIsEditMode(false);
            setOpenAddModal(true);
          }}
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>
      {/* Employee Statistics */}
      <div className="mt-8">
        <EmployeeStats stats={stats} />
      </div>
      {/* Search & Filters */}

      <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        <div className="space-y-5">
          {/* Full Width Search */}
          <EmployeeSearch search={search} setSearch={setSearch} />

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <EmployeeFilters
              department={department}
              setDepartment={setDepartment}
              role={role}
              setRole={setRole}
              status={status}
              setStatus={setStatus}
              resetFilters={resetFilters}

            />
          </div>
        </div>
        {loading ? <InlineLoader message="Loading employees..." /> : <EmployeeGrid employees={filteredEmployees} onEdit={handleEdit} onDelete={deleteEmployee} />}
      </div>

      {openAddModal && (
        <AddEmployeeModal
          addEmployee={addEmployee}
          updateEmployee={editEmployee}
          employee={selectedEmployee}
          isEditMode={isEditMode}
          onClose={() => setOpenAddModal(false)}
        />
      )}
    </>
  );
};

export default EmployeeMaster;
