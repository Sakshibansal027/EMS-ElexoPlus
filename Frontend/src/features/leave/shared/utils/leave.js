export const filterManagementLeaves = (applications, filters) => applications.filter((application) =>
    (filters.status === "All" || application.status === filters.status) &&
    (filters.leaveType === "All" || application.leaveType === filters.leaveType) &&
    (filters.dayType === "All" || application.dayType === filters.dayType)
);

export const filterEmployeeLeaves = (applications, status, period, today = new Date()) => applications.filter((application) => {
    if (status !== "All Status" && application.status !== status) return false;
    const leaveDate = new Date(application.fromDate);
    if (period === "This Month") return leaveDate.getMonth() === today.getMonth() && leaveDate.getFullYear() === today.getFullYear();
    if (period === "Last 3 Months") { const cutoff = new Date(today); cutoff.setMonth(today.getMonth() - 3); return leaveDate >= cutoff; }
    return period !== "This Year" || leaveDate.getFullYear() === today.getFullYear();
});

export const paginate = (items, page, perPage) => {
    const startIndex = (page - 1) * perPage;
    return { records: items.slice(startIndex, startIndex + perPage), startIndex, totalPages: Math.ceil(items.length / perPage) };
};

export const getLeaveAnalytics = (balance) => {
    const chartData = balance.map((item) => ({ name: item.title, value: item.total - item.available }));
    return { chartData, totalDaysTaken: chartData.reduce((sum, item) => sum + item.value, 0) };
};

export const addLeaveBalancePercentages = (balance) => balance.map((leave) => ({
    ...leave,
    percentage: Math.round((leave.available / leave.total) * 100),
}));

export const getUpcomingLeaves = (leaves, today = new Date()) => leaves
    .filter((leave) => new Date(leave.fromDate) > today)
    .sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate));
