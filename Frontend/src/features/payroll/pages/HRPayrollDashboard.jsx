import ActionableExceptionsDesk from "../components/ActionableExceptionDesk";
import DepartmentWiseLiabilityCard from "../components/DepartmentWiseLiabilityCard";
import HoldDirectory from "../components/HoldDirectory";
import JoiningExitAdjustmentsCard from "../components/JoiningExitAdjustmentsCard";
import LatestPayslipCard from "../components/latestPayslipCard";
import MasterEmployeePayrollDirectory from "../components/MasterEmployeePayrollDirectory";
import PayrollCycleWorkflow from "../components/PayrollCycleWorkflow";
import PayrollHistoryCard from "../components/payrollHistoryCard";
import PayrollHistoryModal from "../components/payrollHistoryModal";
import { PayrollReportsExporter } from "../components/PayrollReportsAndActions";
import PayrollStatCard from "../components/PayrollStatCard";
import PayrollOverviewCard from "../components/payrollOverviewChart";
import SalaryBreakupCard from "../components/salaryBreakupCard";
import { SalaryHoldModal } from "../components/SalaryHoldModal";
import SalaryRevisionCard from "../components/salaryRevisionCard";
import SalaryRevisionDrawer from "../components/salaryRevisionDrawer";
import StatutoryComplianceCard from "../components/StatutoryComplianceCard";
import { PAYROLL_TABS } from "../constants/payroll";
import { useHRPayroll } from "../hooks/useHRPayroll";

const HRPayrollDashboard = () => {
  const payrollTabs = [
    { id: PAYROLL_TABS.MANAGEMENT, label: "Team Operations" },
    { id: PAYROLL_TABS.MY_PAYROLL, label: "My Payroll" },
  ];
  const hr = useHRPayroll();
  const { activeTab, setActiveTab, employee } = hr;

  const { isHoldModalOpen, selectedEmployeeForHold, openHoldModal, closeHoldModal, handleHoldUpdated } = hr;

  return (
    <div className="min-h-screen text-[var(--color-foreground)] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header & Inline Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <p className="text-sm text-zinc-400">
          {activeTab === PAYROLL_TABS.MANAGEMENT ? (
            <>
              Overview of{" "}
              <span className="text-[var(--color-primary,yellow)] font-semibold">
                payroll execution
              </span>
              , employee exceptions, and processing stages.
            </>
          ) : (
            <>
              Here's your{" "}
              <span className="text-[var(--color-primary,yellow)] font-semibold">
                salary overview
              </span>{" "}
              and payslip breakdown for {employee?.currentMonth}.
            </>
          )}
        </p>

        {/* Tab Switcher */}
        <div className="relative inline-flex bg-zinc-950/80 p-1 rounded-xl border border-zinc-800/80 backdrop-blur-md shadow-inner self-start sm:self-auto shrink-0">
          {payrollTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ease-in-out cursor-pointer ${isActive
                    ? "bg-[var(--color-primary,yellow)]/15 border border-[var(--color-primary,yellow)]/40 text-[var(--color-primary,yellow)] shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TEAM OPERATIONS MANAGEMENT TAB */}
      {activeTab === PAYROLL_TABS.MANAGEMENT && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {hr?.statsData?.map((card) => (
              <PayrollStatCard key={card.id || card.title} {...card} />
            ))}
          </div>

          {/* Workflow Stage Tracker */}
          <PayrollCycleWorkflow
            stages={hr?.stages}
            currentStage={hr?.currentStage}
            monthYear="July 2026"
            isAttendanceFrozen={hr?.isAttendanceFrozen}
            isSubmitting={hr?.isSubmitting}
            onFreezeAttendance={hr?.handleFreezeAttendance}
            onSubmitToFinance={hr?.handleSubmitToFinance}
          />

          {/* Analytics & Actionables Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <DepartmentWiseLiabilityCard
                data={hr?.departmentLiability}
                loading={hr?.loading}
              />
              <ActionableExceptionsDesk items={hr?.exceptions} />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <StatutoryComplianceCard items={hr?.complianceData} />
              <JoiningExitAdjustmentsCard
                data={hr?.joiningExitData}
                loading={hr?.loading}
              />
            </div>
          </div>

          {/* 1. Standalone Hold Directory Section */}
          <HoldDirectory
            data={hr?.directoryEmployees}
            onOpenHoldModal={openHoldModal}
          />

          {/* 2. Master Employee Directory Table */}
          <MasterEmployeePayrollDirectory
            data={hr?.directoryEmployees}
            onOpenHoldModal={openHoldModal}
          />
        </div>
      )}

      {/* MY PAYROLL TAB */}
      {activeTab === PAYROLL_TABS.MY_PAYROLL && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {employee?.stats?.map((card) => (
              <PayrollStatCard key={card.id || card.title} {...card} />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-4">
              <SalaryBreakupCard payrollData={employee?.payrollData} />
            </div>
            <div className="xl:col-span-8">
              <PayrollOverviewCard payrollHistory={employee?.payrollHistory} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-4">
              {employee?.latestPayslip && (
                <LatestPayslipCard
                  payslip={employee.latestPayslip}
                  payslipData={employee.payslipData}
                isPayslipOpen={hr.isPayslipOpen}
                onOpenPayslip={hr.openPayslip}
                onClosePayslip={hr.closePayslip}
                onDownloadPayslip={hr.downloadPayslip}
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

          {/* Employee Side Modals */}
          {employee?.isHistoryOpen && (
            <PayrollHistoryModal
              history={employee.payrollHistory}
              onClose={employee.closeHistory}
              onDownload={employee.downloadHistory}
            />
          )}
          {employee?.isRevisionOpen && (
            <SalaryRevisionDrawer
              revisions={employee.salaryRevisions}
              onClose={employee.closeRevisions}
            />
          )}
        </div>
      )}

      {/* SALARY HOLD & RELEASE MODAL */}
      <SalaryHoldModal
        key={selectedEmployeeForHold?.id || selectedEmployeeForHold?.empId || "no-employee"}
        isOpen={isHoldModalOpen}
        onClose={closeHoldModal}
        employee={selectedEmployeeForHold}
        onHoldUpdated={handleHoldUpdated}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <p className="text-sm text-zinc-400">
          Overview of <span className="text-[var(--color-primary,yellow)] font-semibold">payroll execution</span>, employee exceptions, and processing stages.
        </p>

        {/* Reports Exporter Added Here */}
        {activeTab === PAYROLL_TABS.MANAGEMENT && (
          <PayrollReportsExporter
            employeeData={hr?.directoryEmployees || []}
            revisionData={employee?.salaryRevisions}
          />
        )}
      </div>
    </div>
  );
};

export default HRPayrollDashboard;
