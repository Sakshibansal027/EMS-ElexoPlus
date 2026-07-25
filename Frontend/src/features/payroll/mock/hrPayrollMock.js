export const hrStatCardsMockData = [
  {
    id: "active-emp",
    title: "ACTIVE EMPLOYEES",
    value: "248",
    subtitle: "👥 +12 New Joinees",
    icon: "Users",
    valueColor: "text-zinc-50",
    subtitleColor: "text-emerald-400",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20"
  },
  {
    id: "pending-signoffs",
    title: "PENDING HR SIGNOFFS",
    value: "18",
    subtitle: "Requires HR Verification",
    icon: "AlertCircle",
    valueColor: "text-amber-500",
    subtitleColor: "text-amber-500",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20"
  },
  {
    id: "monthly-liability",
    title: "MONTHLY PAYROLL LIABILITY",
    value: "₹45.20 L",
    subtitle: "Includes PF & TDS Component",
    icon: "Wallet",
    valueColor: "text-zinc-50",
    subtitleColor: "text-zinc-400",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20"
  },
  {
    id: "bank-status",
    title: "BANK PAYOUT STATUS",
    value: "Ready",
    subtitle: "230 Accounts Verified (18 Pending)",
    icon: "Building2",
    valueColor: "text-emerald-400",
    subtitleColor: "text-zinc-400",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20"
  },
  {
    id: "salary-holds",
    title: "SALARY HOLDS",
    value: "3",
    subtitle: "Notice Period & Audit Holds",
    icon: "Lock",
    valueColor: "text-rose-500",
    subtitleColor: "text-rose-500",
    iconColor: "text-rose-500",
    iconBg: "bg-rose-500/10 border-rose-500/20"
  }
];

export const hrPayrollStagesMock = [
  {
    id: 1,
    stageNumber: "STAGE 1",
    title: "Attendance Sync",
    subtitle: "Completed on 21 Jul",
    status: "completed"
  },
  {
    id: 2,
    stageNumber: "STAGE 2",
    title: "HR Verification",
    subtitle: "In Progress (Active)",
    status: "active"
  },
  {
    id: 3,
    stageNumber: "STAGE 3",
    title: "Finance Sanction",
    subtitle: "Pending Stage 2",
    status: "pending"
  },
  {
    id: 4,
    stageNumber: "STAGE 4",
    title: "Bank Disbursal",
    subtitle: "Target: 31 Jul 2026",
    status: "pending"
  }
];

export const actionableExceptionsMock = [
  {
    id: "1",
    employeeName: "Aman Verma",
    empId: "EMP-102",
    dept: "Engineering",
    issueDescription: "1.5 Days LOP Dispute & Incentive Overlap",
    basePay: "₹1,20,833",
    lopImpact: "- ₹6,041"
  },
  {
    id: "2",
    employeeName: "Rohan Gupta",
    empId: "EMP-104",
    dept: "Operations",
    issueDescription: "Joining Mid-Month Prorated Signoff",
    basePay: "₹74,166",
    lopImpact: "₹0"
  },
  {
    id: "3",
    employeeName: "Sandeep Kumar",
    empId: "EMP-109",
    dept: "Sales",
    issueDescription: "3.5 Days LOP Limit Exceeded",
    basePay: "₹58,000",
    lopImpact: "- ₹8,400"
  },
  {
    id: "4",
    employeeName: "Priya Sharma",
    empId: "EMP-112",
    dept: "Design",
    issueDescription: "Unclaimed WFH Reimbursement Dispute",
    basePay: "₹85,000",
    lopImpact: "₹0"
  },
  {
    id: "5",
    employeeName: "Vikram Malhotra",
    empId: "EMP-115",
    dept: "Marketing",
    issueDescription: "2 Days Overtime Bonus Verification",
    basePay: "₹62,500",
    lopImpact: "₹0"
  },
  {
    id: "6",
    employeeName: "Ananya Roy",
    empId: "EMP-118",
    dept: "Product",
    issueDescription: "Shift Allowance Miscalculation",
    basePay: "₹1,10,000",
    lopImpact: "- ₹2,200"
  },
  {
    id: "7",
    employeeName: "Rahul Dravid",
    empId: "EMP-121",
    dept: "Engineering",
    issueDescription: "1 Day Unmarked Absence",
    basePay: "₹1,45,000",
    lopImpact: "- ₹5,576"
  },
  {
    id: "8",
    employeeName: "Sneha Reddy",
    empId: "EMP-125",
    dept: "HR",
    issueDescription: "Prorated Joining Bonus Approval",
    basePay: "₹68,000",
    lopImpact: "₹0"
  },
  {
    id: "9",
    employeeName: "Karan Johar",
    empId: "EMP-130",
    dept: "Operations",
    issueDescription: "0.5 Day LOP Dispute",
    basePay: "₹52,000",
    lopImpact: "- ₹1,000"
  },
  {
    id: "10",
    employeeName: "Neha Kakkar",
    empId: "EMP-134",
    dept: "Sales",
    issueDescription: "Incentive Overlap Adjustment",
    basePay: "₹65,000",
    lopImpact: "₹0"
  },
  {
    id: "11",
    employeeName: "Siddharth Malhotra",
    empId: "EMP-139",
    dept: "Engineering",
    issueDescription: "2.0 Days LOP Review Pending",
    basePay: "₹1,30,000",
    lopImpact: "- ₹9,285"
  },
  {
    id: "12",
    employeeName: "Pooja Hegde",
    empId: "EMP-142",
    dept: "Design",
    issueDescription: "PF Contribution Override",
    basePay: "₹78,000",
    lopImpact: "₹0"
  },
  {
    id: "13",
    employeeName: "Varun Dhawan",
    empId: "EMP-148",
    dept: "Marketing",
    issueDescription: "Medical Leave Certificate Verification",
    basePay: "₹71,000",
    lopImpact: "₹0"
  },
  {
    id: "14",
    employeeName: "Kriti Sanon",
    empId: "EMP-153",
    dept: "Product",
    issueDescription: "1 Day LOP Deduction Appeal",
    basePay: "₹1,15,000",
    lopImpact: "- ₹4,423"
  },
  {
    id: "15",
    employeeName: "Ayushmann Khurrana",
    empId: "EMP-159",
    dept: "Sales",
    issueDescription: "Travel Expense Overlap",
    basePay: "₹82,000",
    lopImpact: "₹0"
  },
  {
    id: "16",
    employeeName: "Shraddha Kapoor",
    empId: "EMP-164",
    dept: "Engineering",
    issueDescription: "On-call Support Pay Adjustment",
    basePay: "₹1,25,000",
    lopImpact: "₹0"
  },
  {
    id: "17",
    employeeName: "Rajkummar Rao",
    empId: "EMP-170",
    dept: "Operations",
    issueDescription: "1.0 Day LOP Exceeded",
    basePay: "₹59,000",
    lopImpact: "- ₹2,269"
  },
  {
    id: "18",
    employeeName: "Tripti Dimri",
    empId: "EMP-175",
    dept: "HR",
    issueDescription: "Relocation Bonus Verification",
    basePay: "₹75,000",
    lopImpact: "₹0"
  }
];

export const statutoryComplianceMock = [
  {
    id: "pf",
    title: "Employer PF Contribution",
    subtitle: "EPFO Portal ECR Return",
    amount: "₹2,45,000"
  },
  {
    id: "tds",
    title: "Total TDS Deductions",
    subtitle: "Income Tax Section 192",
    amount: "₹3,80,000"
  },
  {
    id: "pt",
    title: "Professional Tax (PT)",
    subtitle: "State Govt Deposit",
    amount: "₹49,600"
  },
  {
    id: "esi",
    title: "ESI Contribution",
    subtitle: "ESIC Portal Liability",
    amount: "₹18,200"
  }
];

export const masterEmployeeDirectoryMock = [
  {
    id: "EMP-101",
    name: "Harshit Goel",
    dept: "Sales & Ops",
    designation: "Senior Sales Lead",
    ctc: "₹9,52,000",
    monthlyGross: "₹79,333",
    deductions: "- ₹9,600",
    netPayable: "₹69,733",
    status: "Verified"
  },
  {
    id: "EMP-102",
    name: "Aman Verma",
    dept: "Engineering",
    designation: "Backend Engineer",
    ctc: "₹14,50,000",
    monthlyGross: "₹1,20,833",
    deductions: "- ₹18,441",
    netPayable: "₹1,02,392",
    status: "Pending HR"
  },
  {
    id: "EMP-103",
    name: "Priya Sharma",
    dept: "Human Resources",
    designation: "HR Specialist",
    ctc: "₹7,80,000",
    monthlyGross: "₹65,000",
    deductions: "- ₹7,200",
    netPayable: "₹57,800",
    status: "Verified"
  },
  {
    id: "EMP-104",
    name: "Rohan Gupta",
    dept: "Operations",
    designation: "Ops Lead",
    ctc: "₹8,90,000",
    monthlyGross: "₹74,166",
    deductions: "- ₹8,100",
    netPayable: "₹66,066",
    status: "Verified"
  },
  {
    id: "EMP-105",
    name: "Sandeep Kumar",
    dept: "Sales",
    designation: "Executive",
    ctc: "₹6,96,000",
    monthlyGross: "₹58,000",
    deductions: "- ₹6,500",
    netPayable: "₹51,500",
    status: "Verified"
  }
];

export const mockDepartmentLiabilityData = [
  { id: "dept_1", department: "ENGINEERING", currentMonth: 4800000, previousMonth: 4200000 },
  { id: "dept_2", department: "SALES & OPS", currentMonth: 4300000, previousMonth: 4150000 },
  { id: "dept_3", department: "MARKETING", currentMonth: 2700000, previousMonth: 2600000 },
  { id: "dept_4", department: "HR & ADMIN", currentMonth: 2100000, previousMonth: 2100000 },
  { id: "dept_5", department: "SUPPORT", currentMonth: 1800000, previousMonth: 1750000 }
];

export const personalPayroll = {
  payroll: {
    stats: [
      { id: 1, title: "CURRENT MONTH NET PAY", value: "₹1,08,700", subtitle: "Paid on 31 Jul 2026", icon: "Wallet", color: "yellow" },
      { id: 2, title: "INCENTIVE EARNED", value: "₹0", subtitle: "This Month", icon: "TrendingUp", color: "yellow" },
      { id: 3, title: "TOTAL DEDUCTIONS", value: "₹12,300", subtitle: "View Breakdown", icon: "ArrowDown", color: "red" },
      { id: 4, title: "LOP DAYS", value: "0 Days", subtitle: "following LOP this month", icon: "CalendarX", color: "red" },
      { id: 5, title: "PAYROLL STATUS", value: "Processed", subtitle: "Salary Credited", icon: "ShieldCheck", color: "green" }
    ],
    salaryBreakup: {
      basicSalary: 60000,
      hra: 24000,
      allowances: 30000,
      incentive: 7000
    },
    deductions: {
      pf: 7200,
      professionalTax: 200,
      tds: 4500,
      other: 400
    }
  },
  history: [
        {
            month: "Jul 2026",
            netPay: 112600,
            status: "Processed",
            payslipId: "ASM-2026-07",
            deductions: 11400,
        },
        {
            month: "Jun 2026",
            netPay: 110300,
            status: "Processed",
            payslipId: "ASM-2026-06",
            deductions: 11200,
        },
        {
            month: "May 2026",
            netPay: 107800,
            status: "Processed",
            payslipId: "ASM-2026-05",
            deductions: 10900,
        },
        {
            month: "Apr 2026",
            netPay: 106200,
            status: "Processed",
            payslipId: "ASM-2026-04",
            deductions: 10800,
        },
        {
            month: "Mar 2026",
            netPay: 104900,
            status: "Processed",
            payslipId: "ASM-2026-03",
            deductions: 10650,
        },
        {
            month: "Feb 2026",
            netPay: 103700,
            status: "Processed",
            payslipId: "ASM-2026-02",
            deductions: 10500,
        },
        {
            month: "Jan 2026",
            netPay: 102500,
            status: "Processed",
            payslipId: "ASM-2026-01",
            deductions: 10400,
        },
        {
            month: "Dec 2025",
            netPay: 101300,
            status: "Processed",
            payslipId: "ASM-2025-12",
            deductions: 10250,
        },
        {
            month: "Nov 2025",
            netPay: 100100,
            status: "Processed",
            payslipId: "ASM-2025-11",
            deductions: 10100,
        },
        {
            month: "Oct 2025",
            netPay: 98800,
            status: "Processed",
            payslipId: "ASM-2025-10",
            deductions: 9950,
        },
        {
            month: "Sep 2025",
            netPay: 97500,
            status: "Processed",
            payslipId: "ASM-2025-09",
            deductions: 9800,
        },
        {
            month: "Aug 2025",
            netPay: 96200,
            status: "Processed",
            payslipId: "ASM-2025-08",
            deductions: 9650,
        },
    ],
  latestPayslip: {
    id: "HR-2026-07",
    month: "July 2026",
    creditedOn: "31 Jul 2026",
    status: "Paid",
    employeeName: "Priya Sharma",
    employeeId: "HR001",
    designation: "HR Manager",
    department: "Human Resources",
    netPay: 108700,
    pdfUrl: "/mock/payslips/july-2026.pdf"
  },
  revisions: [
        {
            date: "01 Apr 2026",
            type: "Annual Increment",
            description: "Your annual increment has been applied.",
            ctc: 1320000,
        },
        {
            date: "01 Oct 2025",
            type: "Performance Increment",
            description: "Performance-based increment after exceeding quarterly sales targets.",
            ctc: 1240000,
        },
        {
            date: "01 Apr 2025",
            type: "Annual Increment",
            description: "Annual salary revision for FY 2025–26.",
            ctc: 1180000,
        },
        {
            date: "01 Nov 2024",
            type: "Promotion",
            description: "Promoted to Area Sales Manager with revised compensation.",
            ctc: 1100000,
        },
        {
            date: "01 Apr 2024",
            type: "Annual Increment",
            description: "Annual increment based on company appraisal cycle.",
            ctc: 1020000,
        },
        {
            date: "01 Oct 2023",
            type: "Performance Increment",
            description: "Exceptional performance during H1 review resulted in a salary revision.",
            ctc: 960000,
        },
        {
            date: "01 Apr 2023",
            type: "Annual Increment",
            description: "Annual compensation revision.",
            ctc: 900000,
        },
    ],
};

export const fallbackAttendanceDetail = {
    drawerSummary: {
        totalDeduction: "₹8,500",
        highLopCases: "4 Members"
    },
    logs: [
        { id: 1, name: "Aarav Sharma", dept: "Tech", type: "Unplanned Leave", impact: "-₹2,500", date: "12 Jul 2026", status: "Critical" },
        { id: 2, name: "Priya Patel", dept: "Design", type: "Late Arrival (3x)", impact: "-₹800", date: "15 Jul 2026", status: "Warning" },
        { id: 3, name: "Rohan Verma", dept: "Marketing", type: "Half Day", impact: "-₹1,200", date: "18 Jul 2026", status: "Moderate" },
        { id: 4, name: "Sneha Reddy", dept: "Tech", type: "Loss of Pay (LOP)", impact: "-₹4,000", date: "19 Jul 2026", status: "Critical" }
    ]
};

export const hrPayrollMock = {
  statsData: hrStatCardsMockData,
  stages: hrPayrollStagesMock,
  exceptions: actionableExceptionsMock,
  complianceData: statutoryComplianceMock,
  directoryEmployees: masterEmployeeDirectoryMock,
  departmentLiability: mockDepartmentLiabilityData,
  joiningExitData: {
    newJoinees: { count: 12, amount: 450000 },
    exits: { count: 3, amount: 120000 }
  },
  currentStage: 2,
  isAttendanceFrozen: false,
  personalPayroll
};