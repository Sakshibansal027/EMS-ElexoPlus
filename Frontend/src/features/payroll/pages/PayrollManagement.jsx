import React, { useState } from "react";
import { usePayrollManagement } from "../hooks/usePayrollManagement";
import InlineLoader from "../../../components/common/InlineLoader";

// UI Components
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
import IncentiveProjectionCard from "../components/incentiveProjectionCard";
import ExpensesReimbursementCard from "../components/expensesReimbursement";

// Admin & HR Specific Components
import { SalaryStructureManager } from "../components/SalaryStructureManager";
import PayrollTable from "../components/PayrollTable";
import { PayrollVerificationView } from "../components/PayrollVerificationView";
import SalaryRevisionSection from "../components/SalaryRevisionSection";
import LopCases from "../components/LopCases";
import PayrollReports from "../components/PayrollReports";
import BankTransfers from "../components/BankTransfers";
import ActionableExceptionsDesk from "../components/ActionableExceptionDesk";
import DepartmentWiseLiabilityCard from "../components/DepartmentWiseLiabilityCard";
import HoldDirectory from "../components/HoldDirectory";
import JoiningExitAdjustmentsCard from "../components/JoiningExitAdjustmentsCard";
import MasterEmployeePayrollDirectory from "../components/MasterEmployeePayrollDirectory";
import PayrollCycleWorkflow from "../components/PayrollCycleWorkflow";
import { SalaryHoldModal } from "../components/SalaryHoldModal";
import StatutoryComplianceCard from "../components/StatutoryComplianceCard";
import { PayrollReportsExporter } from "../components/PayrollReportsAndActions";

import { adminTabsConfig } from "../config/AdminTabs";
import { PAYROLL_TABS } from "../constants/payroll";
import { LayoutDashboard, Send, X } from "lucide-react";

export const PayrollManagement = () => {
  const {
    permissions,
    metrics = [],
    directory = [],
    teamData = {},
    personalPayroll = {},
    records = [],
    salaryRevisions = [],
    lopCases = [],
    bankTransfers = [],
    reimbursements = [],
    stages = [],
    currentStage = 1,
    exceptions = [],
    complianceData = [],
    departmentLiability = [],
    joiningExitData = null,
    isAttendanceFrozen,
    isSubmitting,
    isFreezing,
    currentPeriodLabel,
    dispatchingPayrollId,
    selectedEmployeeForHold,
    isHoldModalOpen,
    loading,
    error,
    operationError,

    // Modals & Drawers
    isBankDrawerOpen,
    openBankDrawer,
    closeBankDrawer,
    isPayslipOpen,
    isHistoryOpen,
    isRevisionOpen,
    isTeamIncentiveOpen,
    openHoldModal,
    closeHoldModal,
    openPayslip,
    closePayslip,
    openHistory,
    closeHistory,
    openRevisions,
    closeRevisions,
    openTeamIncentive,
    closeTeamIncentive,

    // Actions
    processPayroll,
    verifyPayroll,
    rejectPayroll,
    approvePayroll,
    payPayroll,
    approveSalaryRevision,
    rejectSalaryRevision,
    resolveLopCase,
    handleFreezeAttendance,
    handleSubmitToFinance,
    handleHoldUpdated,
    reviewReimbursement,
    applyReimbursement,
    createReimbursement,
    dispatchBankTransfer,
    viewPayroll,
    downloadPayslip,
    downloadHistory,
  } = usePayrollManagement();

  // Tab states for views with tab switchers
  const [adminActiveTab, setAdminActiveTab] = useState("overview");
  const [dualActiveTab, setDualActiveTab] = useState(PAYROLL_TABS.TEAM || PAYROLL_TABS.MANAGEMENT || "TEAM");
  const [drawerTransferReferences, setDrawerTransferReferences] = useState({});

  const dispatchFromBankDrawer = async (transfer) => {
    const reference = (drawerTransferReferences[transfer.payrollId] || "").trim();
    if (!reference) return;
    await dispatchBankTransfer(transfer.payrollId, reference);
    setDrawerTransferReferences((previous) => {
      const next = { ...previous };
      delete next[transfer.payrollId];
      return next;
    });
  };

  if (loading) {
    return (
      <div className="dashboard-bg p-8 min-h-screen">
        <InlineLoader message="Loading payroll dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-bg p-8 min-h-screen text-[var(--color-danger)]">
        <p className="text-sm font-semibold">Error: {error}</p>
      </div>
    );
  }

  // Determine view mode solely based on permission flags
  const isFullControlView = permissions.showFullPayrollControl;
  const isMasterDirectoryView = permissions.showMasterDirectory && !isFullControlView;
  const isTeamOpsView = permissions.showTeamOperations && !permissions.showMasterDirectory && !isFullControlView;
  const isPersonalOnlyView = !permissions.showTeamOperations && !permissions.showMasterDirectory && !isFullControlView;

  // Helper for admin tabs badge counts
  const totalAdminActions = salaryRevisions.length + lopCases.length;
  const adminTabs = adminTabsConfig.map((tab) => {
    if (tab.id === "operations") return { ...tab, badge: totalAdminActions };
    if (tab.id === "disbursements") return { ...tab, badge: bankTransfers.length };
    return tab;
  });

  return (
    <div className="min-h-screen text-[var(--color-foreground)]">
      {operationError && (
        <div className="sticky top-3 z-40 mx-auto mt-4 max-w-5xl rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {operationError}
        </div>
      )}
      {/* 🔴 1. FULL PAYROLL CONTROL VIEW (ADMIN ORIGINAL UI) */}
      {isFullControlView && (
        <div className="dashboard-bg p-6 sm:p-8 min-h-screen text-[var(--color-foreground)] max-w-7xl mx-auto space-y-6 relative animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <p className="mt-2 text-lg text-foreground-muted">
                Monitor{" "}
                <span className="text-[var(--color-primary)] font-medium">
                  payroll{" "}
                </span>
                disbursements, exceptions, and salary structure configurations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-[var(--color-border)]">
            {adminTabs.map((tab) => {
              const Icon = tab.icon || LayoutDashboard;
              const isActive = adminActiveTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                    isActive
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md"
                      : "bg-[var(--color-background-elevated)] text-[var(--color-foreground-muted)] border-[var(--color-border)] hover:text-[var(--color-foreground)] hover:border-[var(--color-foreground-muted)]"
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? "bg-white/20 text-white" : "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="pt-2">
            {adminActiveTab === "overview" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {metrics.map((card) => (
                    <PayrollStatCard
                      key={card.id || card.title}
                      title={card.title}
                      value={card.value}
                      subtitle={card.subtitle}
                      icon={card.icon}
                      valueColor={card.valueColor}
                      subtitleColor={card.subtitleColor}
                      iconColor={card.iconColor}
                      iconBg={card.iconBg}
                      onClick={() => setAdminActiveTab("operations")}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card p-5 bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[var(--color-foreground)]">Pending Revisions</h3>
                      <button onClick={() => setAdminActiveTab("operations")} className="text-xs text-[var(--color-primary)] font-bold hover:underline cursor-pointer">View All</button>
                    </div>
                    <div className="space-y-2">
                      {salaryRevisions.slice(0, 2).map((rev) => (
                        <div key={rev.id} className="p-3 rounded-xl bg-[var(--color-secondary)]/30 border border-[var(--color-border)] flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-[var(--color-foreground)]">{rev.employeeName}</p>
                            <p className="text-[10px] text-[var(--color-foreground-muted)]">Requested Hike: ₹{rev.requestedAmount}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 font-bold text-[10px]">Pending</span>
                        </div>
                      ))}
                      {salaryRevisions.length === 0 && <p className="text-xs text-[var(--color-foreground-muted)]">No pending revisions.</p>}
                    </div>
                  </div>

                  <div className="card p-5 bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[var(--color-foreground)]">Active LOP Cases</h3>
                      <button onClick={() => setAdminActiveTab("operations")} className="text-xs text-[var(--color-primary)] font-bold hover:underline cursor-pointer">View All</button>
                    </div>
                    <div className="space-y-2">
                      {lopCases.slice(0, 2).map((lop) => (
                        <div key={lop.id} className="p-3 rounded-xl bg-[var(--color-secondary)]/30 border border-[var(--color-border)] flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-[var(--color-foreground)]">{lop.employeeName}</p>
                            <p className="text-[10px] text-[var(--color-foreground-muted)]">{lop.daysMissed} Days Missed</p>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-bold text-[10px]">₹{lop.deductionAmount}</span>
                        </div>
                      ))}
                      {lopCases.length === 0 && <p className="text-xs text-[var(--color-foreground-muted)]">No active LOP cases.</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminActiveTab === "operations" && (
              <div className="space-y-8 animate-fadeIn">
                <section className="space-y-4">
                  <SalaryRevisionSection
                    requests={salaryRevisions}
                    onApprove={approveSalaryRevision}
                    onReject={rejectSalaryRevision}
                  />
                </section>

                <section className="space-y-4 pt-4">
                  <LopCases lopCases={lopCases} onResolve={resolveLopCase} />
                </section>

                <section className="space-y-4 pt-4">
                  <PayrollVerificationView
                    pendingRecords={records.filter((rec) => String(rec.status).toLowerCase() !== "processed")}
                    handleFinalProcess={processPayroll}
                  />
                </section>
              </div>
            )}

            {adminActiveTab === "disbursements" && (
              <div className="space-y-8 animate-fadeIn">
                <section className="space-y-4">
                  <BankTransfers
                    transfers={bankTransfers}
                    onViewAll={openBankDrawer}
                    onDispatch={dispatchBankTransfer}
                    dispatchingPayrollId={dispatchingPayrollId}
                  />
                </section>

                <section className="space-y-4 pt-4">
                  <PayrollReports records={records} />
                </section>
              </div>
            )}

            {adminActiveTab === "records" && (
              <div className="space-y-8 animate-fadeIn">
                <section className="space-y-4">
                  <SalaryStructureManager />
                </section>

                <section className="space-y-4 pt-4">
                  <PayrollTable
                    records={records}
                    onProcess={processPayroll}
                    onVerify={verifyPayroll}
                    onApprove={approvePayroll}
                    onPay={payPayroll}
                    onViewRecord={viewPayroll}
                    onDownloadPayslip={downloadPayslip}
                  />
                </section>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🔵 2. MASTER DIRECTORY & VERIFICATION VIEW (HR ORIGINAL UI) */}
      {isMasterDirectoryView && (
        <div className="min-h-screen text-[var(--color-foreground)] p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
          {/* Header & Inline Tab Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <p className="text-sm text-zinc-400">
              {dualActiveTab !== PAYROLL_TABS.MY_PAYROLL ? (
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
                  and payslip breakdown for {personalPayroll?.currentMonth}.
                </>
              )}
            </p>

            {/* Tab Switcher */}
            <div className="relative inline-flex bg-zinc-950/80 p-1 rounded-xl border border-zinc-800/80 backdrop-blur-md shadow-inner self-start sm:self-auto shrink-0">
              {[
                { id: PAYROLL_TABS.MANAGEMENT || "MANAGEMENT", label: "Team Operations" },
                { id: PAYROLL_TABS.MY_PAYROLL || "MY_PAYROLL", label: "My Payroll" },
              ].map((tab) => {
                const isActive = dualActiveTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDualActiveTab(tab.id)}
                    className={`relative z-10 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ease-in-out cursor-pointer ${
                      isActive
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

          {/* TAB 1: TEAM OPERATIONS / MANAGEMENT */}
          {dualActiveTab !== PAYROLL_TABS.MY_PAYROLL && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {metrics.map((card) => (
                  <PayrollStatCard key={card.id || card.title} {...card} />
                ))}
              </div>

              <PayrollCycleWorkflow
                stages={stages}
                currentStage={currentStage}
                monthYear="July 2026"
                isAttendanceFrozen={isAttendanceFrozen}
                isSubmitting={isSubmitting}
                onFreezeAttendance={handleFreezeAttendance}
                onSubmitToFinance={handleSubmitToFinance}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <DepartmentWiseLiabilityCard data={departmentLiability} loading={loading} />
                  <ActionableExceptionsDesk items={exceptions} />
                </div>
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <StatutoryComplianceCard items={complianceData} />
                  <JoiningExitAdjustmentsCard data={joiningExitData} loading={loading} />
                </div>
              </div>

              <HoldDirectory data={directory} onOpenHoldModal={openHoldModal} />
              <MasterEmployeePayrollDirectory data={directory} onOpenHoldModal={openHoldModal} />
            </div>
          )}

          {/* TAB 2: MY PAYROLL */}
          {dualActiveTab === PAYROLL_TABS.MY_PAYROLL && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {personalPayroll?.stats?.map((card) => (
                  <PayrollStatCard key={card.id || card.title} {...card} />
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-4">
                  <SalaryBreakupCard payrollData={personalPayroll?.payrollData} />
                </div>
                <div className="xl:col-span-8">
                  <PayrollOverviewCard payrollHistory={personalPayroll?.payrollHistory} />
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-4">
                  {personalPayroll?.latestPayslip && (
                    <LatestPayslipCard
                      payslip={personalPayroll.latestPayslip}
                      payslipData={personalPayroll.payslipData}
                      isPayslipOpen={isPayslipOpen}
                      onOpenPayslip={openPayslip}
                      onClosePayslip={closePayslip}
                      onDownloadPayslip={downloadPayslip}
                    />
                  )}
                </div>
                <div className="xl:col-span-4">
                  <PayrollHistoryCard
                    history={personalPayroll?.payrollHistory}
                    onViewAll={openHistory}
                    onDownload={downloadHistory}
                  />
                </div>
                <div className="xl:col-span-4">
                  <SalaryRevisionCard
                    revisions={personalPayroll?.salaryRevisions}
                    onViewAll={openRevisions}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Reports Exporter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <p className="text-sm text-zinc-400">
              Overview of <span className="text-[var(--color-primary,yellow)] font-semibold">payroll execution</span>, employee exceptions, and processing stages.
            </p>
            {dualActiveTab !== PAYROLL_TABS.MY_PAYROLL && (
              <PayrollReportsExporter
                employeeData={directory || []}
                revisionData={personalPayroll?.salaryRevisions}
              />
            )}
          </div>
        </div>
      )}

      {/* 🟡 3. TEAM OPERATIONS VIEW (ASM ORIGINAL UI) */}
      {isTeamOpsView && (
        <div className="min-h-screen text-[var(--color-foreground)] p-2 sm:p-4 lg:p-6 space-y-6 animate-fadeIn">
          {/* Header & Tab Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <h1 className="mt-1 text-[var(--color-foreground-muted)]">
              {dualActiveTab === PAYROLL_TABS.TEAM ? (
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
                  and payslip breakdown for {personalPayroll?.currentMonth || "this month"}.
                </>
              )}
            </h1>

            <div className="relative inline-flex bg-zinc-950/80 p-1 rounded-xl border border-zinc-800/80 backdrop-blur-md shadow-inner self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setDualActiveTab(PAYROLL_TABS.TEAM)}
                className={`relative z-10 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  dualActiveTab === PAYROLL_TABS.TEAM
                    ? "bg-amber-500/15 border border-[var(--color-primary)]/40 text-primary shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                }`}
              >
                Team Operations
              </button>
              <button
                type="button"
                onClick={() => setDualActiveTab(PAYROLL_TABS.MY_PAYROLL)}
                className={`relative z-10 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  dualActiveTab === PAYROLL_TABS.MY_PAYROLL
                    ? "bg-amber-500/15 border border-[var(--color-primary)]/40 text-primary shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                }`}
              >
                My Payroll
              </button>
            </div>
          </div>

          {/* TAB 1: TEAM OPERATIONS */}
          {dualActiveTab === PAYROLL_TABS.TEAM && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {(teamData?.stats || metrics || []).map((card) => (
                  <PayrollStatCard key={card.id || card.title} {...card} />
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mt-4">
                <div className="xl:col-span-6">
                  <PerformanceTrendChart data={teamData?.trendData} />
                </div>
                <div className="xl:col-span-6">
                  <TeamIncentiveSummaryCard
                    data={teamData?.teamIncentives}
                    onViewAll={openTeamIncentive}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 items-stretch">
                <div className="lg:col-span-4 h-full flex flex-col">
                  <AttendanceImpactCard data={teamData?.attendanceImpact} />
                </div>
                <div className="lg:col-span-5 h-full flex flex-col">
                  <ExpenseReimbursementCard
                    expenses={teamData?.expenseReimbursements}
                    onApprove={(reimbursementId) => reviewReimbursement(reimbursementId, "Approved")}
                  />
                </div>
                <div className="lg:col-span-3 h-full flex flex-col">
                  <QuickReportsCard reports={teamData?.quickReports} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY PAYROLL */}
          {dualActiveTab === PAYROLL_TABS.MY_PAYROLL && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {(personalPayroll?.stats || []).map((card) => (
                  <PayrollStatCard key={card.id || card.title} {...card} />
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-4">
                  <SalaryBreakupCard payrollData={personalPayroll?.payrollData} />
                </div>
                <div className="xl:col-span-8">
                  <PayrollOverviewCard payrollHistory={personalPayroll?.payrollHistory} />
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-4">
                  {personalPayroll?.latestPayslip && (
                    <LatestPayslipCard
                      payslip={personalPayroll.latestPayslip}
                      payslipData={personalPayroll.payslipData}
                      isPayslipOpen={isPayslipOpen}
                      onOpenPayslip={openPayslip}
                      onClosePayslip={closePayslip}
                      onDownloadPayslip={downloadPayslip}
                    />
                  )}
                </div>
                <div className="xl:col-span-4">
                  <PayrollHistoryCard
                    history={personalPayroll?.payrollHistory}
                    onViewAll={openHistory}
                    onDownload={downloadHistory}
                  />
                </div>
                <div className="xl:col-span-4">
                  <SalaryRevisionCard
                    revisions={personalPayroll?.salaryRevisions}
                    onViewAll={openRevisions}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🟢 4. PERSONAL PAYROLL ONLY VIEW (SALES EXECUTIVE / SE ORIGINAL UI) */}
      {isPersonalOnlyView && (
        <div className="p-4 sm:p-6 lg:p-8 space-y-5 animate-fadeIn">
          {/* Header Title */}
          <h1 className="mt-1 text-[var(--color-foreground-muted)]">
            Here's your salary overview for{" "}
            <span className="text-yellow-500 font-medium">
              {personalPayroll?.currentMonth || "this month"}
            </span>
          </h1>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {(personalPayroll?.stats || []).map((card) => (
                <PayrollStatCard key={card.id || card.title} {...card} />
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
              <div className="xl:col-span-4">
                <SalaryBreakupCard payrollData={personalPayroll?.payrollData} />
              </div>
              <div className="xl:col-span-8">
                <PayrollOverviewCard payrollHistory={personalPayroll?.payrollHistory} />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
              <div className="xl:col-span-4">
                {personalPayroll?.latestPayslip && (
                  <LatestPayslipCard
                    payslip={personalPayroll.latestPayslip}
                    payslipData={personalPayroll.payslipData}
                    isPayslipOpen={isPayslipOpen}
                    onOpenPayslip={openPayslip}
                    onClosePayslip={closePayslip}
                    onDownloadPayslip={downloadPayslip}
                  />
                )}
              </div>
              <div className="xl:col-span-4">
                <PayrollHistoryCard
                  history={personalPayroll?.payrollHistory}
                  onViewAll={openHistory}
                  onDownload={downloadHistory}
                />
              </div>
              <div className="xl:col-span-4">
                <SalaryRevisionCard
                  revisions={personalPayroll?.salaryRevisions}
                  onViewAll={openRevisions}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <div className="xl:col-span-6">
              <IncentiveProjectionCard targetData={personalPayroll?.incentiveProjection} />
            </div>
                <div className="xl:col-span-6">
              <ExpensesReimbursementCard
                expenses={personalPayroll?.expenseReimbursements}
                onCreate={createReimbursement}
                errorMessage={operationError}
              />
                </div>
          </div>
        </div>
      )}

      {/* --- SHARED MODALS & DRAWERS --- */}

      {/* Salary Hold & Release Modal */}
      <SalaryHoldModal
        key={selectedEmployeeForHold?.id || selectedEmployeeForHold?.empId || "no-employee"}
        isOpen={isHoldModalOpen}
        onClose={closeHoldModal}
        employee={selectedEmployeeForHold}
        onHoldUpdated={handleHoldUpdated}
      />

      {/* Payroll History Modal */}
      {isHistoryOpen && (
        <PayrollHistoryModal
          history={personalPayroll?.payrollHistory}
          onClose={closeHistory}
          onDownload={downloadHistory}
        />
      )}

      {/* Salary Revision Drawer */}
      {isRevisionOpen && (
        <SalaryRevisionDrawer
          isOpen={isRevisionOpen}
          revisions={personalPayroll?.salaryRevisions}
          onClose={closeRevisions}
        />
      )}

      {/* Team Incentive Modal */}
      {isTeamIncentiveOpen && (
        <TeamIncentiveModal
          data={teamData?.teamIncentives}
          onClose={closeTeamIncentive}
        />
      )}

      {/* Side Drawer for Bank Transfers */}
      {isBankDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-all">
          <div className="w-full max-w-lg bg-[var(--color-background-elevated)] h-full p-6 shadow-2xl overflow-y-auto space-y-6 border-l border-[var(--color-border)] animate-slideLeft">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-foreground)]">All Bank Dispatches</h2>
                <p className="text-xs text-[var(--color-foreground-muted)]">Complete list of pending bank payout batches.</p>
              </div>
              <button
                onClick={closeBankDrawer}
                className="p-2 rounded-xl bg-[var(--color-secondary)]/50 hover:bg-[var(--color-secondary)] text-[var(--color-foreground)] cursor-pointer transition-all"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-3">
              {bankTransfers.length === 0 ? (
                <p className="text-xs text-center text-[var(--color-foreground-muted)] py-8">No bank transfers found.</p>
              ) : (
                bankTransfers.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)]/20 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-[var(--color-foreground)]">{t.name}</span>
                      <span className="text-xs font-extrabold text-[var(--color-success)] bg-[var(--color-success)]/10 px-2 py-0.5 rounded">₹{t.amount}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono text-[var(--color-foreground-muted)]">
                      <span>A/C: {t.account}</span>
                      <span>IFSC: {t.ifsc}</span>
                    </div>
                    {t.transferStatus === "Ready" && !t.isOnHold ? (
                      <div className="flex gap-2">
                        <input
                          value={drawerTransferReferences[t.payrollId] || ""}
                          onChange={(event) => setDrawerTransferReferences((previous) => ({
                            ...previous,
                            [t.payrollId]: event.target.value,
                          }))}
                          placeholder="Bank UTR / reference"
                          className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs"
                        />
                        <button
                          type="button"
                          disabled={!drawerTransferReferences[t.payrollId]?.trim() || dispatchingPayrollId === t.payrollId}
                          onClick={() => dispatchFromBankDrawer(t)}
                          className="shrink-0 px-3 py-2 text-xs font-bold rounded-lg bg-[var(--color-primary)] text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 transition inline-flex items-center justify-center gap-1.5"
                        >
                          <Send size={13} /> {dispatchingPayrollId === t.payrollId ? "Dispatching..." : "Dispatch"}
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--color-foreground-muted)]">
                        {t.isOnHold ? "Blocked: employee has an active salary hold." : `Transfer ${t.transferStatus}.`}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollManagement;
