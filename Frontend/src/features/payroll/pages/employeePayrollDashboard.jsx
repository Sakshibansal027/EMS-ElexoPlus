// Components
import PayrollStatCard from "../components/payrollStatCard";
import LatestPayslipCard from "../components/latestPayslipCard";
import PayrollOverviewCard from "../components/payrollOverviewChart";
import PayrollHistoryCard from "../components/payrollHistoryCard";
import SalaryBreakupCard from "../components/salaryBreakupCard";
import PayrollHistoryModal from "../components/payrollHistoryModal";
import SalaryRevisionCard from "../components/salaryRevisionCard";
import SalaryRevisionDrawer from "../components/salaryRevisionDrawer";
import IncentiveProjectionCard from "../components/incentiveProjectionCard";
import ExpensesReimbursementCard from "../components/expensesReimbursement";

// Custom Hooks
import { useEmployeePayroll } from "../hooks/useEmployeePayroll";

const EmployeePayrollDashboard = () => {
  const dashboard = useEmployeePayroll();

  return (
    <div className="space-y-5">
      {/* Header Title */}
      <h1 className="mt-1 text-[var(--color-foreground-muted)]">
        Here's your salary overview for{" "}
        <span className="text-yellow-500 font-medium">
          {dashboard?.currentMonth || "this month"}
        </span>
      </h1>

      {/* Main Stats and Breakups */}
      <div className="space-y-6 animate-fadeIn">
        {/* Top Summary Cards (Safe mapping applied) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {(dashboard?.stats || []).map((card) => (
            <PayrollStatCard key={card.id || card.title} {...card} />
          ))}
        </div>

        {/* Salary Breakup & History Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-4">
              <SalaryBreakupCard payrollData={dashboard?.payrollData} />
          </div>
          <div className="xl:col-span-8">
            <PayrollOverviewCard payrollHistory={dashboard?.payrollHistory} />
          </div>
        </div>

        {/* Payslip, History, & Revisions */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-4">
            {dashboard?.latestPayslip && (
              <LatestPayslipCard
                payslip={dashboard.latestPayslip}
                payslipData={dashboard.payslipData}
                isPayslipOpen={dashboard.isPayslipOpen}
                onOpenPayslip={dashboard.openPayslip}
                onClosePayslip={dashboard.closePayslip}
                onDownloadPayslip={dashboard.downloadPayslip}
              />
            )}
          </div>
          <div className="xl:col-span-4">
            <PayrollHistoryCard
              history={dashboard?.payrollHistory}
              onViewAll={dashboard?.openHistory}
              onDownload={dashboard?.downloadHistory}
            />
          </div>
          <div className="xl:col-span-4">
            <SalaryRevisionCard
              revisions={dashboard?.salaryRevisions}
              onViewAll={dashboard?.openRevisions}
            />
          </div>
        </div>

        {/* Payroll History Modal */}
        {dashboard?.isHistoryOpen && (
          <PayrollHistoryModal
              history={dashboard.payrollHistory}
              onClose={dashboard.closeHistory}
              onDownload={dashboard.downloadHistory}
          />
        )}

        {/* Salary Revision Drawer */}
        {dashboard?.isRevisionOpen && (
          <SalaryRevisionDrawer
            isOpen={dashboard.isRevisionOpen}
            revisions={dashboard.salaryRevisions}
            onClose={dashboard.closeRevisions}
          />
        )}
      </div>

      {/* Incentives Projection & Expenses */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-6">
          <IncentiveProjectionCard
            targetData={dashboard.incentiveProjection}
          />
        </div>
        <div className="xl:col-span-6">
          <ExpensesReimbursementCard
            key={(dashboard?.expenseReimbursements || []).map((expense) => `${expense.id}-${expense.status}`).join("|")}
            expenses={dashboard?.expenseReimbursements}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeePayrollDashboard;
