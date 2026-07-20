export const formatShortDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

export const getTodayInputValue = () => new Date().toISOString().split("T")[0];
