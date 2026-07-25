import { AttendanceDataProvider } from "../providers/AttendanceDataProvider";
import { CORRECTION_STATUS } from "../config/attendanceStatus";

const getEmployees = () => AttendanceDataProvider.fetchEmployees();

const getEmployeeById = (id) =>
  AttendanceDataProvider.fetchEmployeeById(id);

const getEmployeeByName = (name) =>
  AttendanceDataProvider.fetchEmployeeByName(name);

const getDepartments = () =>
  AttendanceDataProvider.fetchDepartments();

const getBranches = () =>
  AttendanceDataProvider.fetchBranches();

const getAttendanceRecords = () =>
  AttendanceDataProvider.fetchAllRecords();

const getAllRecords = getAttendanceRecords;

const getEmployeeAttendance = (employeeId) =>
  AttendanceDataProvider.fetchRecordsForEmployee(employeeId);

const getRecordsForEmployee = getEmployeeAttendance;

const getTodayAttendance = () =>
  AttendanceDataProvider.fetchTodayRecords();

const getTodayRecords = getTodayAttendance;

const getTeamAttendance = (employeeIds) =>
  AttendanceDataProvider.fetchRecordsForTeam(employeeIds);

const getRecordsForTeam = getTeamAttendance;

const getCorrections = () =>
  AttendanceDataProvider.fetchCorrections();

const getEmployeeCorrections = (employeeId) =>
  AttendanceDataProvider.fetchCorrectionsForEmployee(employeeId);

const getCorrectionsForEmployee = getEmployeeCorrections;

const submitCorrection = ({ employee, form }) =>
  AttendanceDataProvider.createCorrection({ employee, form });

const approveCorrection = (id) =>
  AttendanceDataProvider.updateCorrectionStatus(
    id,
    CORRECTION_STATUS.APPROVED
  );

const rejectCorrection = (id) =>
  AttendanceDataProvider.updateCorrectionStatus(
    id,
    CORRECTION_STATUS.REJECTED
  );

const getNotifications = () =>
  AttendanceDataProvider.fetchNotifications();

export const attendanceService = {
  getEmployees,
  getEmployeeById,
  getEmployeeByName,
  getDepartments,
  getBranches,

  getAttendanceRecords,
  getAllRecords,

  getEmployeeAttendance,
  getRecordsForEmployee,

  getTodayAttendance,
  getTodayRecords,

  getTeamAttendance,
  getRecordsForTeam,

  getCorrections,
  getEmployeeCorrections,
  getCorrectionsForEmployee,

  submitCorrection,
  approveCorrection,
  rejectCorrection,

  getNotifications,
};