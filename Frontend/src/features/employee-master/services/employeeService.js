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

export const uploadEmployeeDocument = async (employeeId, documentType, file) => {
  const form = new FormData();
  form.append("document", file);
  form.append("documentType", documentType);
  const { data } = await client.post(`/employees/${employeeId}/documents`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.document;
};

export const openEmployeeDocument = async (employeeId, documentId, download = false) => {
  const response = await client.get(`/employees/${employeeId}/documents/${documentId}/download`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.target = download ? "_self" : "_blank";
  if (download) link.download = "employee-document";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
