// Components
import PayrollStatCard from "../components/payrollStatCard";
import PerformanceTrendChart from "../components/PerformaceTrendChart";
import TeamIncentiveSummaryCard from "../components/TeamIncentiveCard";
import TeamIncentiveModal from "../components/TeamIncentiveModal";
import AttendanceImpactCard from "../components/AttendanceImpactCard";
import QuickReportsCard from "../components/QuickReportsCard";
import ExpenseReimbursementCard from "../components/ExpenseReimbursementCard";
import LatestPayslipCard from "../components/latestPayslipCard";
import PayrollOverviewCard from "../components/payrollOverviewChart";
import PayrollHistoryCard from "../components/payrollHistoryCard";
import SalaryBreakupCard from "../components/salaryBreakupCard";
import PayrollHistoryModal from "../components/payrollHistoryModal";
import SalaryRevisionCard from "../components/salaryRevisionCard";
import SalaryRevisionDrawer from "../components/salaryRevisionDrawer";

// Custom Hooks & Constants
import { useAsmPayroll } from "../hooks/useAsmPayroll";
import { PAYROLL_TABS } from "../constants/payroll";

const PayrollDashboard = () => {
  const page = useAsmPayroll();
  
  // Destructuring with default empty objects for safety
  const {
    activeTab,
    setActiveTab,
    team = {},
    isTeamIncentiveOpen,
    openTeamIncentive,
    closeTeamIncentive,
  } = page;
  const employee = page;

  return (
    <div className="min-h-screen text-[var(--color-foreground)] p-2 sm:p-4 lg:p-6 space-y-6">
      
      {/* Dashboard Top Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <h1 className="mt-1 text-[var(--color-foreground-muted)]">
          {activeTab === PAYROLL_TABS.TEAM ? (
            <>
              Manage and track your{" "}
              <span className="text-primary font-semibold">
                team performance
              </span>
              , incentives, and attendance impact.
            </>
          ) : (
            <>
              Here's your{" "}
              <span className="text-primary font-semibold">
                salary overview
              </span>{" "}
              and payslip breakdown for {employee?.currentMonth || "this month"}.
            </>
          )}
        </h1>

        {/* Tab Switcher */}
        <div className="relative inline-flex bg-zinc-950/80 p-1 rounded-xl border border-zinc-800/80 backdrop-blur-md shadow-inner self-start sm:self-auto shrink-0">
          <TabButton
            active={activeTab === PAYROLL_TABS.TEAM}
            onClick={() => setActiveTab(PAYROLL_TABS.TEAM)}
          >
            Team Operations
          </TabButton>
          <TabButton
            active={activeTab === PAYROLL_TABS.MY_PAYROLL}
            onClick={() => setActiveTab(PAYROLL_TABS.MY_PAYROLL)}
          >
            My Payroll
          </TabButton>
        </div>
      </div>

      {/* 🟢 TAB 1: TEAM OPERATIONS */}
      {activeTab === PAYROLL_TABS.TEAM && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Summary Stats (SAFE OPTIONAL CHAINING ADDED) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {(team?.stats || []).map((card) => (
              <PayrollStatCard key={card.id || card.title} {...card} />
            ))}
          </div>

          {/* Performance Trend & Incentives */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mt-4">
            <div className="xl:col-span-6">
              <PerformanceTrendChart data={team?.trendData} />
            </div>
            <div className="xl:col-span-6">
              <TeamIncentiveSummaryCard
                data={team?.teamIncentives}
                onViewAll={openTeamIncentive}
              />
            </div>
          </div>

          {/* Attendance, Reimbursement, Quick Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 items-stretch">
            <div className="lg:col-span-4 h-full flex flex-col">
              <AttendanceImpactCard data={team?.attendanceImpact} />
            </div>
            <div className="lg:col-span-5 h-full flex flex-col">
              <ExpenseReimbursementCard expenses={team?.expenseReimbursements} />
            </div>
            <div className="lg:col-span-3 h-full flex flex-col">
              <QuickReportsCard reports={team?.quickReports} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY PAYROLL */}
      {activeTab === PAYROLL_TABS.MY_PAYROLL && (
        <div className="space-y-6 animate-fadeIn">
          {/* Employee Top Stats (SAFE OPTIONAL CHAINING ADDED) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {(employee?.stats || []).map((card) => (
              <PayrollStatCard key={card.id || card.title} {...card} />
            ))}
          </div>

          {/* Salary Breakup & Payroll Overview Chart */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-4">
              <SalaryBreakupCard payrollData={employee?.payrollData} />
            </div>
            <div className="xl:col-span-8">
              <PayrollOverviewCard payrollHistory={employee?.payrollHistory} />
            </div>
          </div>

          {/* Payslip, History, & Revisions Cards */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-4">
              {employee?.latestPayslip && (
                <LatestPayslipCard
                  payslip={employee.latestPayslip}
                  payslipData={employee.payslipData}
                isPayslipOpen={employee.isPayslipOpen}
                onOpenPayslip={employee.openPayslip}
                onClosePayslip={employee.closePayslip}
                onDownloadPayslip={employee.downloadPayslip}
                />
              )}
            </div>
            <div className="xl:col-span-4">
              <PayrollHistoryCard
              history={employee?.payrollHistory}
              onViewAll={employee?.openHistory}
              onDownload={employee?.downloadHistory}
              />
            </div>
            <div className="xl:col-span-4">
              <SalaryRevisionCard
                revisions={employee?.salaryRevisions}
                onViewAll={employee?.openRevisions}
              />
            </div>
          </div>

          {/* Payroll History Modal */}
          {employee?.isHistoryOpen && (
            <PayrollHistoryModal
              history={employee.payrollHistory}
              onClose={employee.closeHistory}
              onDownload={employee.downloadHistory}
            />
          )}

          {/* Salary Revision Drawer */}
          {employee?.isRevisionOpen && (
            <SalaryRevisionDrawer
              isOpen={employee.isRevisionOpen}
              revisions={employee.salaryRevisions}
              onClose={employee.closeRevisions}
            />
          )}
        </div>
      )}

      {/* Team Incentive Modal */}
      {isTeamIncentiveOpen && (
        <TeamIncentiveModal
          data={team?.teamIncentives}
          onClose={closeTeamIncentive}
        />
      )}
    </div>
  );
};

// Reusable Tab Button Component
const TabButton = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative z-10 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ease-in-out cursor-pointer select-none ${
      active
        ? "bg-amber-500/15 border border-[var(--color-primary)]/40 text-primary shadow-[0_0_12px_rgba(245,158,11,0.2)]"
        : "text-zinc-400 hover:text-zinc-200 border border-transparent"
    }`}
  >
    {children}
  </button>
);

export default PayrollDashboard;
