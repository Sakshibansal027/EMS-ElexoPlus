import { useState, useMemo} from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
} from "../services/employeeService";

const useEmployees = () => {
  const [employeeList, setEmployeeList] = useState(getEmployees());
  const [department, setDepartment] = useState("");
const [role, setRole] = useState("");
const [status, setStatus] = useState("");
const [search, setSearch] = useState("");

  const addEmployee = (newEmployee) => {
    setEmployeeList((prev) => {
      const lastEmployee = prev[prev.length - 1];
      const lastId = Number(lastEmployee.id.slice(3));
      const nextId = `EMP${String(lastId + 1).padStart(3, "0")}`;

      const employee = {
        ...newEmployee,
        id: nextId,
      };

      createEmployee(employee);

      return [...prev, employee];
    });
  };

  const filteredEmployees = useMemo(() => {
  return employeeList.filter((employee) => {
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

    return (
      matchSearch &&
      matchDepartment &&
      matchRole &&
      matchStatus
    );
  });
}, [
  employeeList,
  search,
  department,
  role,
  status,
]);


const stats = {
  totalEmployees: employeeList.length,

  activeEmployees: employeeList.filter(
    (employee) => employee.status === "Active"
  ).length,

  inactiveEmployees: employeeList.filter(
    (employee) => employee.status === "Inactive"
  ).length,

  totalDepartments: new Set(
    employeeList.map((employee) => employee.department)
  ).size,
};

const resetFilters = () => {
  setSearch("");
  setDepartment("");
  setRole("");
  setStatus("");
};

  const editEmployee = (updatedEmployee) => {
    updateEmployee(updatedEmployee);

    setEmployeeList((prev) =>
      prev.map((emp) =>
        emp.id === updatedEmployee.id
          ? { ...emp, ...updatedEmployee }
          : emp
      )
    );
  };

  const deleteEmployee = (employeeId) => {
  setEmployeeList((prev) =>
    prev.filter((employee) => employee.id !== employeeId)
  );
};

  return {
  employeeList,
  filteredEmployees,
  stats,
  search,
  setSearch,
  department,
  setDepartment,
  role,
  setRole,
  status,
  resetFilters,
  setStatus,
  addEmployee,
  editEmployee,
  deleteEmployee,
};
};

export default useEmployees;