import client from "../../../api/client";

export const getEmployees = async () => {
  const { data } = await client.get("/employees");
  return data.employees || [];
};

export const createEmployee = async (employee) => {
  const { data } = await client.post("/employees", employee);
  return data.employee;
};

export const updateEmployee = async (employee) => {
  const { id, employeeId, ...payload } = employee;
  const { data } = await client.put(`/employees/${employeeId || id}`, payload);
  return data.employee;
};

export const deleteEmployee = async (employeeId) => {
  await client.delete(`/employees/${employeeId}`);
};

export const getEmployeeById = async (employeeId) => {
  const { data } = await client.get(`/employees/${employeeId}`);
  return data.employee;
};
