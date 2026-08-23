import {
    Umbrella,
    CalendarRange,
    HeartPulse
} from "lucide-react";

export const LeaveCardsData = [
    {
        icon: Umbrella,
        title: "Casual Leave (CL)",
        value: 8,
        description: "Accrued Monthly"
    },
    { 
        icon: CalendarRange,
        title: "Earned Leave (EL)",
        value: 15,
        description: "Carry Forward Allowed"
    },
    {
        icon: HeartPulse,
        title: "Sick Leave (SL)",
        value: 10,
        description: "Medical Leave"
    }
];

export const LeaveApplicationsData = [
    {
        id: 1,
        employeeName: "Rahul Sharma",
        employeeId: "EMP001",
        asmId: "EMP003",
        designation: "Sales Executive",
        initials: "RS",
        leaveType: "CL",
        fromDate: "10 Jun 2025",
        toDate: "12 Jun 2025",
        duration: "3 Days",
        reason: "Personal Work",
        appliedOn: "07 Jun 2025",
        approvedBy: "Amit Verma",
        approverRole: "ASM",
        status: "Pending",
        dayType: "Second Half",
    },
    {
        id: 2,
        employeeName: "Priya Patel",
        employeeId: "EMP002",
        designation: "HR Executive",
        initials: "PP",
        leaveType: "EL",
        fromDate: "15 Jun 2025",
        toDate: "18 Jun 2025",
        duration: "4 Days",
        reason: "Family Trip",
        appliedOn: "12 Jun 2025",
        approvedBy: "Neha Singh",
        approverRole: "HR Manager",
        status: "Approved",
        dayType: "Full Day",
    },
    {
        id: 3,
        employeeName: "Aman Kumar",
        employeeId: "EMP0012",
        asmId: "EMP003",
        designation: "Sales Executive",
        initials: "AK",
        leaveType: "SL",
        fromDate: "08 Jun 2025",
        toDate: "09 Jun 2025",
        duration: "2 Days",
        reason: "Medical Leave",
        appliedOn: "07 Jun 2025",
        approvedBy: "Amit Verma",
        approverRole: "ASM",
        status: "Rejected",
        dayType: "First Half",
    },
    {
        id: 4,
        employeeName: "Vikas Yadav",
        employeeId: "EMP005",
        designation: "Area Sales Manager",
        initials: "VY",
        leaveType: "EL",
        fromDate: "25 Jun 2025",
        toDate: "30 Jun 2025",
        duration: "6 Days",
        reason: "Vacation",
        appliedOn: "20 Jun 2025",
        approvedBy: "Admin",
        approverRole: "System",
        status: "Approved",
        dayType: "Full Day",
    },
    {
        id: 5,
        employeeName: "Neha Kumari",
        employeeId: "EMP006",
        designation: "HR Executive",
        initials: "NK",
        leaveType: "SL",
        fromDate: "05 Jul 2025",
        toDate: "07 Jul 2025",
        duration: "3 Days",
        reason: "Health Issues",
        appliedOn: "04 Jul 2025",
        approvedBy: "Neha Singh",
        approverRole: "HR Manager",
        status: "Pending",
        dayType: "Full Day",
    },
    {
        id: 6,
        employeeName: "Rohit Mehta",
        employeeId: "EMP007",
        asmId: "EMP003",
        designation: "Sales Executive",
        initials: "RM",
        leaveType: "CL",
        fromDate: "09 Jul 2025",
        toDate: "10 Jul 2025",
        duration: "2 Days",
        reason: "Family Function",
        appliedOn: "06 Jul 2025",
        approvedBy: "Amit Verma",
        approverRole: "ASM",
        status: "Approved",
        dayType: "Second Half",
    },
    {
        id: 7,
        employeeName: "Anjali Sharma",
        employeeId: "EMP008",
        designation: "HR Executive",
        initials: "AS",
        leaveType: "EL",
        fromDate: "14 Jul 2025",
        toDate: "18 Jul 2025",
        duration: "5 Days",
        reason: "Vacation",
        appliedOn: "10 Jul 2025",
        approvedBy: "Neha Singh",
        approverRole: "HR Manager",
        status: "Pending",
        dayType: "Full Day",
    },
    {
        id: 8,
        employeeName: "Sneha Gupta",
        employeeId: "EMP004",
        asmId: "EMP003",
        designation: "Sales Executive",
        initials: "SG",
        leaveType: "CL",
        fromDate: "20 Jun 2025",
        toDate: "21 Jun 2025",
        duration: "2 Days",
        reason: "Personal Work",
        appliedOn: "18 Jun 2025",
        approvedBy: "Amit Verma",
        approverRole: "ASM",
        status: "Pending",
        dayType: "First Half",
    },
];

export const initialLeavePolicies = [
    {
        id: "pol_01",
        leaveTypeCode: "CL",
        leaveTypeName: "Casual Leave",
        annualQuota: 12,
        accrualFrequency: "Monthly",
        accrualMethod: "Pro-rata",
        carryForwardAllowed: false,
        maxCarryForwardDays: 0,
        description: "For short-term unplanned personal or urgent work."
    },
    {
        id: "pol_02",
        leaveTypeCode: "EL",
        leaveTypeName: "Earned Leave",
        annualQuota: 15,
        accrualFrequency: "Yearly",
        accrualMethod: "Upfront",
        carryForwardAllowed: true,
        maxCarryForwardDays: 10,
        description: "Planned leaves accumulated over time for vacations or long rests."
    },
    {
        id: "pol_03",
        leaveTypeCode: "SL",
        leaveTypeName: "Sick Leave",
        annualQuota: 10,
        accrualFrequency: "Monthly",
        accrualMethod: "Pro-rata",
        carryForwardAllowed: false,
        maxCarryForwardDays: 0,
        description: "Dedicated medical leave requiring certificate if exceeding 3 days."
    }
];

// ================= TEAM LEAVE CALENDAR =================

export const teamLeaveCalendarEvents = [
    // Sales Executives
    {
        id: "cal_1",
        employeeId: "EMP001",
        employeeName: "Rahul Sharma",
        role: "Sales Executive",
        reportingManager: "EMP003",
        department: "Sales",
        leaveType: "Casual Leave",
        startDate: "2026-08-12",
        endDate: "2026-08-13",
        status: "Approved",
        location: "Delhi"
    },
    {
        id: "cal_2",
        employeeId: "EMP003",
        employeeName: "Aman Kumar",
        role: "Sales Executive",
        reportingManager: "EMP003",
        department: "Sales",
        leaveType: "Sick Leave",
        startDate: "2026-08-18",
        endDate: "2026-08-19",
        status: "Pending",
        location: "Delhi"
    },

    // HR
    {
        id: "cal_3",
        employeeId: "EMP006",
        employeeName: "Neha Kumari",
        role: "HR",
        department: "Human Resource",
        leaveType: "Earned Leave",
        startDate: "2026-08-20",
        endDate: "2026-08-22",
        status: "Approved",
        location: "Delhi"
    },

    // ASM
    {
        id: "cal_4",
        employeeId: "EMP005",
        employeeName: "Vikas Yadav",
        role: "ASM",
        department: "Sales",
        leaveType: "Earned Leave",
        startDate: "2026-08-25",
        endDate: "2026-08-28",
        status: "Approved",
        location: "Delhi"
    },

    // Another Sales Executive
    {
        id: "cal_5",
        employeeId: "EMP007",
        employeeName: "Rohit Mehta",
        role: "Sales Executive",
        reportingManager: "EMP003",
        department: "Sales",
        leaveType: "Casual Leave",
        startDate: "2026-08-29",
        endDate: "2026-08-29",
        status: "Approved",
        location: "Delhi"
    }
];


export const companyHolidaysData = [
    {
        id: "HOL001",
        title: "Republic Day",
        date: "2026-01-26",
        type: "Public Holiday",
        location: "All"
    },
    {
        id: "HOL002",
        title: "Holi",
        date: "2026-03-04",
        type: "Public Holiday",
        location: "North India"
    },
    {
        id: "HOL003",
        title: "Independence Day",
        date: "2026-08-15",
        type: "Public Holiday",
        location: "All"
    },
    {
        id: "HOL004",
        title: "Gandhi Jayanti",
        date: "2026-10-02",
        type: "Public Holiday",
        location: "All"
    },
    {
        id: "HOL005",
        title: "Diwali",
        date: "2026-11-08",
        type: "Optional Holiday",
        location: "All"
    },
    {
        id: "HOL006",
        title: "Christmas",
        date: "2026-12-25",
        type: "Company Holiday",
        location: "All"
    }
];