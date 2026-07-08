import ROLES from "../../../config/roles";
import {ROUTES} from "../../../routes/routes";

const HERO_DATA = {
  [ROLES.ADMIN]: {
    badge: "Admin Command Center",

    description:
      "Monitor your workforce, payroll, attendance, sales and reports from one centralized dashboard.",

    status: "System Online",

    actions: [
      {
        id: 1,
        label: "Add Employee",
        icon: "employee",
        route: ROUTES.EMPLOYEE,
      },
      {
        id: 2,
        label: "Reports",
        icon: "reports",
        route: ROUTES.REPORTS,
      },
      {
        id: 3,
        label: "Refresh Dashboard",
        icon: "refresh",
        route: null,
      },
    ],
  },

  [ROLES.HR]: {
    badge: "Human Resource Dashboard",

    description:
      "Manage employee records, attendance, leave requests and recruitment activities from one workspace.",

    status: "HR Workspace Active",

    actions: [
      {
        id: 1,
        label: "New Employee",
        icon: "employee",
        route: ROUTES.EMPLOYEE,
      },
      {
        id: 2,
        label: "Leave Requests",
        icon: "leave",
        route: ROUTES.LEAVE,
      },
      {
        id: 3,
        label: "Employee Records",
        icon: "records",
        route: ROUTES.EMPLOYEE,
      },
    ],
  },

  [ROLES.ASM]: {
    badge: "Regional Sales Dashboard",

    description:
      "Track regional sales performance, monitor your sales team and achieve monthly business targets.",

    status: "Sales Region Active",

    actions: [
      {
        id: 1,
        label: "Team Targets",
        icon: "targets",
        route: ROUTES.SALES,
      },
      {
        id: 2,
        label: "Sales Reports",
        icon: "reports",
        route: ROUTES.REPORTS,
      },
      {
        id: 3,
        label: "Team Performance",
        icon: "performance",
        route: ROUTES.SALES,
      },
    ],
  },

  [ROLES.SALES_EXECUTIVE]: {
    badge: "Sales Performance Dashboard",

    description:
      "Manage daily visits, customer orders and monitor your personal sales performance.",

    status: "Ready For Today's Visits",

    actions: [
      {
        id: 1,
        label: "Add Visit",
        icon: "visit",
        route: ROUTES.SALES,
      },
      {
        id: 2,
        label: "Orders",
        icon: "orders",
        route: ROUTES.SALES,
      },
      {
        id: 3,
        label: "Route Plan",
        icon: "route",
        route: ROUTES.SALES,
      },
    ],
  },
};

export default HERO_DATA;
