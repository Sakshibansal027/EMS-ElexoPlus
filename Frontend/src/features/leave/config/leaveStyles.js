export const statusStyles = {
    Pending: "bg-[#2d2610] text-[#d4b24c]",
    Approved: "bg-[#1d3326] text-[#6ecf8d]",
    Rejected: "bg-[#331f1f] text-[#d87a7a]",
};

export const borderedStatusStyles = {
    Pending: `${statusStyles.Pending} border border-[#453915]`,
    Approved: `${statusStyles.Approved} border border-[#284734]`,
    Rejected: `${statusStyles.Rejected} border border-[#4a2c2c]`,
};

export const leaveTypeStyles = {
    CL: "bg-[#2d2610] text-[#d4b24c] border border-[#453915]",
    EL: "bg-[#142c3d] text-[#72b8f8] border border-[#1f4058]",
    SL: "bg-[#2a1d33] text-[#c78af0] border border-[#3d2b4a]",
};

export const upcomingStatusStyles = {
    Pending: "bg-yellow-500/10 text-yellow-400",
    Approved: "bg-green-500/10 text-green-400",
    Rejected: "bg-red-500/10 text-red-400",
};

export const selectStyles = {
    control: (base) => ({
        ...base,
        backgroundColor: "#1d1d1d",
        borderColor: "#303030",
        minHeight: "50px",
        boxShadow: "none",
        borderRadius: "12px",
        color: "#f8f8f8",
    }),

    menu: (base) => ({
        ...base,
        backgroundColor: "#1b1b1b",
        border: "1px solid #303030",
        borderRadius: "12px",
    }),

    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "#232323" : "#1b1b1b",
        color: "#f8f8f8",
        cursor: "pointer",
    }),

    singleValue: (base) => ({
        ...base,
        color: "#f8f8f8",
    }),

    placeholder: (base) => ({
        ...base,
        color: "#909090",
    }),

    input: (base) => ({
        ...base,
        color: "#f8f8f8",
    }),

    indicatorSeparator: () => ({
        display: "none",
    }),
};
