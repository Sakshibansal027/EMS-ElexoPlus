import client from "../../../api/client";
import { SETTINGS_TABS } from "../config/settingsTabs";

export const getSettingsTabs = () => {
  return SETTINGS_TABS;
};

// ─── Company Settings ──────────────────────────────────────────

export const getCompanySettings = async () => {
  const { data } = await client.get("/settings/company");
  return data.settings;
};

export const updateCompanySettings = async (settings) => {
  const { data } = await client.put("/settings/company", settings);
  return data;
};

// ─── Departments ───────────────────────────────────────────────

export const getDepartments = async () => {
  const { data } = await client.get("/settings/departments");
  return data.departments;
};

export const createDepartment = async (department) => {
  const { data } = await client.post("/settings/departments", department);
  return data;
};

export const updateDepartment = async (id, department) => {
  const { data } = await client.put(`/settings/departments/${id}`, department);
  return data;
};

export const deleteDepartment = async (id) => {
  const { data } = await client.delete(`/settings/departments/${id}`);
  return data;
};

// ─── Designations ──────────────────────────────────────────────

export const getDesignations = async () => {
  const { data } = await client.get("/settings/designations");
  return data.designations;
};

export const createDesignation = async (designation) => {
  const { data } = await client.post("/settings/designations", designation);
  return data;
};

export const updateDesignation = async (id, designation) => {
  const { data } = await client.put(`/settings/designations/${id}`, designation);
  return data;
};

export const deleteDesignation = async (id) => {
  const { data } = await client.delete(`/settings/designations/${id}`);
  return data;
};

// ─── Employment Types ──────────────────────────────────────────

export const getEmploymentTypes = async () => {
  const { data } = await client.get("/settings/employment-types");
  return data.employmentTypes;
};

export const createEmploymentType = async (type) => {
  const { data } = await client.post("/settings/employment-types", type);
  return data;
};

export const updateEmploymentType = async (id, type) => {
  const { data } = await client.put(`/settings/employment-types/${id}`, type);
  return data;
};

export const deleteEmploymentType = async (id) => {
  const { data } = await client.delete(`/settings/employment-types/${id}`);
  return data;
};

// ─── Employee Statuses ─────────────────────────────────────────

export const getEmployeeStatuses = async () => {
  const { data } = await client.get("/settings/employee-statuses");
  return data.statuses;
};

export const createEmployeeStatus = async (status) => {
  const { data } = await client.post("/settings/employee-statuses", status);
  return data;
};

export const updateEmployeeStatus = async (id, status) => {
  const { data } = await client.put(`/settings/employee-statuses/${id}`, status);
  return data;
};

export const deleteEmployeeStatus = async (id) => {
  const { data } = await client.delete(`/settings/employee-statuses/${id}`);
  return data;
};

// ─── User Preferences ──────────────────────────────────────────

export const getPreferences = async () => {
  const { data } = await client.get("/settings/preferences");
  return data.preferences;
};

export const updatePreferences = async (preferences) => {
  const { data } = await client.put("/settings/preferences", preferences);
  return data;
};
