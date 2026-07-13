import {
    Wallet,
    TrendingUp,
    ArrowDown,
    CalendarX,
    ShieldCheck,
} from "lucide-react";

export const payrollSummary = [
    {
        title: "CURRENT MONTH NET PAY",
        value: "₹90,900",
        status: "● Paid on 31 Jul 2026",
        icon: Wallet,
        iconBg: "bg-yellow-500/10",
        iconColor: "text-yellow-500",
        statusColor: "text-green-500",
    },

    {
        title: "INCENTIVE EARNED",
        value: "₹24,500",
        status: "This Month",
        icon: TrendingUp,
        iconBg: "bg-yellow-500/10",
        iconColor: "text-yellow-500",
        statusColor: "text-muted-foreground",
    },

    {
        title: "TOTAL DEDUCTIONS",
        value: "₹9,600",
        status: "View Breakdown",
        icon: ArrowDown,
        iconBg: "bg-red-500/10",
        iconColor: "text-red-500",
        statusColor: "text-yellow-500",
    },

    {
        title: "LOP DAYS",
        value: "0.0 Days",
        status: "No LOP this month",
        icon: CalendarX,
        iconBg: "bg-red-500/10",
        iconColor: "text-red-500",
        statusColor: "text-green-500",
    },

    {
        title: "PAYROLL STATUS",
        value: "Processed",
        status: "Salary Credited",
        icon: ShieldCheck,
        iconBg: "bg-green-500/10",
        iconColor: "text-green-500",
        statusColor: "text-green-500",
    },
];

export const payrollData = {
    month: "Jul 2026",

    netPay: 90400,

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
        netPay: 89800,
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
    id: "PSLIP-2026-07",
    month: "July 2026",
    creditedOn: "31 Jul 2026",
    status: "Paid",
    netPay: 90400,

    pdfUrl:
        "/mock/payslips/july-2026.pdf",
};