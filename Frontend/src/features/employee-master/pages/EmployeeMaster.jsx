import EmployeeStats from "../components/EmployeeStats";
import { Plus } from "lucide-react"
import { useState } from "react";
import AddEmployeeModal from "../components/AddEmployeeModal/AddEmployeeModal";
import EmployeeSearch from "../components/EmployeeSearch";
import EmployeeFilters from "../components/EmployeeFilters";
import EmployeeGrid from "../components/EmployeeGrid";
import employees from "../data/employee";
const EmployeeMaster = () => {
    const [openAddModal, setOpenAddModal] = useState(false);
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
  const matchDepartment =
    department === "" || employee.department === department;

  const matchRole =
    role === "" || employee.role === role;

  const matchStatus =
    status === "" || employee.status === status;

  return matchSearch&&matchDepartment && matchRole && matchStatus;
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
    return (

        <>
            <main className="p-8" >

                {/* Header */}
                <div className="flex items-center justify-between">

                    {/* Left Content */}
                    <div>
                        <h1 className="text-3xl font-bold">
                            Employee{" "}
                            <span className="text-[var(--color-primary)]">
                                Master
                            </span>
                        </h1>

                        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                            Manage all{" "}
                            <span className="text-[var(--color-primary)] font-medium">
                                employees
                            </span>{" "}
                            in your organization.
                        </p>
                    </div>

                    {/* Add Employee Button */}
                    <button className="btn-primary flex items-center gap-2 px-5 py-3 font-medium cursor-pointer
             hover:scale-105 hover:shadow-lg transition-all duration-300 font-semibold"
                        onClick={() => setOpenAddModal(true)}
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

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                        <div className="w-full xl:flex-1">
                            <EmployeeSearch
    search={search}
    setSearch={setSearch}
/>
                        </div>

                        <EmployeeFilters 
                            department={department}
                            setDepartment={setDepartment}
                            role={role}
                            setRole={setRole}
                            status={status}
                            setStatus={setStatus}
                            setSearch={setSearch} />


                    </div>
                  <EmployeeGrid employees={filteredEmployees} />

                </div>
            </main>
            {
                openAddModal && (
                    <AddEmployeeModal
                       addEmployee={addEmployee}
                        onClose={() => setOpenAddModal(false)}
                    />
                )}
        </>
    );
};

export default EmployeeMaster;