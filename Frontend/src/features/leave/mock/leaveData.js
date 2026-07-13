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
        employeeId: "EMP003",
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

export const PaginationData = {
    currentPage: 1,
    totalPages: 5,
    totalEntries: 20,
    startEntry: 1,
    endEntry: 4
};

export const employeeOptions = [
    {
        value: "EMP001",
        label: "Rahul Sharma (EMP001)",
    },
    {
        value: "EMP002",
        label: "Priya Patel (EMP002)",
    },
    {
        value: "EMP003",
        label: "Rahul Sharma (EMP003)",
    },
    {
        value: "EMP004",
        label: "Aman Kumar (EMP004)",
    },
    {
        value: "EMP005",
        label: "Sneha Gupta (EMP005)",
    },
    {
        value: "EMP006",
        label: "Vikas Yadav (EMP006)",
    },
];

export const leaveTypeOptions = [
    {
        value: "CL",
        label: "Casual Leave",
    },
    {
        value: "EL",
        label: "Earned Leave",
    },
    {
        value: "SL",
        label: "Sick Leave",
    },
    {
        value: "ML",
        label: "Maternity Leave",
    },
    {
        value: "PL",
        label: "Paternity Leave",
    },
    {
        value: "CO",
        label: "Compensatory Off",
    },
    {
        value: "LOP",
        label: "Loss of Pay",
    }
];