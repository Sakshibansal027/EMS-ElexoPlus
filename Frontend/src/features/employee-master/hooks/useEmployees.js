import { useState, useMemo, useEffect, useCallback } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee, deleteEmployee as removeEmployee,
} from "../services/employeeService";

const useEmployees = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [department, setDepartment] = useState("");
const [role, setRole] = useState("");
const [status, setStatus] = useState("");
const [search, setSearch] = useState("");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setEmployeeList(await getEmployees());
      setError(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load employees.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(refresh); }, [refresh]);

  const addEmployee = async (newEmployee) => {
    const employee = await createEmployee(newEmployee);
    setEmployeeList((prev) => [employee, ...prev]);
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

  const editEmployee = async (updatedEmployee) => {
    const employee = await updateEmployee(updatedEmployee);

    setEmployeeList((prev) =>
      prev.map((emp) =>
        emp.id === employee.id
          ? employee
          : emp
      )
    );
  };

  const deleteEmployee = async (employeeId) => {
    await removeEmployee(employeeId);
    setEmployeeList((prev) => prev.filter((employee) => employee.id !== employeeId));
};

  return {
  employeeList,
  loading,
  error,
  refresh,
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
