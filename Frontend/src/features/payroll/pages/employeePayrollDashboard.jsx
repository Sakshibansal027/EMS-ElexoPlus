import { useState } from "react";
import PayrollSummaryCard from "../components/employee/PayrollSummaryCard.jsx";
import {
    payrollSummary,
    payrollData,
    payrollHistory,
    latestPayslip,
} from "../mock/employeePayrollData";
import LatestPayslipCard from "../components/employee/latestPayslipCard.jsx";
import PayrollOverviewCard from "../components/employee/payrollOverviewChart.jsx";
import PayrollHistoryCard from "../components/employee/payrollHistoryCard.jsx";
import SalaryBreakupCard from "../components/employee/salaryBreakupCard.jsx";
import PayrollHistoryModal from "../components/employee/payrollHistoryModal.jsx";

const EmployeePayrollDashboard = () => {
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const currentMonth =
        new Date().toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric",
            }
        );
    const grossEarnings =
        payrollData.salaryBreakup.basicSalary +
        payrollData.salaryBreakup.hra +
        payrollData.salaryBreakup.allowances +
        payrollData.salaryBreakup.incentive;

    const totalDeductions =
        payrollData.deductions.pf +
        payrollData.deductions.professionalTax +
        payrollData.deductions.tds +
        payrollData.deductions.other;

    const netPay =
        grossEarnings - totalDeductions;
    const calculatedPayrollData = {
        ...payrollData,
        grossEarnings,
        totalDeductions,
        netPay,
    };
    return (
        <div className="space-y-5">
            <h1
                className="
                    mt-1
                    text-[#9a9a9a]
                "
            >
                Here's your salary overview for{" "}
                <span className="text-yellow-500 font-medium">
                    {currentMonth}
                </span>
            </h1>

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-5
                    gap-4
                "
            >
                {payrollSummary.map((item) => (
                    <PayrollSummaryCard
                        key={item.title}
                        {...item}
                    />
                ))}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-4">
                    <SalaryBreakupCard
                        payrollData={payrollData}
                    />
                </div>

                <div className="xl:col-span-8">
                    <PayrollOverviewCard
                        payrollHistory={
                            payrollHistory
                        }
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-3">
                    <LatestPayslipCard
                        payslip={latestPayslip}
                    />
                </div>

                <div className="xl:col-span-4">
                    <PayrollHistoryCard
                        history={payrollHistory}
                        onViewAll={() =>
                            setShowHistoryModal(true)
                        }
                    />

                </div>

            </div>
            {showHistoryModal && (
                <PayrollHistoryModal
                    history={payrollHistory}
                    onClose={() =>
                        setShowHistoryModal(false)
                    }
                />
            )}
        </div>
    );
};

export default EmployeePayrollDashboard;