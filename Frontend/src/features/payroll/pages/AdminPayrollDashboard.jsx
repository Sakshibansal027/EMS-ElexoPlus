import React, { useState } from "react";
import { useAdminPayroll } from "../hooks/useAdminPayroll";
import PayrollStatCard from "../components/payrollStatCard";
import { SalaryStructureManager } from "../components/SalaryStructureManager";
import PayrollTable from "../components/PayrollTable";
import PayrollVerificationView from "../components/PayrollVerificationView";
import SalaryRevisionSection from "../components/SalaryRevisionSection";
import LopCases from "../components/LopCases";
import PayrollReports from "../components/PayrollReports";
import BankTransfers from "../components/BankTransfers";
import { adminTabsConfig } from "../config/AdminTabs";
import { X, Send } from "lucide-react";

const AdminPayrollDashboard = () => {
  const { 
    stats = [], 
    loading, 
    salaryRevisions = [], 
    approveSalaryRevision, 
    rejectSalaryRevision,
    lopCases = [], 
    resolveLopCase,
    bankTransfers = [],
    reports = [],
    records = []
  } = useAdminPayroll();

  const [activeTab, setActiveTab] = useState("overview");
  const [isBankDrawerOpen, setIsBankDrawerOpen] = useState(false);

  if (loading) {
    return (
      <div className="dashboard-bg p-8 min-h-screen flex items-center justify-center text-[var(--color-foreground)]">
        <p className="text-lg animate-pulse">Loading payroll dashboard...</p>
      </div>
    );
  }

  const totalActionCount = salaryRevisions.length + lopCases.length;
  
  const tabs = adminTabsConfig.map((tab) => {
    if (tab.id === "operations") return { ...tab, badge: totalActionCount };
    if (tab.id === "disbursements") return { ...tab, badge: bankTransfers.length };
    return tab;
  });

  return (
    <div className="dashboard-bg p-6 sm:p-8 min-h-screen text-[var(--color-foreground)] max-w-7xl mx-auto space-y-6 relative">
      
      {/* Page Header */}
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

      {/* Clean 4-Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[var(--color-border)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {/* Tab Content Area */}
      <div className="pt-2">
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((card) => (
                <PayrollStatCard
                  key={card.id}
                  title={card.title}
                  value={card.value}
                  subtitle={card.subtitle}
                  icon={card.icon}
                  valueColor={card.valueColor}
                  subtitleColor={card.subtitleColor}
                  iconColor={card.iconColor}
                  iconBg={card.iconBg}
                  onClick={() => setActiveTab("operations")}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-5 bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[var(--color-foreground)]">Pending Revisions</h3>
                  <button onClick={() => setActiveTab("operations")} className="text-xs text-[var(--color-primary)] font-bold hover:underline cursor-pointer">View All</button>
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
                  <button onClick={() => setActiveTab("operations")} className="text-xs text-[var(--color-primary)] font-bold hover:underline cursor-pointer">View All</button>
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

        {activeTab === "operations" && (
          <div className="space-y-8 animate-fadeIn">
            <section className="space-y-4">
              <SalaryRevisionSection
                requests={salaryRevisions}
                onApprove={approveSalaryRevision}
                onReject={rejectSalaryRevision}
              />
            </section>

            <section className="space-y-4 pt-4">
              <LopCases
                lopCases={lopCases}
                onResolve={resolveLopCase}
              />
            </section>

            <section className="space-y-4 pt-4">
              <PayrollVerificationView />
            </section>
          </div>
        )}

        {activeTab === "disbursements" && (
          <div className="space-y-8 animate-fadeIn">
            <section className="space-y-4">
              <BankTransfers 
                transfers={bankTransfers} 
                onViewAll={() => setIsBankDrawerOpen(true)} 
              />
            </section>

            <section className="space-y-4 pt-4">
              <PayrollReports records={records} />
            </section>
          </div>
        )}

        {activeTab === "records" && (
          <div className="space-y-8 animate-fadeIn">
            <section className="space-y-4">
              <SalaryStructureManager />
            </section>

            <section className="space-y-4 pt-4">
              <PayrollTable />
            </section>
          </div>
        )}
      </div>

      {/* SIDE DRAWER FOR ALL BANK TRANSFERS */}
      {isBankDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-all">
          <div className="w-full max-w-lg bg-[var(--color-background-elevated)] h-full p-6 shadow-2xl overflow-y-auto space-y-6 border-l border-[var(--color-border)] animate-slideLeft">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-foreground)]">All Bank Dispatches</h2>
                <p className="text-xs text-[var(--color-foreground-muted)]">Complete list of pending bank payout batches.</p>
              </div>
              <button 
                onClick={() => setIsBankDrawerOpen(false)}
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
                    <button
                      onClick={() => alert(`Initiating bank transfer batch for ${t.name}`)}
                      className="w-full py-2 text-xs font-bold rounded-lg bg-[var(--color-primary)] text-primary-foreground hover:opacity-90 transition inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send size={13} /> Dispatch Payout
                    </button>
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

export default AdminPayrollDashboard;