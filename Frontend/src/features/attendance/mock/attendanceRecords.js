import { ATTENDANCE_STATUS } from "../config/attendanceStatus";

// Employees roster (reused for admin/HR views)
export const ATTENDANCE_EMPLOYEES = [
  { id: "EMP001", name: "Harshit Goel", role: "Administrator", department: "Management", branch: "Head Office", avatar: "HG" },
  { id: "EMP002", name: "Sakshi Bansal", role: "HR Manager", department: "Human Resources", branch: "Head Office", avatar: "SB" },
  { id: "EMP003", name: "Gaurav Kumar", role: "Area Sales Manager", department: "Sales", branch: "Delhi", avatar: "GK" },
  { id: "EMP004", name: "Nisha Barnwal", role: "Sales Executive", department: "Sales", branch: "Delhi", avatar: "NB" },
  { id: "EMP005", name: "Niyati Kansal", role: "Sales Executive", department: "Sales", branch: "Mumbai", avatar: "NK" },
  { id: "EMP006", name: "Rahul Sharma", role: "Sales Executive", department: "Sales", branch: "Bangalore", avatar: "RS" },
  { id: "EMP007", name: "Priya Verma", role: "HR Executive", department: "Human Resources", branch: "Head Office", avatar: "PV" },
  { id: "EMP008", name: "Aditya Mehra", role: "Sales Executive", department: "Sales", branch: "Pune", avatar: "AM" },
  { id: "EMP009", name: "Kavita Singh", role: "Area Sales Manager", department: "Sales", branch: "Mumbai", avatar: "KS" },
  { id: "EMP010", name: "Rohan Malhotra", role: "Sales Executive", department: "Sales", branch: "Delhi", avatar: "RM" },
  { id: "EMP011", name: "Neha Kapoor", role: "Sales Executive", department: "Sales", branch: "Bangalore", avatar: "NK" },
  { id: "EMP012", name: "Vikram Joshi", role: "Area Sales Manager", department: "Sales", branch: "Chennai", avatar: "VJ" },
];

const STATUSES_POOL = [
  ATTENDANCE_STATUS.PRESENT,
  ATTENDANCE_STATUS.PRESENT,
  ATTENDANCE_STATUS.PRESENT,
  ATTENDANCE_STATUS.PRESENT,
  ATTENDANCE_STATUS.LATE,
  ATTENDANCE_STATUS.WFH,
  ATTENDANCE_STATUS.HALF_DAY,
  ATTENDANCE_STATUS.ABSENT,
  ATTENDANCE_STATUS.LEAVE,
];

// Deterministic pseudo-random based on seed
const hash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
};

const generateForEmployee = (emp, daysBack = 45) => {
  const records = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < daysBack; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const day = date.getDay();
    let status;
    if (day === 0 || day === 6) status = ATTENDANCE_STATUS.WEEKEND;
    else {
      const seed = hash(emp.id + date.toDateString());
      status = STATUSES_POOL[seed % STATUSES_POOL.length];
    }

    let checkIn = null;
    let checkOut = null;
    let breakMinutes = 0;
    let workingHours = 0;
    let remarks = "";

    if (
      status === ATTENDANCE_STATUS.PRESENT ||
      status === ATTENDANCE_STATUS.LATE ||
      status === ATTENDANCE_STATUS.WFH
    ) {
      const inH = status === ATTENDANCE_STATUS.LATE ? 10 : 9;
      const inM = status === ATTENDANCE_STATUS.LATE ? 45 : (hash(emp.id + i) % 20);
      checkIn = new Date(date);
      checkIn.setHours(inH, inM, 0, 0);
      checkOut = new Date(date);
      checkOut.setHours(18, 30 + (hash(emp.id + i + "o") % 20), 0, 0);
      breakMinutes = 45 + (hash(emp.id + i + "b") % 30);
      workingHours = (checkOut - checkIn) / 3600000 - breakMinutes / 60;
      if (status === ATTENDANCE_STATUS.LATE) remarks = "Arrived late";
      if (status === ATTENDANCE_STATUS.WFH) remarks = "Working from home";
    } else if (status === ATTENDANCE_STATUS.HALF_DAY) {
      checkIn = new Date(date);
      checkIn.setHours(9, 15, 0, 0);
      checkOut = new Date(date);
      checkOut.setHours(13, 30, 0, 0);
      breakMinutes = 15;
      workingHours = 4;
      remarks = "Half day approved";
    } else if (status === ATTENDANCE_STATUS.LEAVE) {
      remarks = "Approved leave";
    } else if (status === ATTENDANCE_STATUS.ABSENT) {
      remarks = "No check-in recorded";
    }

    records.push({
      id: `${emp.id}-${date.toISOString().split("T")[0]}`,
      employeeId: emp.id,
      employeeName: emp.name,
      role: emp.role,
      department: emp.department,
      branch: emp.branch,
      avatar: emp.avatar,
      date: date.toISOString(),
      checkIn: checkIn ? checkIn.toISOString() : null,
      checkOut: checkOut ? checkOut.toISOString() : null,
      breakMinutes,
      workingHours: Math.max(0, workingHours),
      overtime: Math.max(0, workingHours - 8),
      status,
      shift: "General (09:00 - 18:00)",
      remarks,
    });
  }
  return records;
};

export const ATTENDANCE_RECORDS = ATTENDANCE_EMPLOYEES.flatMap((e) =>
  generateForEmployee(e, 60),
);

export const getRecordsForEmployee = (empId) =>
  ATTENDANCE_RECORDS.filter((r) => r.employeeId === empId);

export const getTodayRecords = () => {
  // If today is a weekend, fall back to the most recent working day so
  // dashboards remain populated for the demo.
  const ref = new Date();
  ref.setHours(0, 0, 0, 0);
  while (ref.getDay() === 0 || ref.getDay() === 6) {
    ref.setDate(ref.getDate() - 1);
  }
  return ATTENDANCE_RECORDS.filter((r) => {
    const d = new Date(r.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === ref.getTime();
  });
};
