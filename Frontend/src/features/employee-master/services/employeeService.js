import employees from "../mock/employees";

export const getEmployees = () => {
  return [...employees];
};

export const createEmployee = (employee) => {
  return employee;
};

export const updateEmployee = (employee) => {
  return employee;
};

export const deleteEmployee = (employeeId) => {
  return employeeId;
};

export const getEmployeeById = (employeeId) => {
  return employees.find(
    (employee) => employee.id === employeeId
  );
};