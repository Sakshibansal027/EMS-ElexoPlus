
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

import {
  ATTENDANCE_RECORDS,
  ATTENDANCE_EMPLOYEES,
  getTodayRecords,
  getRecordsForEmployee,
} from "../mock/attendanceRecords";

import { CORRECTION_REQUESTS } from "../mock/corrections";

const attendanceService = {
  // =====
  // Dashboard / Overview
  // =====

  getEmployees() {
    return ATTENDANCE_EMPLOYEES;
  },

  getAttendanceRecords() {
    return ATTENDANCE_RECORDS;
  },

  getTodayAttendance() {
    return getTodayRecords();
  },

  // =====
  // Employee
  // =====

  getEmployeeAttendance(employeeId) {
    return getRecordsForEmployee(employeeId);
  },

  getEmployeeCorrections(employeeId) {
    return CORRECTION_REQUESTS.filter(
      (item) => item.employeeId === employeeId
    );
  },

  // =====
  // Team
  // =====

  getTeamAttendance(branch) {
    const teamIds = ATTENDANCE_EMPLOYEES.filter(
      (employee) => employee.branch === branch
    ).map((employee) => employee.id);

    return ATTENDANCE_RECORDS.filter((record) =>
      teamIds.includes(record.employeeId)
    );
  },

  // =====
  // Corrections
  // =====

  getCorrections() {
    return CORRECTION_REQUESTS;
  },

  approveCorrection(correctionId) {
    console.log("Approve Correction :", correctionId);

    // Backend API
    // PATCH /attendance/corrections/:id/approve
  },

  rejectCorrection(correctionId) {
    console.log("Reject Correction :", correctionId);

    // Backend API
    // PATCH /attendance/corrections/:id/reject
  },

  // =====
  // Attendance Actions
  // =====

  checkIn() {
    console.log("Check In");

    // POST /attendance/check-in
  },

  checkOut() {
    console.log("Check Out");

    // POST /attendance/check-out
  },

  startBreak() {
    console.log("Start Break");

    // POST /attendance/break/start
  },

  endBreak() {
    console.log("End Break");

    // POST /attendance/break/end
  },

  // =====
  // Reports
  // =====

  exportCSV() {
    console.log("Export CSV");
  },

  exportPDF() {
    console.log("Export PDF");
  },

  exportExcel() {
    console.log("Export Excel");
  },
};

export default attendanceService;
