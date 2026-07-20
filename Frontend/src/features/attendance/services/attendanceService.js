/**
 * Attendance Service
 * ------------------
 * Thin facade that pages/components use to read/write attendance data.
 *
 * Data flow:
 *   Page → attendanceService → AttendanceDataProvider → (Backend later)
 *
 * This file MUST NOT import mock data directly. All data access goes
 * through `AttendanceDataProvider`. When the backend is ready, only the
 * provider is modified — this file and its consumers stay unchanged.
 *
 * Standard record model:
 *   {
 *     id, employeeId, employeeName, role, department, branch, avatar,
 *     date, checkIn, checkOut, breakMinutes, workingHours, overtime,
 *     status, shift, remarks
 *   }
 */

import AttendanceDataProvider from "../providers/AttendanceDataProvider";
import { CORRECTION_STATUS } from "../config/attendanceStatus";

// ---------- Employees ----------
const getEmployees = () => AttendanceDataProvider.fetchEmployees();

const getEmployeeById = (id) => AttendanceDataProvider.fetchEmployeeById(id);

const getEmployeeByName = (name) =>
  AttendanceDataProvider.fetchEmployeeByName(name);

const getDepartments = () => AttendanceDataProvider.fetchDepartments();

const getBranches = () => AttendanceDataProvider.fetchBranches();

// ---------- Attendance records ----------
const getAllRecords = () => AttendanceDataProvider.fetchAllRecords();

const getRecordsForEmployee = (empId) =>
  AttendanceDataProvider.fetchRecordsForEmployee(empId);

const getTodayRecords = () => AttendanceDataProvider.fetchTodayRecords();

const getRecordsForTeam = (employeeIds) =>
  AttendanceDataProvider.fetchRecordsForTeam(employeeIds);

// ---------- Corrections ----------
const getCorrections = () => AttendanceDataProvider.fetchCorrections();

const getCorrectionsForEmployee = (empId) =>
  AttendanceDataProvider.fetchCorrectionsForEmployee(empId);

const submitCorrection = ({ employee, form }) =>
  AttendanceDataProvider.createCorrection({ employee, form });

const approveCorrection = (id) =>
  AttendanceDataProvider.updateCorrectionStatus(id, CORRECTION_STATUS.APPROVED);

const rejectCorrection = (id) =>
  AttendanceDataProvider.updateCorrectionStatus(id, CORRECTION_STATUS.REJECTED);

// ---------- Notifications ----------
const getNotifications = () => AttendanceDataProvider.fetchNotifications();

const attendanceService = {
  getEmployees,
  getEmployeeById,
  getEmployeeByName,
  getDepartments,
  getBranches,
  getAllRecords,
  getRecordsForEmployee,
  getRecordsForTeam,
  getTodayRecords,
  getCorrections,
  getCorrectionsForEmployee,
  submitCorrection,
  approveCorrection,
  rejectCorrection,
  getNotifications,
};

export default attendanceService;
