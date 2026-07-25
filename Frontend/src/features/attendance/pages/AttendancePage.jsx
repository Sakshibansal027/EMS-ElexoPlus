
// import PageHeader from "../components/PageHeader";
import AttendanceStats from "../components/AttendanceStats";
import AttendanceFilters from "../components/AttendanceFilters";
import AttendanceTable from "../components/AttendanceTable";
import CorrectionsTable from "../components/CorrectionsTable";
import AttendanceCalendar from "../components/AttendanceCalendar";
import AttendanceTimeline from "../components/AttendanceTimeline";
import LiveClockCard from "../components/LiveClockCard";
import CheckInPanel from "../components/CheckInPanel";
import TodayShiftCard from "../components/TodayShiftCard";
import NotificationsList from "../components/NotificationsList";
import QuickActions from "../components/QuickActions";
import AnalyticsSection from "../widgets/AnalyticsSection";
import ATTENDANCE_ANALYTICS_DATA from "../config/attendanceAnalyticsData";
// import { AttendanceTrendChart, AttendanceBreakdownChart, DepartmentBarChart, } from "../components/AttendanceCharts";

import useAttendance from "../hooks/useAttendance";

const AttendancePage = () => {
    const {
        permissions,
        tabs,
        activeTab,
        setActiveTab,
        search,
        setSearch,
        status,
        setStatus,
        department,
        setDepartment,
        branch,
        setBranch,
        departments,
        branches,
        filteredRecords,
        corrections,

        statCards,
        charts,
    } = useAttendance();

    return (
        <div className="page-enter">

            <div className="mb-10 flex items-start justify-between">
                <div>
                    <p className="mt-2 text-lg text-foreground-muted">
                        Monitor all{" "}
                        <span className="font-semibold text-primary">
                            employee attendance
                        </span>{" "}
                        across your organization.
                    </p>
                </div>
            </div>

            {permissions.showEmployeePanel && (
                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <LiveClockCard />
                    <CheckInPanel />
                    <TodayShiftCard />
                </div>
            )}

            {permissions.showStats && (
                <div className="mt-8 mb-10">
                    <AttendanceStats statCards={statCards} />
                </div>
            )}

            <div className="mb-8 flex flex-wrap gap-2 border-b border-border">

                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 text-sm font-semibold transition-colors ${activeTab === tab
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "Overview" && (
                <div className="space-y-6">

                    {permissions.showAnalytics && (
                        <AnalyticsSection
                            data={ATTENDANCE_ANALYTICS_DATA}
                            charts={charts}
                        />
                    )}

                    {permissions.showDepartmentAnalytics && (
                        <QuickActions />
                    )}

                    {permissions.showCalendar && (
                        <AttendanceCalendar records={filteredRecords} />
                    )}

                    {permissions.showTimeline && (
                        <AttendanceTimeline
                            records={filteredRecords}
                        />
                    )}

                    {permissions.showNotifications && (
                        <NotificationsList />
                    )}
                </div>
            )}

            {activeTab === "All Records" && (
                <div className="space-y-6">

                    <AttendanceFilters
                        search={search}
                        onSearchChange={setSearch}
                        status={status}
                        onStatusChange={setStatus}
                        department={department}
                        onDepartmentChange={setDepartment}
                        departments={departments}
                        branch={branch}
                        onBranchChange={setBranch}
                        branches={branches}
                    />

                    <AttendanceTable
                        records={filteredRecords}
                        showActions={permissions.canEditAttendance}
                    />

                </div>
            )}

            {activeTab === "Corrections" &&
                permissions.showCorrections && (
                    <CorrectionsTable
                        requests={corrections}
                        canApprove={
                            permissions.canApproveCorrections
                        }
                    />
                )}

            {activeTab === "Reports" &&
                permissions.canViewReports && (
                    <div className="space-y-6">

                        <QuickActions />

                        <AttendanceTable
                            records={filteredRecords}
                        />

                    </div>
                )}

        </div>
    );
};

export default AttendancePage;