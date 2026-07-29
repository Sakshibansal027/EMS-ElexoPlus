export const EmployeepayrollData = {
    stats: [
        {
            id: 1,
            title: "CURRENT MONTH NET PAY",
            value: "₹89,900",
            subtitle: "Paid on 31 Jul 2026",
            icon: "Wallet",
            color: "yellow",
        },
        {
            id: 2,
            title: "INCENTIVE EARNED",
            value: "₹24,500",
            subtitle: "This Month",
            icon: "TrendingUp",
            color: "yellow",
        },
        {
            id: 3,
            title: "TOTAL DEDUCTIONS",
            value: "₹9,600",
            subtitle: "View Breakdown",
            icon: "ArrowDown",
            color: "red",
        },
        {
            id: 4,
            title: "LOP DAYS",
            value: "2.5 Days",
            subtitle: "following LOP this month",
            icon: "CalendarX",
            color: "red",
        },
        {
            id: 5,
            title: "PAYROLL STATUS",
            value: "Processed",
            subtitle: "Salary Credited",
            icon: "ShieldCheck",
            color: "green",
        },
    ],
    salaryBreakup: {
        basicSalary: 45000,
        hra: 18000,
        allowances: 12000,
        incentive: 24500,
    },
    deductions: {
        pf: 5400,
        professionalTax: 200,
        tds: 3600,
        other: 400,
    },
};

export const payrollHistory = [
    {
        month: "Jan 2026",
        netPay: 90400,
        status: "Processed",
        payslipId: "PSLIP-2026-01",
        deductions: 8900,
    },
    {
        month: "Feb 2026",
        netPay: 88700,
        status: "Processed",
        payslipId: "PSLIP-2026-02",
        deductions: 9100,
    },
    {
        month: "March 2026",
        netPay: 89150,
        status: "Processed",
        payslipId: "PSLIP-2026-03",
        deductions: 9300,
    },
    {
        month: "April 2026",
        netPay: 87300,
        status: "Processed",
        payslipId: "PSLIP-2026-04",
        deductions: 9150,
    },
    {
        month: "May 2026",
        netPay: 89500,
        status: "Processed",
        payslipId: "PSLIP-2026-05",
        deductions: 9150,
    },
    {
        month: "Jun 2026",
        netPay: 89600,
        status: "Processed",
        payslipId: "PSLIP-2026-06",
        deductions: 9400,
    },
    {
        month: "Jul 2026",
        netPay: 89900,
        status: "Processed",
        payslipId: "PSLIP-2026-07",
        deductions: 9600,
    },
    {
        month: "Aug 2026",
        netPay: 91000,
        status: "Processed",
        payslipId: "PSLIP-2026-08",
        deductions: 9700,
    },
    {
        month: "Sep 2026",
        netPay: 93400,
        status: "Processed",
        payslipId: "PSLIP-2026-09",
        deductions: 9800,
    },
    {
        month: "Oct 2026",
        netPay: 94500,
        status: "Processed",
        payslipId: "PSLIP-2026-10",
        deductions: 9900,
    },
    {
        month: "Nov 2026",
        netPay: 95200,
        status: "Processed",
        payslipId: "PSLIP-2026-11",
        deductions: 10200,
    },
    {
        month: "Dec 2026",
        netPay: 96100,
        status: "Processed",
        payslipId: "PSLIP-2026-12",
        deductions: 10400,
    },
    {
        month: "Jan 2027",
        netPay: 97800,
        status: "Processed",
        payslipId: "PSLIP-2027-01",
        deductions: 10800,
    },
];

export const latestPayslip = {
    id: "EMP001",
    employeeId: "EMP001",
    employeeName: "Harshit Goel",
    role: "Sales Executive",
    designation: "Sales Executive",
    department: "Sales",
    month: "July 2026",
    payPeriod: "July 2026",
    
    basicSalary: 45000,
    hra: 18000,
    allowances: 12000,
    incentives: 24500,
    incentive: 24500,
    deductions: {
        pf: 5400,
        professionalTax: 200,
        tds: 3600,
        other: 400,
    },
    
    netPay: 89900,
    status: "Paid",
    creditedOn: "31 Jul 2026"
};

export const salaryRevisions = [
    {
        date: "01 Apr 2026",
        type: "Annual Increment",
        description: "Your annual increment has been applied.",
        ctc: 952000,
    },
    {
        date: "01 Oct 2024",
        type: "Performance Increment",
        description: "Performance based increment applied.",
        ctc: 870000,
    },
    {
        date: "01 Apr 2024",
        type: "Annual Increment",
        description: "Your annual increment has been applied.",
        ctc: 820000,
    },
    {
        date: "15 Jun 2023",
        type: "Promotion",
        description: "Promoted to Software Engineer II.",
        ctc: 760000,
    },
    {
        date: "10 Jan 2022",
        type: "Joined Company",
        description: "Initial compensation package.",
        ctc: 600000,
    },
]; 

export const expenseReimbursements = [
    { id: "EXP-01", type: "Travel / B2B Client Visit", amount: 2500, date: "12 July 2026", status: "Approved" },
    { id: "EXP-02", type: "Client Dinner Entertainment", amount: 1200, date: "15 July 2026", status: "Pending" },
    { id: "EXP-03", type: "Internet & Mobile Allowance", amount: 800, date: "01 July 2026", status: "Disbursed" },
    { id: "EXP-04", type: "Travel / B2B Client Visit", amount: 2500, date: "12 July 2026", status: "Approved" },
    { id: "EXP-05", type: "Client Dinner Entertainment", amount: 1200, date: "15 July 2026", status: "Pending" },
    { id: "EXP-06", type: "Internet & Mobile Allowance", amount: 800, date: "01 July 2026", status: "Disbursed" }
];

export const employeePayrollMock = {
  payroll: EmployeepayrollData,
  history: payrollHistory,
  latestPayslip,
  revisions: salaryRevisions,
  expenseReimbursements,
  incentiveProjection: {
    currentSales: 850000,
    targetQuota: 1000000,
    baseIncentivePercentage: 2.5,
    projectedSalesInput: 850000,
  },
};
