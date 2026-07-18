import {
  ATTENDANCE_RECORDS,
  ATTENDANCE_EMPLOYEES,
  getTodayRecords,
  getRecordsForEmployee,
} from "../mock/attendanceRecords";

import { CORRECTION_REQUESTS } from "../mock/corrections";

const attendanceService = {
  // ==========================
  // Dashboard / Overview
  // ==========================

  getEmployees() {
    return ATTENDANCE_EMPLOYEES;
  },

  getAttendanceRecords() {
    return ATTENDANCE_RECORDS;
  },

  getTodayAttendance() {
    return getTodayRecords();
  },

  // ==========================
  // Employee
  // ==========================

  getEmployeeAttendance(employeeId) {
    return getRecordsForEmployee(employeeId);
  },

  getEmployeeCorrections(employeeId) {
    return CORRECTION_REQUESTS.filter(
      (item) => item.employeeId === employeeId
    );
  },

  // ==========================
  // Team
  // ==========================

  getTeamAttendance(branch) {
    const teamIds = ATTENDANCE_EMPLOYEES.filter(
      (employee) => employee.branch === branch
    ).map((employee) => employee.id);

    return ATTENDANCE_RECORDS.filter((record) =>
      teamIds.includes(record.employeeId)
    );
  },

  // ==========================
  // Corrections
  // ==========================

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

  // ==========================
  // Attendance Actions
  // ==========================

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

  // ==========================
  // Reports
  // ==========================

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