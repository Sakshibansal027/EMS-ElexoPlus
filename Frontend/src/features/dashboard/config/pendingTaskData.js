import ROLES from "../../../config/roles";
import { ROUTES } from "../../../routes/routes";

const PENDING_TASK_DATA = {
  /* ==========================================================
                          ADMIN
  ========================================================== */

  [ROLES.ADMIN]: [
    {
      id: 1,
      title: "Leave Approvals",
      subtitle: "3 requests awaiting approval",
      priority: "high",
      route: ROUTES.LEAVE,
    },
    {
      id: 2,
      title: "Payroll Verification",
      subtitle: "June payroll pending verification",
      priority: "high",
      route: ROUTES.PAYROLL,
    },
    {
      id: 3,
      title: "Employee Documents",
      subtitle: "5 employee documents pending",
      priority: "medium",
      route: ROUTES.EMPLOYEE,
    },
    {
      id: 4,
      title: "User Role Requests",
      subtitle: "2 role changes awaiting review",
      priority: "low",
      route: ROUTES.SETTINGS,
    },
    {
      id: 5,
      title: "New Employee Onboarding",
      subtitle: "1 onboarding process pending",
      priority: "medium",
      route: ROUTES.EMPLOYEE,
    },
    {
      id: 6,
      title: "Department Transfer",
      subtitle: "2 transfer requests awaiting approval",
      priority: "low",
      route: ROUTES.EMPLOYEE,
    },
  ],

  /* ==========================================================
                              HR
  ========================================================== */

  [ROLES.HR]: [
    {
      id: 1,
      title: "Employee Onboarding",
      subtitle: "2 employees awaiting onboarding",
      priority: "high",
      route: ROUTES.EMPLOYEE,
    },
    {
      id: 2,
      title: "Document Verification",
      subtitle: "6 documents pending review",
      priority: "medium",
      route: ROUTES.EMPLOYEE,
    },
    {
      id: 3,
      title: "Exit Clearance",
      subtitle: "1 employee clearance pending",
      priority: "high",
      route: ROUTES.EMPLOYEE,
    },
    {
      id: 4,
      title: "Probation Review",
      subtitle: "3 reviews due this week",
      priority: "low",
      route: ROUTES.EMPLOYEE,
    },
    {
      id: 5,
      title: "Reporting Manager Assignment",
      subtitle: "2 employees awaiting assignment",
      priority: "medium",
      route: ROUTES.EMPLOYEE,
    },
    {
      id: 6,
      title: "Employee Profile Completion",
      subtitle: "4 profiles require verification",
      priority: "low",
      route: ROUTES.EMPLOYEE,
    },
  ],

  /* ==========================================================
                              ASM
  ========================================================== */

  [ROLES.ASM]: [
    {
      id: 1,
      title: "Leave Requests",
      subtitle: "4 requests awaiting approval",
      priority: "high",
      route: ROUTES.LEAVE,
    },
    {
      id: 2,
      title: "Performance Review",
      subtitle: "2 executives below target",
      priority: "high",
      route: ROUTES.SALES,
    },
    {
      id: 3,
      title: "Pending Reports",
      subtitle: "5 daily reports pending",
      priority: "medium",
      route: ROUTES.REPORTS,
    },
    {
      id: 4,
      title: "Territory Assignment",
      subtitle: "1 reassignment pending",
      priority: "low",
      route: ROUTES.SALES,
    },
    {
      id: 5,
      title: "Team Attendance Review",
      subtitle: "Attendance pending for 3 executives",
      priority: "medium",
      route: ROUTES.ATTENDANCE,
    },
    {
      id: 6,
      title: "Target Approval",
      subtitle: "Monthly targets awaiting approval",
      priority: "low",
      route: ROUTES.SALES,
    },
  ],

  /* ==========================================================
                    SALES EXECUTIVE
  ========================================================== */

  [ROLES.SALES_EXECUTIVE]: [
    {
      id: 1,
      title: "Submit DAR",
      subtitle: "Today's report pending",
      priority: "high",
      route: ROUTES.SALES,
    },
    {
      id: 2,
      title: "Lead Follow-up",
      subtitle: "4 leads require follow-up",
      priority: "high",
      route: ROUTES.SALES,
    },
    {
      id: 3,
      title: "Expense Claim",
      subtitle: "1 claim pending submission",
      priority: "medium",
      route: ROUTES.SALES,
    },
    {
      id: 4,
      title: "Pending Orders",
      subtitle: "2 orders awaiting confirmation",
      priority: "low",
      route: ROUTES.SALES,
    },
    {
      id: 5,
      title: "Customer Visit Check-out",
      subtitle: "1 visit pending check-out",
      priority: "medium",
      route: ROUTES.ATTENDANCE,
    },
    {
      id: 6,
      title: "Clock-out Pending",
      subtitle: "Today's attendance not completed",
      priority: "high",
      route: ROUTES.ATTENDANCE,
    },
  ],
};

export default PENDING_TASK_DATA;
