export const leaveTypeOptions = [
    { value: "CL", label: "Casual Leave" },
    { value: "EL", label: "Earned Leave" },
    { value: "SL", label: "Sick Leave" },
    { value: "ML", label: "Maternity Leave" },
    { value: "PL", label: "Paternity Leave" },
    { value: "CO", label: "Compensatory Off" },
    { value: "LOP", label: "Loss of Pay" },
];

export const managementStatusTabs = ["All", "Pending", "Approved", "Rejected"];
export const managementLeaveTypeOptions = [
    { label: "All Leaves", value: "All" },
    ...leaveTypeOptions,
];
export const managementDayTypeOptions = [
    { label: "All", value: "All" },
    { label: "Full Day", value: "Full Day" },
    { label: "First Half", value: "First Half" },
    { label: "Second Half", value: "Second Half" },
];
export const employeeStatusOptions = [
    { label: "All Status", value: "All Status" },
    { label: "Approved", value: "Approved" },
    { label: "Pending", value: "Pending" },
    { label: "Rejected", value: "Rejected" },
];
export const employeePeriodOptions = [
    { label: "All Records", value: "All Records" },
    { label: "This Month", value: "This Month" },
    { label: "Last 3 Months", value: "Last 3 Months" },
    { label: "This Year", value: "This Year" },
];

