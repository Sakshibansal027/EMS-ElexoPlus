import { useMemo, useState } from "react";
import useAuth from "../../auth/hooks/useAuth";
import ROLES from "../../../config/roles";
import attendancePermissions from "../config/attendancePermissions";
import attendanceService from "../services/attendanceService";
import { ATTENDANCE_STATUS } from "../config/attendanceStatus";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Percent,
  Home,
  Plane,
} from "lucide-react";
const TABS = ["Overview", "All Records", "Corrections", "Reports"];

const useAttendance = () => {
  const { user } = useAuth();

  const role = user?.role;

  const permissions =
    attendancePermissions[role] || attendancePermissions[ROLES.SALES_EXECUTIVE];

  // ---------------------------------------
  // UI State
  // ---------------------------------------

  const [activeTab, setActiveTab] = useState("Overview");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [department, setDepartment] = useState("All");

  const [branch, setBranch] = useState("All");

  // ---------------------------------------
  // Data
  // ---------------------------------------

  const employees = attendanceService.getEmployees();

  const records = attendanceService.getAttendanceRecords();

  const todayRecords = attendanceService.getTodayAttendance();

  const corrections = attendanceService.getCorrections();

  // ---------------------------------------
  // Dropdown Data
  // ---------------------------------------

  const departments = useMemo(() => {
    return [...new Set(employees.map((e) => e.department))];
  }, [employees]);

  const branches = useMemo(() => {
    return [...new Set(employees.map((e) => e.branch))];
  }, [employees]);

  // ---------------------------------------
  // Filters
  // ---------------------------------------

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return records.filter((record) => {
      if (
        keyword &&
        !record.employeeName.toLowerCase().includes(keyword) &&
        !record.employeeId.toLowerCase().includes(keyword)
      ) {
        return false;
      }

      if (status !== "All" && record.status !== status) {
        return false;
      }

      if (department !== "All" && record.department !== department) {
        return false;
      }

      if (branch !== "All" && record.branch !== branch) {
        return false;
      }

      return true;
    });
  }, [records, search, status, department, branch]);

  // ---------------------------------------
  // Summary Cards
  // ---------------------------------------

  const stats = useMemo(() => {
    const count = (attendanceStatus) =>
      todayRecords.filter((record) => record.status === attendanceStatus)
        .length;

    const total = employees.length;

    const present = count(ATTENDANCE_STATUS.PRESENT);

    const late = count(ATTENDANCE_STATUS.LATE);

    const absent = count(ATTENDANCE_STATUS.ABSENT);

    const workFromHome = count(ATTENDANCE_STATUS.WFH);

    const leave = count(ATTENDANCE_STATUS.LEAVE);

    const halfDay = count(ATTENDANCE_STATUS.HALF_DAY);

    const attendancePercentage = total
      ? Math.round(((present + late + workFromHome) / total) * 100)
      : 0;

    return {
      total,
      present,
      late,
      absent,
      workFromHome,
      leave,
      halfDay,
      attendancePercentage,
    };
  }, [employees, todayRecords]);

  const statCards = useMemo(
    () => [
      {
        id: 1,
        title: "Total Employees",
        value: stats.total,
        icon: Users,
        tone: "default",
      },
      {
        id: 2,
        title: "Present",
        value: stats.present,
        icon: UserCheck,
        tone: "success",
      },
      {
        id: 3,
        title: "Late",
        value: stats.late,
        icon: Clock,
        tone: "warning",
      },
      {
        id: 4,
        title: "Absent",
        value: stats.absent,
        icon: UserX,
        tone: "danger",
      },
      {
        id: 5,
        title: "Half Day",
        value: stats.halfDay,
        icon: Clock,
        tone: "warning",
      },
      {
        id: 6,
        title: "Work From Home",
        value: stats.workFromHome,
        icon: Home,
        tone: "info",
      },
      {
        id: 7,
        title: "Leave",
        value: stats.leave,
        icon: Plane,
        tone: "primary",
      },
      {
        id: 8,
        title: "Attendance %",
        value: `${stats.attendancePercentage}%`,
        icon: Percent,
        tone: "primary",
      },
    ],
    [stats],
  );

  // ---------------------------------------
  // Charts
  // ---------------------------------------

  const breakdownChart = useMemo(() => {
    return [
      {
        name: "Present",
        value: stats.present,
      },
      {
        name: "Late",
        value: stats.late,
      },
      {
        name: "WFH",
        value: stats.workFromHome,
      },
      {
        name: "Half Day",
        value: stats.halfDay,
      },
      {
        name: "Leave",
        value: stats.leave,
      },
      {
        name: "Absent",
        value: stats.absent,
      },
    ].filter((item) => item.value > 0);
  }, [stats]);

  const departmentChart = useMemo(() => {
    return departments.map((dept) => {
      const departmentRecords = todayRecords.filter(
        (record) => record.department === dept,
      );

      const presentEmployees = departmentRecords.filter((record) =>
        [
          ATTENDANCE_STATUS.PRESENT,
          ATTENDANCE_STATUS.LATE,
          ATTENDANCE_STATUS.WFH,
        ].includes(record.status),
      ).length;

      return {
        name: dept,
        value: departmentRecords.length
          ? Math.round((presentEmployees / departmentRecords.length) * 100)
          : 0,
      };
    });
  }, [departments, todayRecords]);

  const trendChart = useMemo(() => {
    const grouped = {};

    records.forEach((record) => {
      const day = new Date(record.date).toLocaleDateString("en-US", {
        weekday: "short",
      });

      if (!grouped[day]) {
        grouped[day] = {
          day,
          present: 0,
          late: 0,
          absent: 0,
        };
      }

      switch (record.status) {
        case ATTENDANCE_STATUS.PRESENT:
        case ATTENDANCE_STATUS.WFH:
          grouped[day].present++;
          break;

        case ATTENDANCE_STATUS.LATE:
          grouped[day].late++;
          break;

        case ATTENDANCE_STATUS.ABSENT:
          grouped[day].absent++;
          break;

        default:
          break;
      }
    });

    return Object.values(grouped);
  }, [records]);

  // ---------------------------------------
  // Return
  // ---------------------------------------

  return {
    user,
    role,
    permissions,

    tabs: TABS,
    activeTab,
    setActiveTab,

    search,
    setSearch,

    status,
    setStatus,

    department,
    setDepartment,

    branch,
    setBranch,

    departments,
    branches,

    employees,
    records,
    filteredRecords,

    corrections,

    stats,
    statCards,

    charts: {
      breakdownChart,
      departmentChart,
      trendChart,
    },
  };
};

export default useAttendance;
