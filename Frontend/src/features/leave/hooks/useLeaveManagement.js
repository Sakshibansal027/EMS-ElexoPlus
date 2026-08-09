import { useEffect, useMemo, useState } from "react";
import {
    cancelLeaveApplication,
    getLeaveDashboard,
    updateLeaveApplicationStatus,
} from "../services/leaveService.js";

import useAuth from "../../auth/hooks/useAuth.js";
import { DEFAULT_LEAVE_USER, normalizeEmployeeId } from "../config/roles.js";
import { getLeavePermissions } from "../config/permissions/leavePermissions.js";

import {
    employeePeriodOptions,
    employeeStatusOptions,
    managementDayTypeOptions,
    managementLeaveTypeOptions,
    managementStatusTabs,
} from "../config/leaveOptions.js";

import {
    addLeaveBalancePercentages,
    filterEmployeeLeaves,
    filterManagementLeaves,
    getLeaveAnalytics,
    getUpcomingLeaves,
    paginate,
} from "../shared/utils/leave.js";

import { applyLeaveMessages } from "../config/applyLeaveForm.js";

export const useLeaveManagement = () => {
    const { user: loggedInUser } = useAuth();

    const role =
        loggedInUser?.role ?? DEFAULT_LEAVE_USER.role;

    const userId = normalizeEmployeeId(
        loggedInUser?.employeeId ?? loggedInUser?.id
    );

    const asmId =
        loggedInUser?.asmId ?? DEFAULT_LEAVE_USER.asmId;

    const [data, setData] = useState({
        managementCards: [],
        teamLeaves: [],
        summaryCards: [],
        leaveBalanceData: [],
        leaveHistory: [],
        leavePolicies: [],
        calendarData: {
            events: [],
            holidays: [],
        },
    });

    const [error, setError] = useState(null);

    const [teamPage, setTeamPage] = useState(1);
    const [historyPage, setHistoryPage] = useState(1);

    const [teamFilters, setTeamFilters] = useState({
        status: "All",
        leaveType: "All",
        dayType: "All",
    });

    const [historyStatus, setHistoryStatus] =
        useState("All Status");

    const [historyPeriod, setHistoryPeriod] =
        useState("All Records");

    const [showAllUpcomingLeaves, setShowAllUpcomingLeaves] =
        useState(false);

    const permissions = useMemo(
        () => getLeavePermissions(role),
        [role]
    );

    useEffect(() => {
        let mounted = true;

        const fetchDashboard = async () => {
            try {
                const dashboard = await getLeaveDashboard({
                    role,
                    userId,
                    asmId,
                });

                if (!mounted) return;

                setData({
                    managementCards:
                        dashboard.managementCards ?? [],
                    teamLeaves:
                        dashboard.teamLeaves ?? [],
                    summaryCards:
                        dashboard.summaryCards ?? [],
                    leaveBalanceData:
                        dashboard.leaveBalanceData ?? [],
                    leaveHistory:
                        dashboard.leaveHistory ?? [],
                    leavePolicies:
                        dashboard.leavePolicies ?? [],
                    calendarData:
                        dashboard.calendarData ?? {
                            events: [],
                            holidays: [],
                        },
                });

                setError(null);
            } catch (err) {
                if (mounted) {
                    setError(err);
                }
            }
        };

        fetchDashboard();

        return () => {
            mounted = false;
        };
    }, [role, userId, asmId]);

    const filteredTeamLeaves = useMemo(
        () =>
            filterManagementLeaves(
                data.teamLeaves,
                teamFilters
            ),
        [data.teamLeaves, teamFilters]
    );

    const teamPagination = useMemo(
        () =>
            paginate(filteredTeamLeaves, teamPage, 6),
        [filteredTeamLeaves, teamPage]
    );

    const filteredLeaveHistory = useMemo(
        () =>
            filterEmployeeLeaves(
                data.leaveHistory,
                historyStatus,
                historyPeriod
            ),
        [
            data.leaveHistory,
            historyStatus,
            historyPeriod,
        ]
    );

    const historyPagination = useMemo(
        () =>
            paginate(filteredLeaveHistory, historyPage, 5),
        [filteredLeaveHistory, historyPage]
    );

    const leaveBalanceData = useMemo(
        () =>
            addLeaveBalancePercentages(
                data.leaveBalanceData
            ),
        [data.leaveBalanceData]
    );

    const leaveAnalytics = useMemo(
        () =>
            getLeaveAnalytics(
                data.leaveBalanceData
            ),
        [data.leaveBalanceData]
    );

    const upcomingLeaves = useMemo(
        () =>
            getUpcomingLeaves(
                filteredLeaveHistory
            ),
        [filteredLeaveHistory]
    );

    const visibleUpcomingLeaves = useMemo(
        () =>
            showAllUpcomingLeaves
                ? upcomingLeaves
                : upcomingLeaves.slice(0, 3),
        [upcomingLeaves, showAllUpcomingLeaves]
    );

    const setTeamFilter = (key, value) => {
        setTeamFilters((prev) => ({
            ...prev,
            [key]: value,
        }));

        setTeamPage(1);
    };

    const updateHistoryStatus = (value) => {
        setHistoryStatus(value);
        setHistoryPage(1);
    };

    const updateHistoryPeriod = (value) => {
        setHistoryPeriod(value);
        setHistoryPage(1);
    };

    const changeStatus = async (
        leaveId,
        status
    ) => {
        await updateLeaveApplicationStatus(
            leaveId,
            status
        );

        setData((prev) => ({
            ...prev,
            teamLeaves: prev.teamLeaves.map(
                (leave) =>
                    leave.id === leaveId
                        ? {
                              ...leave,
                              status,
                          }
                        : leave
            ),
        }));
    };

    const cancelLeave = async (leaveId) => {
        const confirmed = window.confirm(
            applyLeaveMessages.confirmCancel
        );

        if (!confirmed) return;

        await cancelLeaveApplication(leaveId);

        setData((prev) => ({
            ...prev,
            leaveHistory:
                prev.leaveHistory.filter(
                    (leave) =>
                        leave.id !== leaveId
                ),
        }));
    };

    return {
        error,

        permissions,

        user: {
            ...loggedInUser,
            role,
            employeeId: userId,
            asmId,
        },

        options: {
            managementStatusTabs,
            managementLeaveTypeOptions,
            managementDayTypeOptions,
            employeeStatusOptions,
            employeePeriodOptions,
        },

        leaveStats: {
            managementCards:
                data.managementCards,
            summaryCards:
                data.summaryCards,
            leaveBalanceData,
            leaveAnalytics,
            calendarData:
                data.calendarData,
        },

        teamLeaves: {
            filters: teamFilters,
            setFilter: setTeamFilter,
            filtered: filteredTeamLeaves,
            pagination: teamPagination,
            currentPage: teamPage,
            setCurrentPage: setTeamPage,
            changeStatus,

            calendarEvents:
                data.calendarData.events,

            holidays:
                data.calendarData.holidays,
        },

        selfLeaves: {
            status: historyStatus,
            period: historyPeriod,
            updateStatus:
                updateHistoryStatus,
            updatePeriod:
                updateHistoryPeriod,
            filtered:
                filteredLeaveHistory,
            pagination:
                historyPagination,
            currentPage:
                historyPage,
            setCurrentPage:
                setHistoryPage,
            upcomingLeaves,
            visibleUpcomingLeaves,
            showAllUpcomingLeaves,
            setShowAllUpcomingLeaves,
            cancelLeave,
        },
    };
};