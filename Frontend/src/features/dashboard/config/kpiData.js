import ROLES from "../../../config/roles";
import { ROUTES } from "../../../routes/routes";

const KPI_DATA = {
  /* ==========================================================
                          ADMIN
  ========================================================== */

  [ROLES.ADMIN]: [
    {
      id: 1,
      title: "Total Employees",
      value: "248",
      subtitle: "+12 This Month",
      trend: "up",
      icon: "employees",
      route: ROUTES.EMPLOYEE,
    },

    {
      id: 2,
      title: "Monthly Payroll",
      value: "₹18.4 L",
      subtitle: "June Payroll",
      trend: "neutral",
      icon: "payroll",
      route: ROUTES.PAYROLL,
    },

    {
      id: 3,
      title: "Sales Revenue",
      value: "₹1.28 Cr",
      subtitle: "+18.2% Growth",
      trend: "up",
      icon: "sales",
      route: ROUTES.SALES,
    },

    {
      id: 4,
      title: "Pending Approvals",
      value: "12",
      subtitle: "Needs Attention",
      trend: "down",
      icon: "approval",
      route: ROUTES.LEAVE,
    },
  ],

  /* ==========================================================
                              HR
  ========================================================== */

  [ROLES.HR]: [
    {
      id: 1,
      title: "Active Employees",
      value: "236",
      subtitle: "Current Workforce",
      trend: "up",
      icon: "employees",
      route: ROUTES.EMPLOYEE,
    },

    {
      id: 2,
      title: "New Joinees",
      value: "08",
      subtitle: "This Month",
      trend: "up",
      icon: "joining",
      route: ROUTES.EMPLOYEE,
    },

    {
      id: 3,
      title: "Pending Leave Requests",
      value: "14",
      subtitle: "Awaiting Approval",
      trend: "neutral",
      icon: "leave",
      route: ROUTES.LEAVE,
    },

    {
      id: 4,
      title: "Pending Documents",
      value: "19",
      subtitle: "Verification Required",
      trend: "down",
      icon: "documents",
      route: ROUTES.EMPLOYEE,
    },
  ],

  /* ==========================================================
                              ASM
  ========================================================== */

  [ROLES.ASM]: [
    {
      id: 1,
      title: "Team Members",
      value: "18",
      subtitle: "Across Territories",
      trend: "neutral",
      icon: "team",
      route: ROUTES.SALES,
    },

    {
      id: 2,
      title: "Target Achievement",
      value: "82%",
      subtitle: "+6% This Month",
      trend: "up",
      icon: "target",
      route: ROUTES.SALES,
    },

    {
      id: 3,
      title: "Regional Sales",
      value: "₹42.5 L",
      subtitle: "Current Month",
      trend: "up",
      icon: "sales",
      route: ROUTES.SALES,
    },

    {
      id: 4,
      title: "Field Visits",
      value: "36",
      subtitle: "Today",
      trend: "neutral",
      icon: "visits",
      route: ROUTES.ATTENDANCE,
    },
  ],

  /* ==========================================================
                      SALES EXECUTIVE
  ========================================================== */

  [ROLES.SALES_EXECUTIVE]: [
    {
      id: 1,
      title: "Today's Visits",
      value: "07",
      subtitle: "Completed",
      trend: "up",
      icon: "visits",
      route: ROUTES.SALES,
    },

    {
      id: 2,
      title: "Orders Booked",
      value: "12",
      subtitle: "Today's Orders",
      trend: "up",
      icon: "orders",
      route: ROUTES.SALES,
    },

    {
      id: 3,
      title: "Target Achievement",
      value: "68%",
      subtitle: "Current Month",
      trend: "neutral",
      icon: "target",
      route: ROUTES.SALES,
    },

    {
      id: 4,
      title: "Projected Incentive",
      value: "₹24,500",
      subtitle: "Estimated",
      trend: "up",
      icon: "incentive",
      route: ROUTES.PAYROLL,
    },
  ],
};

export default KPI_DATA;
