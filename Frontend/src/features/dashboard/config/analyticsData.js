import ROLES from "../../../config/roles";
import { ROUTES } from "../../../routes/routes";

const ANALYTICS_DATA = {
  /* ==========================================================
                          ADMIN
  ========================================================== */

  [ROLES.ADMIN]: [
    {
      id: 1,
      title: "Revenue Trend",
      subtitle: "Monthly Business Growth",
      chart: "area",
      size: "large",
      mock: "adminRevenue",
      route: ROUTES.REPORTS,

      tooltipLabel: "Revenue",
      centerLabel: null,
      valuePrefix: "₹",
      valueSuffix: " L",
    },

    {
      id: 2,
      title: "Business Target",
      subtitle: "Current Month Achievement",
      chart: "radial",
      size: "small",
      mock: "adminTarget",
      route: ROUTES.REPORTS,

      tooltipLabel: null,
      centerLabel: "Target Achieved",
      valuePrefix: "",
      valueSuffix: "%",
    },

    {
      id: 3,
      title: "Department Distribution",
      subtitle: "Employees by Department",
      chart: "horizontalBar",
      size: "large",
      mock: "adminDepartments",
      route: ROUTES.EMPLOYEE,

      tooltipLabel: "Employees",
      centerLabel: null,
      valuePrefix: "",
      valueSuffix: " Employees",
    },
  ],

  /* ==========================================================
                              HR
  ========================================================== */

  [ROLES.HR]: [
    {
      id: 1,
      title: "Attendance Trend",
      subtitle: "Monthly Attendance Overview",
      chart: "area",
      size: "large",
      mock: "hrAttendance",
      route: ROUTES.ATTENDANCE,

      tooltipLabel: "Attendance",
      centerLabel: null,
      valuePrefix: "",
      valueSuffix: "%",
    },

    {
      id: 2,
      title: "Attendance Score",
      subtitle: "Overall Workforce Presence",
      chart: "radial",
      size: "small",
      mock: "hrAttendanceScore",
      route: ROUTES.ATTENDANCE,

      tooltipLabel: null,
      centerLabel: "Attendance",
      valuePrefix: "",
      valueSuffix: "%",
    },

    {
      id: 3,
      title: "Hiring Performance",
      subtitle: "Recruitment by Month",
      chart: "horizontalBar",
      size: "large",
      mock: "hrHiringPerformance",
      route: ROUTES.EMPLOYEE,

      tooltipLabel: "Hires",
      centerLabel: null,
      valuePrefix: "",
      valueSuffix: " Hires",
    },
  ],

  /* ==========================================================
                              ASM
  ========================================================== */

  [ROLES.ASM]: [
    {
      id: 1,
      title: "Regional Sales",
      subtitle: "Monthly Sales Performance",
      chart: "area",
      size: "large",
      mock: "asmSales",
      route: ROUTES.SALES,

      tooltipLabel: "Sales",
      centerLabel: null,
      valuePrefix: "₹",
      valueSuffix: " L",
    },

    {
      id: 2,
      title: "Target Achievement",
      subtitle: "Current Month Progress",
      chart: "radial",
      size: "small",
      mock: "asmTarget",
      route: ROUTES.SALES,

      tooltipLabel: null,
      centerLabel: "Target",
      valuePrefix: "",
      valueSuffix: "%",
    },

    {
      id: 3,
      title: "Top Executives",
      subtitle: "Sales Performance Ranking",
      chart: "horizontalBar",
      size: "large",
      mock: "asmExecutives",
      route: ROUTES.SALES,

      tooltipLabel: "Sales",
      centerLabel: null,
      valuePrefix: "₹",
      valueSuffix: " L",
    },
  ],

  /* ==========================================================
                      SALES EXECUTIVE
  ========================================================== */

  [ROLES.SALES_EXECUTIVE]: [
    {
      id: 1,
      title: "Daily Orders",
      subtitle: "Weekly Order Performance",
      chart: "area",
      size: "large",
      mock: "salesOrders",
      route: ROUTES.SALES,

      tooltipLabel: "Orders",
      centerLabel: null,
      valuePrefix: "",
      valueSuffix: " Orders",
    },

    {
      id: 2,
      title: "Monthly Target",
      subtitle: "Achievement Progress",
      chart: "radial",
      size: "small",
      mock: "salesTarget",
      route: ROUTES.SALES,

      tooltipLabel: null,
      centerLabel: "Target",
      valuePrefix: "",
      valueSuffix: "%",
    },

    {
      id: 3,
      title: "Visit Performance",
      subtitle: "Today's Field Visits",
      chart: "horizontalBar",
      size: "large",
      mock: "salesVisits",
      route: ROUTES.ATTENDANCE,

      tooltipLabel: "Visits",
      centerLabel: null,
      valuePrefix: "",
      valueSuffix: " Visits",
    },
  ],
};

export default ANALYTICS_DATA;