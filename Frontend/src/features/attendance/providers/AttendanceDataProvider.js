/**
 * AttendanceDataProvider (Repository)
 * -----------------------------------
 * Single source of truth for all Attendance data. This is the ONLY file
 * in the Attendance module that touches raw/seed data. When the backend
 * is available, replace the internals of these methods with `fetch(...)`
 * / API-client calls — the exported shape stays the same, so
 * `attendanceService` and every page/component keep working unchanged.
 *
 * Data flow:
 *   Page → attendanceService → AttendanceDataProvider → (Backend later)
 *
 * Components and pages MUST NOT import from `../mock/*` or from this
 * provider directly. They go through `attendanceService`.
 */

import {
  ATTENDANCE_EMPLOYEES,
  ATTENDANCE_RECORDS,
} from "../mock/attendanceRecords";
import { CORRECTION_REQUESTS } from "../mock/corrections";
import { ATTENDANCE_NOTIFICATIONS } from "../mock/notifications";
import { CORRECTION_STATUS } from "../config/attendanceStatus";
// Simulated network latency so pages exercise their loading state.
// When wiring the real backend, remove `wait` and return the API promise.
const LATENCY_MS = 150;
const wait = (data, ms = LATENCY_MS) =>
  data;

// In-memory stores. Cloned from seed data so runtime mutations
// (approve/reject/submit) don't leak back into the seed arrays.
let _employees = ATTENDANCE_EMPLOYEES.map((e) => ({ ...e }));
let _records = ATTENDANCE_RECORDS.map((r) => ({ ...r }));
let _corrections = CORRECTION_REQUESTS.map((c) => ({ ...c }));
let _notifications = ATTENDANCE_NOTIFICATIONS.map((n) => ({ ...n }));

// ---------- Employees ----------
const fetchEmployees = () => wait(_employees.map((e) => ({ ...e })));

const fetchEmployeeById = (id) => {
  const emp = _employees.find((e) => e.id === id);
  return wait(emp ? { ...emp } : null);
};

const fetchEmployeeByName = (name) => {
  const emp = _employees.find((e) => e.name === name);
  return wait(emp ? { ...emp } : null);
};

const fetchDepartments = () =>
  wait([...new Set(_employees.map((e) => e.department))]);

const fetchBranches = () =>
  wait([...new Set(_employees.map((e) => e.branch))]);

// ---------- Attendance records ----------
const fetchAllRecords = () => wait(_records.map((r) => ({ ...r })));

const fetchRecordsForEmployee = (empId) =>
  wait(_records.filter((r) => r.employeeId === empId).map((r) => ({ ...r })));

const fetchRecordsForTeam = (employeeIds) =>
  wait(
    _records
      .filter((r) => employeeIds.includes(r.employeeId))
      .map((r) => ({ ...r })),
  );

const fetchTodayRecords = () => {
  // Fall back to the most recent working day so demo dashboards stay populated.
  const ref = new Date();
  ref.setHours(0, 0, 0, 0);
  while (ref.getDay() === 0 || ref.getDay() === 6) {
    ref.setDate(ref.getDate() - 1);
  }
  const today = _records
    .filter((r) => {
      const d = new Date(r.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === ref.getTime();
    })
    .map((r) => ({ ...r }));
  return wait(today);
};

// ---------- Corrections ----------
const fetchCorrections = () => wait(_corrections.map((c) => ({ ...c })));

const fetchCorrectionsForEmployee = (empId) =>
  wait(_corrections.filter((c) => c.employeeId === empId).map((c) => ({ ...c })));

const createCorrection = ({ employee, form }) => {
  const record = {
    id: `COR-${Math.floor(Math.random() * 9000) + 1000}`,
    employeeId: employee?.id,
    employeeName: employee?.name || "You",
    department: employee?.department || "—",
    date: form.date,
    requestedCheckIn: form.checkIn,
    requestedCheckOut: form.checkOut,
    reason: form.reason,
    status: CORRECTION_STATUS.PENDING,
    submittedOn: new Date().toISOString().slice(0, 10),
  };
  _corrections = [record, ..._corrections];
  return wait({ ...record });
};

const updateCorrectionStatus = (id, status) => {
  _corrections = _corrections.map((c) =>
    c.id === id ? { ...c, status } : c,
  );
  const updated = _corrections.find((c) => c.id === id);
  return wait(updated ? { ...updated } : null);
};

// ---------- Notifications ----------
const fetchNotifications = () => wait(_notifications.map((n) => ({ ...n })));

export const AttendanceDataProvider = {
  fetchEmployees,
  fetchEmployeeById,
  fetchEmployeeByName,
  fetchDepartments,
  fetchBranches,
  fetchAllRecords,
  fetchRecordsForEmployee,
  fetchRecordsForTeam,
  fetchTodayRecords,
  fetchCorrections,
  fetchCorrectionsForEmployee,
  createCorrection,
  updateCorrectionStatus,
  fetchNotifications,
};

