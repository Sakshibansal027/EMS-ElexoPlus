import {
  Users,
  CalendarDays,
  ClipboardCheck,
  IndianRupee,
  FileText,
  Settings,
  BriefcaseBusiness,
  Target,
  Receipt,
  UserCircle,
} from "lucide-react";

import ROLES from "../../../config/roles";
import { ROUTES } from "../../../routes/routes";

const QUICK_ACTION_DATA = {
  [ROLES.ADMIN]: [
    {
      id: 1,
      title: "Employee Master",
      icon: Users,
      route: ROUTES.EMPLOYEE,
    },
    {
      id: 2,
      title: "Attendance",
      icon: CalendarDays,
      route: ROUTES.ATTENDANCE,
    },
    {
      id: 3,
      title: "Leave",
      icon: ClipboardCheck,
      route: ROUTES.LEAVE,
    },
    {
      id: 4,
      title: "Payroll",
      icon: IndianRupee,
      route: ROUTES.PAYROLL,
    },
    {
      id: 5,
      title: "Reports",
      icon: FileText,
      route: ROUTES.REPORTS,
    },
    {
      id: 6,
      title: "Settings",
      icon: Settings,
      route: ROUTES.SETTINGS,
    },
  ],
  [ROLES.HR]: [
    {
      id: 1,
      title: "Employee Master",
      icon: Users,
      route: ROUTES.EMPLOYEE,
    },
    {
      id: 2,
      title: "Attendance",
      icon: CalendarDays,
      route: ROUTES.ATTENDANCE,
    },
    {
      id: 3,
      title: "Leave",
      icon: ClipboardCheck,
      route: ROUTES.LEAVE,
    },
    {
      id: 4,
      title: "Reports",
      icon: FileText,
      route: ROUTES.REPORTS,
    },
    {
      id: 5,
      title: "Settings",
      icon: Settings,
      route: ROUTES.SETTINGS,
    },
    {
      id: 6,
      title: "Employee Master",
      icon: BriefcaseBusiness,
      route: ROUTES.EMPLOYEE,
    },
  ],
  [ROLES.ASM]: [
    {
      id: 1,
      title: "Sales",
      icon: Target,
      route: ROUTES.SALES,
    },
    {
      id: 2,
      title: "Attendance",
      icon: CalendarDays,
      route: ROUTES.ATTENDANCE,
    },
    {
      id: 3,
      title: "Leave",
      icon: ClipboardCheck,
      route: ROUTES.LEAVE,
    },
    {
      id: 4,
      title: "Reports",
      icon: FileText,
      route: ROUTES.REPORTS,
    },
    {
      id: 5,
      title: "Team Performance",
      icon: Users,
      route: ROUTES.SALES,
    },
    {
      id: 6,
      title: "Settings",
      icon: Settings,
      route: ROUTES.SETTINGS,
    },
  ],
  [ROLES.SALES_EXECUTIVE]: [
    {
      id: 1,
      title: "Sales",
      icon: Target,
      route: ROUTES.SALES,
    },
    {
      id: 2,
      title: "Attendance",
      icon: CalendarDays,
      route: ROUTES.ATTENDANCE,
    },
    {
      id: 3,
      title: "Leave",
      icon: ClipboardCheck,
      route: ROUTES.LEAVE,
    },
    {
      id: 4,
      title: "Daily Activity",
      icon: FileText,
      route: ROUTES.SALES,
    },
    {
      id: 5,
      title: "Expenses",
      icon: Receipt,
      route: ROUTES.SALES,
    },
    {
      id: 6,
      title: "Profile",
      icon: UserCircle,
      route: ROUTES.SETTINGS,
    },
  ],
};

export default QUICK_ACTION_DATA;
