import ROLES from "../../../config/roles";

const RECENT_ACTIVITY_DATA = {
  /* ==========================================================
                          ADMIN
  ========================================================== */

  [ROLES.ADMIN]: [
    {
      id: 1,
      title: "Payroll Processed",
      subtitle: "June payroll processed successfully",
      status: "success",
      time: "10 min ago",
    },
    {
      id: 2,
      title: "Employee Onboarded",
      subtitle: "Rahul Sharma joined Sales Department",
      status: "info",
      time: "35 min ago",
    },
    {
      id: 3,
      title: "Salary Revision Approved",
      subtitle: "Revision approved for 4 employees",
      status: "warning",
      time: "1 hour ago",
    },
    {
      id: 4,
      title: "Role Updated",
      subtitle: "ASM permissions updated",
      status: "success",
      time: "Today • 09:15 AM",
    },
    {
      id: 5,
      title: "Leave Approved",
      subtitle: "3 leave requests approved successfully",
      status: "success",
      time: "Today • 11:20 AM",
    },
    {
      id: 6,
      title: "Employee Transfer",
      subtitle: "Sales executive moved to North Zone",
      status: "info",
      time: "Yesterday • 05:40 PM",
    },
  ],

  /* ==========================================================
                              HR
  ========================================================== */

  [ROLES.HR]: [
    {
      id: 1,
      title: "Candidate Selected",
      subtitle: "Sales Executive hiring completed",
      status: "success",
      time: "15 min ago",
    },
    {
      id: 2,
      title: "Documents Verified",
      subtitle: "5 employee documents approved",
      status: "info",
      time: "40 min ago",
    },
    {
      id: 3,
      title: "Exit Completed",
      subtitle: "Full & Final settlement initiated",
      status: "warning",
      time: "2 hours ago",
    },
    {
      id: 4,
      title: "Manager Assigned",
      subtitle: "Reporting manager updated",
      status: "success",
      time: "Today • 08:45 AM",
    },
    {
      id: 5,
      title: "Employee Confirmed",
      subtitle: "Probation completed successfully",
      status: "success",
      time: "Today • 10:05 AM",
    },
    {
      id: 6,
      title: "Offer Letter Generated",
      subtitle: "Offer shared with shortlisted candidate",
      status: "info",
      time: "Yesterday • 04:25 PM",
    },
  ],

  /* ==========================================================
                              ASM
  ========================================================== */

  [ROLES.ASM]: [
    {
      id: 1,
      title: "Target Assigned",
      subtitle: "Monthly targets assigned to team",
      status: "success",
      time: "12 min ago",
    },
    {
      id: 2,
      title: "SE Checked In",
      subtitle: "Nisha checked in at Delhi territory",
      status: "info",
      time: "28 min ago",
    },
    {
      id: 3,
      title: "Feedback Submitted",
      subtitle: "Performance feedback shared",
      status: "warning",
      time: "1 hour ago",
    },
    {
      id: 4,
      title: "Territory Updated",
      subtitle: "North Zone reassigned",
      status: "success",
      time: "Today • 09:05 AM",
    },
    {
      id: 5,
      title: "Attendance Reviewed",
      subtitle: "Daily attendance verified",
      status: "success",
      time: "Today • 09:40 AM",
    },
    {
      id: 6,
      title: "Daily Report Approved",
      subtitle: "Team reports verified successfully",
      status: "info",
      time: "Yesterday • 06:10 PM",
    },
  ],

  /* ==========================================================
                    SALES EXECUTIVE
  ========================================================== */

  [ROLES.SALES_EXECUTIVE]: [
    {
      id: 1,
      title: "Visit Completed",
      subtitle: "ABC Traders visited successfully",
      status: "success",
      time: "8 min ago",
    },
    {
      id: 2,
      title: "Order Booked",
      subtitle: "₹48,000 order confirmed",
      status: "info",
      time: "30 min ago",
    },
    {
      id: 3,
      title: "Lead Created",
      subtitle: "New distributor lead added",
      status: "warning",
      time: "1 hour ago",
    },
    {
      id: 4,
      title: "Expense Submitted",
      subtitle: "Travel expense submitted",
      status: "success",
      time: "Today • 10:20 AM",
    },
    {
      id: 5,
      title: "DAR Submitted",
      subtitle: "Daily activity report submitted",
      status: "success",
      time: "Today • 08:55 AM",
    },
    {
      id: 6,
      title: "Customer Follow-up Completed",
      subtitle: "Discussion completed with retailer",
      status: "info",
      time: "Yesterday • 07:15 PM",
    },
  ],
};

export default RECENT_ACTIVITY_DATA;
