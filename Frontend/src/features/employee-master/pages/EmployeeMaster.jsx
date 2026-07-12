import EmployeeStats from "../components/EmployeeStats";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddEmployeeModal from "../components/AddEmployeeModal/AddEmployeeModal";
import EmployeeSearch from "../components/EmployeeSearch";
import EmployeeFilters from "../components/EmployeeFilters";
import EmployeeGrid from "../components/EmployeeGrid";
import employees from "../mock/employees";


const EmployeeMaster = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [employeeList, setEmployeeList] = useState(employees);

  const filteredEmployees = employeeList.filter((employee) => {
    const matchSearch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.id.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase());

    const matchDepartment = department === "" || employee.department === department;

    const matchRole = role === "" || employee.role === role;

    const matchStatus = status === "" || employee.status === status;

    return matchSearch && matchDepartment && matchRole && matchStatus;
  });

  const addEmployee = (newEmployee) => {

    setEmployeeList((prev) => {
      const lastEmployee = prev[prev.length - 1];
      const lastId = Number(lastEmployee.id.slice(3));
      const nextId = `EMP${String(lastId + 1).padStart(3, "0")}`;

      return [
        ...prev,
        {
          ...newEmployee,
          id: nextId,
        },
      ];
    });
  };

  const updateEmployee = (updatedEmployee) => {
    setEmployeeList((prev) =>
      prev.map((emp) =>
        emp.id === updatedEmployee.id ? { ...emp, ...updatedEmployee } : emp,
      ),
    );
  };

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
        <EmployeeStats />
      </div>
      {/* Search & Filters */}

      <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
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
              setSearch={setSearch}
            />
          </div>
        </div>
        <EmployeeGrid employees={filteredEmployees} onEdit={handleEdit} />
      </div>

      {openAddModal && (
        <AddEmployeeModal
          addEmployee={addEmployee}
          updateEmployee={updateEmployee}
          employee={selectedEmployee}
          isEditMode={isEditMode}
          onClose={() => setOpenAddModal(false)}
        />
      )}
    </>
  );
};

export default EmployeeMaster;
